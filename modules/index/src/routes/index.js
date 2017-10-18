/**
 * Index route
 * @module index/routes/index
 */
const express = require('express');
const NError = require('nerror');

/**
 * Index route class
 */
class IndexRoute {
    /**
     * Create service
     * @param {object} config                   Configuration
     */
    constructor(config) {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/', this.getIndex.bind(this));
        this.router.get('/start', this.getStart.bind(this));

        this._config = config;
    }

    /**
     * Service name is 'index.routes.index'
     * @type {string}
     */
    static get provides() {
        return 'index.routes.index';
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
     * Main route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    async getIndex(req, res, next) {
        res.render('index');
    }

    /**
     * Start screen route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    async getStart(req, res, next) {
//        if (!req.session.started)
//            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        if (!req.session.started)
            return res.render('sign-in', { numDevices: this._config.get(`servers.cardid.num_devices`)});

        res.render('start');
    }
}

module.exports = IndexRoute;
