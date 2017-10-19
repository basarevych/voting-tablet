/**
 * Web socket registration event
 * @module index/events/register
 */
const NError = require('nerror');

/**
 * Register event class
 */
class RegisterEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {Session} session                 Session service
     * @param {Browsers} browsers               Browsers service
     */
    constructor(app, logger, session, browsers) {
        this._app = app;
        this._logger = logger;
        this._session = session;
        this._browsers = browsers;
    }

    /**
     * Service name is 'index.events.register'
     * @type {string}
     */
    static get provides() {
        return 'index.events.register';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'logger',
            'session',
            'browsers',
        ];
    }

    /**
     * Event name
     * @type {string}
     */
    get name() {
        return 'register';
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

            this._logger.debug('register', `Got REGISTER`);

            let { session } = await this._session.decodeJwt(message.server, message.token);
            if (!session || !session.payload.started)
                return;

            browser.clear();
            browser.device = session.payload.device;

            for (let [oldId, oldBrowser] of this._browsers) {
                if (oldId !== id && oldBrowser.device === browser.device) {
                    oldBrowser.clear();
                    oldBrowser.socket.emit('reload');
                }
            }
        } catch (error) {
            this._logger.error(new NError(error, 'RegisterEvent.handle()'));
        }
    }
}

module.exports = RegisterEvent;
