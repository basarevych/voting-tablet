/**
 * Vote route
 * @module web/routes/vote
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
     * @param {CommentForm} commentForm         Comment form
     */
    constructor(config, commentForm) {
        this.priority = 0;
        this.router = express.Router();
        this.router.get('/vote', this.getVote.bind(this));
        this.router.post('/vote/comment', this.postVoteComment.bind(this));

        this._config = config;
        this._commentForm = commentForm;
    }

    /**
     * Service name is 'web.routes.vote'
     * @type {string}
     */
    static get provides() {
        return 'web.routes.vote';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'config',
            'web.forms.comment',
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

    /**
     * Post comment route
     * @param {object} req                      Express request
     * @param {object} res                      Express response
     * @param {function} next                   Express next middleware function
     */
    async postVoteComment(req, res, next) {
        if (!req.session.started)
            return next(new NError({ httpStatus: 401 }, 'Unauthorized'));

        try {
            let form = await this._commentForm.validate(res.locals.locale, req.body);
            res.json(form.toJSON());
        } catch (error) {
            next(new NError(error, 'postVoteComment()'));
        }
    }
}

module.exports = VoteRoute;
