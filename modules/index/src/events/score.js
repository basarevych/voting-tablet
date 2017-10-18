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
     * @param {TargetRepository} targetRepo     Target repository
     * @param {VoteRepository} voteRepo         Vote repository
     * @param {Map} sockets                     Web sockets
     */
    constructor(app, logger, targetRepo, voteRepo, sockets) {
        this._app = app;
        this._logger = logger;
        this._targetRepo = targetRepo;
        this._voteRepo = voteRepo;

        if (!sockets) {
            sockets = new Map();
            this._app.registerInstance(sockets, 'sockets');
        }
        this._sockets = sockets;
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
            'repositories.target',
            'repositories.vote',
            'sockets?',
        ];
    }

    /**
     * Event type
     * @type {string}
     */
    get type() {
        return 'socket';
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
            let socket = this._sockets.get(id);
            if (!socket || typeof message !== 'object' || message === null)
                return;

            if (!socket.device || !socket.user || !socket.targetId)
                return socket.socket.emit('reload');

            let score = parseInt(message.score);
            if (!isFinite(score))
                return;

            this._logger.debug('score', `Got SCORE: ${score}`);

            let vote = this._voteRepo.getModel();
            vote.userId = socket.user.id;
            vote.portalId = socket.user.portalId;
            vote.targetId = socket.targetId;
            vote.score = score;
            vote.votedAt = moment();

            delete socket.user;
            delete socket.targetId;

            await this._voteRepo.save(vote);
        } catch (error) {
            this._logger.error(new NError(error, 'ScoreEvent.handle()'));
        }
    }
}

module.exports = ScoreEvent;
