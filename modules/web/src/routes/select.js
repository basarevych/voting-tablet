/**
 * Select route
 * @module web/routes/select
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
     * Service name is 'web.routes.select'
     * @type {string}
     */
    static get provides() {
        return 'web.routes.select';
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
        let row = [];
        let width = 4;
        let height = 3;
        for (let i = 1; i <= width * height; i++) {
            if (targets.length)
                row.push(targets.shift());
            else
                row.push(null);

            if (!(i % width)) {
                console.log(row.length);
                result.push(row);
                row = [];
                if (i === width * (height - 1)) {
                    for (let j = 0; j < Math.floor((width - targets.length) / 2); j++) {
                        row.push(null);
                        i++;
                    }
                }
            }
        }

        res.render('select', { targets: result });
    }
}

module.exports = SelectRoute;
