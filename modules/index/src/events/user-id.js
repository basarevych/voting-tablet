/**
 * User ID event
 * @module index/events/user-id
 */
const moment = require('moment-timezone');
const NError = require('nerror');

/**
 * UserId event class
 */
class UserIdEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {UserRepository} userRepo         User repository
     * @param {Map} sockets                     Web sockets
     */
    constructor(app, logger, userRepo, sockets) {
        this._app = app;
        this._logger = logger;
        this._userRepo = userRepo;

        if (!sockets) {
            sockets = new Map();
            this._app.registerInstance(sockets, 'sockets');
        }
        this._sockets = sockets;
    }

    /**
     * Service name is 'index.events.userId'
     * @type {string}
     */
    static get provides() {
        return 'index.events.userId';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'logger',
            'repositories.user',
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
        return 'user_id';
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

            if (!socket.device || socket.user)
                return socket.socket.emit('reload');

            let userId = parseInt(message.id);
            if (!isFinite(userId))
                return;

            this._logger.debug('user-id', `Got USER ID: ${userId}`);

            let user = this._userRepo.getModel();
            user.portalId = userId;
            user.cardId = socket.cardId;
            user.scannedAt = socket.cardTimestamp;
            user.registeredAt = moment();
            await this._userRepo.save(user);

            socket.user = user;
            socket.socket.emit('select');
        } catch (error) {
            this._logger.error(new NError(error, 'UserIdEvent.handle()'));
        }
    }
}

module.exports = UserIdEvent;
