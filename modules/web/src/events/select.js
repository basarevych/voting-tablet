/**
 * Select department event
 * @module web/events/select
 */
const NError = require('nerror');

/**
 * Select event class
 */
class SelectEvent {
    /**
     * Create service
     * @param {App} app                         The application
     * @param {Logger} logger                   Logger service
     * @param {Browsers} browsers               Browsers service
     * @param {TargetRepository} targetRepo     Target repository
     */
    constructor(app, logger, browsers, targetRepo) {
        this._app = app;
        this._logger = logger;
        this._browsers = browsers;
        this._targetRepo = targetRepo;
    }

    /**
     * Service name is 'web.events.select'
     * @type {string}
     */
    static get provides() {
        return 'web.events.select';
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
            'repositories.target',
        ];
    }

    /**
     * Event name
     * @type {string}
     */
    get name() {
        return 'select';
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

            if (!browser.device /* || !browser.cardId || !browser.user */)
                return browser.socket.emit('reload');

            let targetId = parseInt(message.id);
            if (!isFinite(targetId))
                return;

            this._logger.debug('select', `Got TARGET ID: ${targetId}`);

            let targets = await this._targetRepo.find(targetId);
            browser.target = (targets.length && targets[0]) || null;

            browser.socket.emit('vote');
        } catch (error) {
            this._logger.error(new NError(error, 'SelectEvent.handle()'));
        }
    }
}

module.exports = SelectEvent;
