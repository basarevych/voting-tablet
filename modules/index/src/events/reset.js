/**
 * Reset event
 * @module index/events/reset
 */
const NError = require('nerror');

/**
 * Reset event class
 */
class ResetEvent {
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
     * Service name is 'index.events.reset'
     * @type {string}
     */
    static get provides() {
        return 'index.events.reset';
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
        ];
    }

    /**
     * Event name
     * @type {string}
     */
    get name() {
        return 'reset';
    }

    /**
     * Handle event
     * @param {string} id                       Socket ID
     */
    async handle(id) {
        try {
            let browser = this._browsers.get(id);
            if (!browser)
                return;

            browser.clear(browser.device);
        } catch (error) {
            this._logger.error(new NError(error, 'ResetEvent.handle()'));
        }
    }
}

module.exports = ResetEvent;
