/**
 * Web socket registration event
 * @module web/events/register
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
     * @param {SessionRepository} sessionRepo   Session repository
     */
    constructor(app, logger, session, browsers, sessionRepo) {
        this._app = app;
        this._logger = logger;
        this._session = session;
        this._browsers = browsers;
        this._sessionRepo = sessionRepo;
    }

    /**
     * Service name is 'web.events.register'
     * @type {string}
     */
    static get provides() {
        return 'web.events.register';
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
            'repositories.session',
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

            let version = require('../../package.json').version;
            this._logger.debug('register', `Got REGISTER v${message.version} (our v${version})`);

            let { session } = await this._session.decodeJwt(message.server, message.token);
            if (!session || !session.payload.started)
                return;

            if (require('../../package.json').version !== message.version)
                return browser.socket.emit('reload');

            browser.clear(session.payload.device);
            for (let [oldId, oldBrowser] of this._browsers) {
                if (oldId !== id && oldBrowser.device === browser.device)
                    oldBrowser.clear();
            }
        } catch (error) {
            this._logger.error(new NError(error, 'RegisterEvent.handle()'));
        }
    }
}

module.exports = RegisterEvent;
