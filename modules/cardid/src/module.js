/**
 * CardID module
 * @module daemon/cardid
 */

/**
 * Module main class
 */
class CardidModule {
    /**
     * Create the module
     * @param {App} app                                     The application
     * @param {object} config                               Configuration
     */
    constructor(app, config) {
        this._app = app;
        this._config = config;
    }

    /**
     * Service name is 'modules.cardid'
     * @type {string}
     */
    static get provides() {
        return 'modules.cardid';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'config',
        ];
    }

    /**
     * Bootstrap module
     * @return {Promise}
     */
    async bootstrap() {
        this.events = this._app.get(/^cardid.events.[^.]+$/);
    }

    /**
     * Register module with the server
     * @param {object} server                                       Server instance
     * @return {Promise}
     */
    async register(server) {
        if (server.constructor.provides !== 'servers.cardid')
            return;

        for (let event of this.events.values())
            server.on(event.name, event.handle.bind(event));
    }
}

module.exports = CardidModule;
