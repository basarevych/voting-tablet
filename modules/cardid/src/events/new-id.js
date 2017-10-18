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
     * @param {Map} sockets                         Web sockets
     */
    constructor(app, config, logger, sockets) {
        this._app = app;
        this._config = config;
        this._logger = logger;

        if (!sockets) {
            sockets = new Map();
            this._app.registerInstance(sockets, 'sockets');
        }
        this._sockets = sockets;
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
            'sockets?'
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

            for (let socket of this._sockets.values()) {
                if (socket.device === device) {
                    socket.card = message.trim();
                    socket.socket.emit('identify');
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
