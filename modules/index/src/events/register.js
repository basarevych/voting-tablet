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
     * @param {SessionRepository} sessionRepo   Session repository
     * @param {Map} sockets                     Web sockets
     */
    constructor(app, logger, session, sessionRepo, sockets) {
        this._app = app;
        this._logger = logger;
        this._session = session;
        this._sessionRepo = sessionRepo;

        if (!sockets) {
            sockets = new Map();
            this._app.registerInstance(sockets, 'sockets');
        }
        this._sockets = sockets;
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
            'repositories.session',
            'sockets?',
        ];
    }

    /**
     * Event type
     * @type {string}
     */
    get type() {
        return 'socket';
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
            let socket = this._sockets.get(id);
            if (!socket || typeof message !== 'object' || message === null)
                return;

            let { session } = this._session.decodeJwt(message.server, message.token);
            if (!session || !session.payload.started)
                return;

            socket.device = session.payload.device;

            for (let old of this._sessionRepo.findByDevice(socket.device)) {
                if (old.id !== session.id)
                    await this._session.destroy(message.server, old);
            }

            for (let [oldId, oldSocket] of this._sockets) {
                if (oldId !== id && oldSocket.device === socket.device) {
                    oldSocket.socket.emit('reload');
                    this._sockets.delete(oldId);
                }
            }
        } catch (error) {
            this._logger.error(new NError(error, 'RegisterEvent.handle()'));
        }
    }
}

module.exports = RegisterEvent;
