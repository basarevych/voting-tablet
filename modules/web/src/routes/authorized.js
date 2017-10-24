/**
 * Authorized route
 * @module web/routes/authorized
 */
const express = require('express');

/**
 * Authorized route class
 */
class AuthorizedRoute {
    /**
     * Create service
     */
    constructor() {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/authorized', this.getAuthorized.bind(this));
    }

    /**
     * Service name is 'web.routes.authorized'
     * @type {string}
     */
    static get provides() {
        return 'web.routes.authorized';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [];
    }

    /**
     * Main route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    getAuthorized(req, res, next) {
        res.json({
            success: !!req.session.started,
            server: req.session.server,
            token: req.session.token,
        });
    }
}

module.exports = AuthorizedRoute;
