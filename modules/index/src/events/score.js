/**
 * Score event
 * @module index/events/score
 */
const moment = require('moment-timezone');
const NError = require('nerror');

/**
 * Score event class
 */
class ScoreEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {Browsers} browsers               Browsers service
     * @param {TargetRepository} targetRepo     Target repository
     * @param {VoteRepository} voteRepo         Vote repository
     */
    constructor(app, logger, browsers, targetRepo, voteRepo) {
        this._app = app;
        this._logger = logger;
        this._browsers = browsers;
        this._targetRepo = targetRepo;
        this._voteRepo = voteRepo;
    }

    /**
     * Service name is 'index.events.score'
     * @type {string}
     */
    static get provides() {
        return 'index.events.score';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'logger',
            'browsers',
            'repositories.target',
            'repositories.vote',
        ];
    }

    /**
     * Event name
     * @type {string}
     */
    get name() {
        return 'score';
    }

    /**
     * Handle event
     * @param {string} id                       Socket ID
     * @param {object} message                  Socket message
     */
    async handle(id, message) {
        try {
            let browser = this._browsers.get(id);
            if (!browser || typeof message !== 'object' || message === null)
                return;

            if (!browser.device || !browser.cardId || !browser.user || !browser.target)
                return browser.socket.emit('reload');

            let score = parseInt(message.score);
            if (!isFinite(score))
                return;

            this._logger.debug('score', `Got SCORE: ${score}`);

            let vote = this._voteRepo.getModel();
            vote.userId = browser.user.id;
            vote.portalId = browser.user.portalId;
            vote.targetId = browser.target.id;
            vote.score = score;
            vote.votedAt = moment();

            browser.clear();

            await this._voteRepo.save(vote);
        } catch (error) {
            this._logger.error(new NError(error, 'ScoreEvent.handle()'));
        }
    }
}

module.exports = ScoreEvent;
