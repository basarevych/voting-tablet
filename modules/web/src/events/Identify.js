/**
 * Identify user event
 * @module web/events/identify
 */
const moment = require('moment-timezone');
const NError = require('nerror');

/**
 * Identify event class
 */
class IdentifyEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {Browsers} browsers               Browsers service
     * @param {UserRepository} userRepo         User repository
     */
    constructor(app, logger, browsers, userRepo) {
        this._app = app;
        this._logger = logger;
        this._browsers = browsers;
        this._userRepo = userRepo;
    }

    /**
     * Service name is 'web.events.identify'
     * @type {string}
     */
    static get provides() {
        return 'web.events.identify';
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
            'repositories.user',
        ];
    }

    /**
     * Event name
     * @type {string}
     */
    get name() {
        return 'identify';
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

            if (!browser.device /* || !browser.cardId */)
                return browser.socket.emit('reload');

            let userId = parseInt(message.id);
            if (!isFinite(userId))
                return;

            this._logger.debug('identify', `Got USER ID: ${userId}`);

            let user = this._userRepo.getModel();
            user.portalId = userId;
            user.cardId = browser.cardId;
            user.scannedAt = browser.cardTimestamp;
            user.registeredAt = moment();
            await this._userRepo.save(user);

            browser.user = user;
            browser.socket.emit('select');
        } catch (error) {
            this._logger.error(new NError(error, 'IdentifyEvent.handle()'));
        }
    }
}

module.exports = IdentifyEvent;
