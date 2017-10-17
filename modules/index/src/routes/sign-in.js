/**
 * SignIn route
 * @module index/routes/sign-in
 */
const express = require('express');

/**
 * SignIn route class
 */
class SignInRoute {
    /**
     * Create service
     * @param {object} config                   Configuration
     * @param {SignInForm} signInForm           SignIn form
     */
    constructor(config, signInForm) {
        this.priority = 0;
        this.router = express.Router();
        this.router.post('/sign-in', this.postSignIn.bind(this));
        this.router.get('/sign-out', this.getSignOut.bind(this));

        this._config = config;
        this._signInForm = signInForm;
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
            'config',
            'forms.signIn'
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
