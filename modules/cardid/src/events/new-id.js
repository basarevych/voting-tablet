/**
 * New ID event
 * @module cardid/events/new-id
 */
const NError = require('nerror');

/**
 * New ID event class
 */
class NewId {
    /**
     * Create service
     * @param {App} app                             The application
     * @param {object} config                       Configuration
     * @param {Logger} logger                       Logger service
     * @param {Browsers} browsers                   Browsers service
     * @param {UserRepository} userRepo             User repository
     */
    constructor(app, config, logger, browsers, userRepo) {
        this._app = app;
        this._config = config;
        this._logger = logger;
        this._browsers = browsers;
        this._userRepo = userRepo;
    }

    /**
     * Service name is 'cardid.events.newId'
     * @type {string}
     */
    static get provides() {
        return 'cardid.events.newId';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'config',
            'logger',
            'browsers',
            'repositories.user',
        ];
    }

    /**
     * Event name
     * @type string
     */
    get name() {
        return 'new_id';
    }

    /**
     * Event handler
     * @param {number} device       Device number
     * @param {string} message      The message
     */
    async handle(device, message) {
        try {
            this._logger.debug('new-id', `Got NEW ID on ${device}: ${message}`);

            for (let browser of this._browsers.values()) {
                if (browser.device === device) {
                    this._logger.debug('new-id', `Found device`);
                    browser.clear(device);
                    browser.cardId = message.trim();
                    browser.cardTimestamp = Date.now();

                    let users = await this._userRepo.findByCardId(browser.cardId);
                    browser.user = (users.length && users[0]) || null;
                    browser.socket.emit(browser.user ? 'select' : 'identify');
                    break;
                }
            }
        } catch (error) {
            this._logger.error(new NError(error, 'NewId.handle()'));
        }
    }

    /**
     * Retrieve cardid server
     * @return {Cardid}
     */
    get cardid() {
        if (this._cardid)
            return this._cardid;
        this._cardid = this._app.get('servers').get('cardid');
        return this._cardid;
    }
}

module.exports = NewId;
