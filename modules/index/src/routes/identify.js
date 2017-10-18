/**
 * Identify route
 * @module index/routes/identify
 */
const express = require('express');
const NError = require('nerror');

/**
 * Identify route class
 */
class IdentifyRoute {
    /**
     * Create service
     * @param {object} config                   Configuration
     * @param {PersonalRepository} personalRepo Personal repository
     */
    constructor(config, personalRepo) {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/identify', this.getIdentify.bind(this));

        this._config = config;
        this._personalRepo = personalRepo;
    }

    /**
     * Service name is 'index.routes.identify'
     * @type {string}
     */
    static get provides() {
        return 'index.routes.identify';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'config',
            'repositories.personal',
        ];
    }

    /**
     * List users route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    async getIdentify(req, res, next) {
        if (!req.session.started)
            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        let users = await this._personalRepo.findAllActive();
        res.render('identify', { users });
    }
}

module.exports = IdentifyRoute;
