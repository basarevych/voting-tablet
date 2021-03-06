/**
 * Web socket disconnected event
 * @module web/events/disconnect
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
     * @param {Browsers} browsers               Browsers service
     */
    constructor(app, logger, browsers) {
        this._app = app;
        this._logger = logger;
        this._browsers = browsers;
    }

    /**
     * Service name is 'web.events.disconnect'
     * @type {string}
     */
    static get provides() {
        return 'web.events.disconnect';
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
        return 'disconnect';
    }

    /**
     * Handle event
     * @param {string} id                       Socket ID
     */
    async handle(id) {
        try {
            this._logger.debug('connection', `Disconnected ${id}`);
            this._browsers.remove(id);
        } catch (error) {
            this._logger.error(new NError(error, 'DisconnectEvent.handle()'));
        }
    }
}

module.exports = DisconnectEvent;
