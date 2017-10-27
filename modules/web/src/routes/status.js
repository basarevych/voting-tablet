/**
 * Status route
 * @module web/routes/status
 */
const express = require('express');

/**
 * Status route class
 */
class StatusRoute {
    /**
     * Create service
     */
    constructor() {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/status', this.getStatus.bind(this));
    }

    /**
     * Service name is 'web.routes.status'
     * @type {string}
     */
    static get provides() {
        return 'web.routes.status';
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
    getStatus(req, res, next) {
        res.json({
            authorized: !!req.session.started,
            server: req.session.server,
            token: req.session.token,
        });
    }
}

module.exports = StatusRoute;
