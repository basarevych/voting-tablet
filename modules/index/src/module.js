/**
 * Index module
 * @module index/module
 */

/**
 * Module main class
 */
class Index {
    /**
     * Create the module
     * @param {App} app                                     The application
     * @param {object} config                               Configuration
     * @param {I18n} i18n                                   I18n service
     */
    constructor(app, config, i18n) {
        this._app = app;
        this._config = config;
        this._i18n = i18n;
    }

    /**
     * Service name is 'modules.index'
     * @type {string}
     */
    static get provides() {
        return 'modules.index';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [
            'app',
            'config',
            'i18n',
        ];
    }

    /**
     * Bootstrap the module
     * @return {Promise}
     */
    async bootstrap() {
        this._i18n.defaultLocale = 'ru';
        this.routes = this._app.get(/^index\.routes\..+$/);
        this.events = this._app.get(/^index\.events\..+$/);
    }

    /**
     * Register module with the server
     * @param {object} server                                       Server instance
     * @return {Promise}
     */
    async register(server) {
        if (server.constructor.provides !== 'servers.express')
            return;

        for (let event of this.events.values())
            server.on('socket_' + event.name, event.handle.bind(event));
    }

    /**
     * Get module routers
     * @return {object[]}
     */
    routers() {
        return Array.from(this.routes.values()).map(route => {
            return { priority: route.priority, router: route.router };
        });
    }
}

module.exports = Index;
