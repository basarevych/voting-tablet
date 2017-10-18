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
     * @param {UserRepository} userRepo             User repository
     * @param {Map} sockets                         Web sockets
     */
    constructor(app, config, logger, userRepo, sockets) {
        this._app = app;
        this._config = config;
        this._logger = logger;
        this._userRepo = userRepo;

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
            'repositories.user',
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
                    this._logger.debug('new-id', `Found device`);
                    socket.cardId = message.trim();
                    socket.cardTimestamp = Date.now();

                    let users = await this._userRepo.findByCardId(socket.cardId);
                    socket.user = users.length && users[0];

                    if (socket.user)
                        socket.socket.emit('select');
                    else
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
