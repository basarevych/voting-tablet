/**
 * Vote route
 * @module index/routes/vote
 */
const express = require('express');
const NError = require('nerror');

/**
 * Vote route class
 */
class VoteRoute {
    /**
     * Create service
     * @param {object} config                   Configuration
     */
    constructor(config) {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/vote', this.getVote.bind(this));

        this._config = config;
    }

    /**
     * Service name is 'index.routes.vote'
     * @type {string}
     */
    static get provides() {
        return 'index.routes.vote';
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
     * List users route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    async getVote(req, res, next) {
        if (!req.session.started)
            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        res.render('vote');
    }
}

module.exports = VoteRoute;
