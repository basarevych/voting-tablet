/**
 * Sign route
 * @module web/routes/sign
 */
const express = require('express');
const NError = require('nerror');

/**
 * Sign route class
 */
class SignRoute {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {object} config                   Configuration
     * @param {SignInForm} signInForm           SignIn form
     * @param {Session} session                 Session service
     * @param {Browsers} browsers               Browsers service
     * @param {SessionRepository} sessionRepo   Session repository
     */
    constructor(app, config, signInForm, session, browsers, sessionRepo) {
        this.priority = 0;
        this.router = express.Router();
        this.router.post('/sign-in', this.postSignIn.bind(this));
        this.router.get('/sign-out', this.getSignOut.bind(this));

        this._app = app;
        this._config = config;
        this._signInForm = signInForm;
        this._session = session;
        this._browsers = browsers;
        this._sessionRepo = sessionRepo;
    }

    /**
     * Service name is 'web.routes.sign'
     * @type {string}
     */
    static get provides() {
        return 'web.routes.sign';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'config',
            'web.forms.signIn',
            'session',
            'browsers',
            'repositories.session',
        ];
    }

    /**
     * Sign in route
     * @param {object} req                      Express request
     * @param {object} res                      Express response
     * @param {function} next                   Express next middleware function
     */
    async postSignIn(req, res, next) {
        if (req.session.started)
            return next(new NError({ httpStatus: 403 }, 'Forbidden'));

        try {
            let form = await this._signInForm.validate(res.locals.locale, req.body);
            let pinCode = form.getField('pin_code');
            form.setField('pin_code', '');

            if (!form.success || req.body._validate)
                return res.json(form.toJSON());

            if (this._config.get('servers.cardid.pin_code') !== pinCode) {
                form.addMessage('error', 'sign_in_invalid_credentials');
                return res.json(form.toJSON());
            }

            req.session.started = Date.now();
            req.session.device = form.getField('device');
            req.user = null;

            for (let old of await this._sessionRepo.findByDevice(req.session.device))
                await this._session.destroyAll(old);

            for (let browser of this._browsers.values()) {
                if (browser.device === req.session.device) {
                    browser.clear();
                    browser.socket.emit('reload');
                }
            }

            res.json({ success: true });
        } catch (error) {
            next(new NError(error, 'postSignIn()'));
        }
    }

    /**
     * Sign out route
     * @param {object} req                      Express request
     * @param {object} res                      Express response
     * @param {function} next                   Express next middleware function
     */
    async getSignOut(req, res, next) {
        if (!req.session.started)
            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        req.user = null;
        req.session = {};
        res.redirect('/');
    }
}

module.exports = SignRoute;
