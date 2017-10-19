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
            'browsers',
            'repositories.user',
        ];
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
            let browser = this._browsers.get(id);
            if (!browser || typeof message !== 'object' || message === null)
                return;

            if (!browser.device || !browser.cardId || browser.user)
                return browser.socket.emit('reload');

            let userId = parseInt(message.id);
            if (!isFinite(userId))
                return;

            this._logger.debug('user-id', `Got USER ID: ${userId}`);

            let user = this._userRepo.getModel();
            user.portalId = userId;
            user.cardId = browser.cardId;
            user.scannedAt = browser.cardTimestamp;
            user.registeredAt = moment();
            await this._userRepo.save(user);

            browser.user = user;
            browser.socket.emit('select');
        } catch (error) {
            this._logger.error(new NError(error, 'UserIdEvent.handle()'));
        }
    }
}

module.exports = UserIdEvent;
