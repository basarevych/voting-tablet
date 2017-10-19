/**
 * Web socket connection event
 * @module index/events/connection
 */
const NError = require('nerror');

/**
 * Connection event class
 */
class ConnectionEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {Browsers} browsers               Browsers service
     */
    constructor(app, logger, browsers) {
        this._app = app;
        this._logger = logger;
        this._browsers = browsers;
    }

    /**
     * Service name is 'index.events.connection'
     * @type {string}
     */
    static get provides() {
        return 'index.events.connection';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return ['app', 'logger', 'browsers'];
    }

    /**
     * Event name
     * @type {string}
     */
    get name() {
        return 'connection';
    }

    /**
     * Handle event
     * @param {string} id                       Socket ID
     * @param {object} socket                   Web socket
     */
    async handle(id, socket) {
        try {
            this._logger.debug('connection', `Connected ${id}`);
            this._browsers.add(id, socket);
        } catch (error) {
            this._logger.error(new NError(error, 'ConnectionEvent.handle()'));
        }
    }
}

module.exports = ConnectionEvent;
