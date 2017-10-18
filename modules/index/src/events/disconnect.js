/**
 * Web socket disconnected event
 * @module index/events/disconnect
 */
const NError = require('nerror');

/**
 * Disconnect event class
 */
class DisconnectEvent {
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
     * Service name is 'index.events.disconnect'
     * @type {string}
     */
    static get provides() {
        return 'index.events.disconnect';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return ['app', 'logger', 'sockets?'];
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
        return 'disconnect';
    }

    /**
     * Handle event
     * @param {string} id                       Socket ID
     */
    async handle(id) {
        try {
            this._logger.debug('connection', `Disconnected ${id}`);
            this._sockets.delete(id);
        } catch (error) {
            this._logger.error(new NError(error, 'DisconnectEvent.handle()'));
        }
    }
}

module.exports = DisconnectEvent;