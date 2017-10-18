/**
 * SignIn route
 * @module index/routes/sign-in
 */
const express = require('express');
const NError = require('nerror');

/**
 * SignIn route class
 */
class SignInRoute {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {object} config                   Configuration
     * @param {SignInForm} signInForm           SignIn form
     * @param {Session} session                 Session service
     * @param {SessionRepository} sessionRepo   Session repository
     * @param {Map} sockets                     Web sockets
     */
    constructor(app, config, signInForm, session, sessionRepo, sockets) {
        this.priority = 0;
        this.router = express.Router();
        this.router.post('/sign-in', this.postSignIn.bind(this));
        this.router.get('/sign-out', this.getSignOut.bind(this));

        this._app = app;
        this._config = config;
        this._signInForm = signInForm;
        this._session = session;
        this._sessionRepo = sessionRepo;

        if (!sockets) {
            sockets = new Map();
            this._app.registerInstance(sockets, 'sockets');
        }
        this._sockets = sockets;
    }

    /**
     * Service name is 'index.routes.signIn'
     * @type {string}
     */
    static get provides() {
        return 'index.routes.signIn';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'config',
            'forms.signIn',
            'session',
            'repositories.session',
            'sockets?',
        ];
    }

    /**
     * Sign in route
     * @param {object} req                      Express request
     * @param {object} res                      Express response
     * @param {function} next                   Express next middleware function
     */
    async postSignIn(req, res, next) {
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

            for (let socket of this._sockets.values()) {
                if (socket.device === req.session.device) {
                    delete socket.device;
                    socket.socket.emit('reload');
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
        req.user = null;
        req.session = {};
        res.redirect('/');
    }
}

module.exports = SignInRoute;
