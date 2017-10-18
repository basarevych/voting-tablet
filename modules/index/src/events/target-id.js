/**
 * Target ID event
 * @module index/events/target-id
 */
const NError = require('nerror');

/**
 * TargetId event class
 */
class TargetIdEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {Map} sockets                     Web sockets
     */
    constructor(app, logger, sockets) {
        this._app = app;
        this._logger = logger;

        if (!sockets) {
            sockets = new Map();
            this._app.registerInstance(sockets, 'sockets');
        }
        this._sockets = sockets;
    }

    /**
     * Service name is 'index.events.targetId'
     * @type {string}
     */
    static get provides() {
        return 'index.events.targetId';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'logger',
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
        return 'target_id';
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

            if (!socket.device || !socket.user)
                return socket.socket.emit('reload');

            let targetId = parseInt(message.id);
            if (!isFinite(targetId))
                return;

            this._logger.debug('target-id', `Got TARGET ID: ${targetId}`);

            socket.targetId = targetId;
            socket.socket.emit('vote');
        } catch (error) {
            this._logger.error(new NError(error, 'TargetIdEvent.handle()'));
        }
    }
}

module.exports = TargetIdEvent;
