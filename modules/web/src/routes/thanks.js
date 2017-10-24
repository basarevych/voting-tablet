/**
 * Thanks route
 * @module web/routes/thanks
 */
const express = require('express');
const NError = require('nerror');

/**
 * Thanks route class
 */
class ThanksRoute {
    /**
     * Create service
     * @param {object} config                   Configuration
     */
    constructor(config) {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/thanks', this.getThanks.bind(this));

        this._config = config;
    }

    /**
     * Service name is 'web.routes.thanks'
     * @type {string}
     */
    static get provides() {
        return 'web.routes.thanks';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'config',
        ];
    }

    /**
     * Thanks route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    async getThanks(req, res, next) {
        if (!req.session.started)
            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        res.render('thanks');
    }
}

module.exports = ThanksRoute;
