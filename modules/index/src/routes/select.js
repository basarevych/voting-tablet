/**
 * Select route
 * @module index/routes/select
 */
const express = require('express');
const NError = require('nerror');

/**
 * Select route class
 */
class SelectRoute {
    /**
     * Create service
     * @param {object} config                   Configuration
     * @param {TargetRepository} targetRepo     Target repository
     */
    constructor(config, targetRepo) {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/select', this.getSelect.bind(this));

        this._config = config;
        this._targetRepo = targetRepo;
    }

    /**
     * Service name is 'index.routes.select'
     * @type {string}
     */
    static get provides() {
        return 'index.routes.select';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'config',
            'repositories.target',
        ];
    }

    /**
     * List targets route
     * @param {object} req          Express request
     * @param {object} res          Express response
     * @param {function} next       Express next middleware function
     */
    async getSelect(req, res, next) {
        if (!req.session.started)
            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        let targets = await this._targetRepo.findAll();

        let result = [];
        let i = 0;
        let row = [];
        for (let target of targets) {
            row.push(target);
            if (++i >= 3) {
                result.push(row);
                row = [];
                i = 0;
            }
        }

        res.render('select', { targets: result });
    }
}

module.exports = SelectRoute;
