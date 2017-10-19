/**
 * CardID server
 * @module servers/cardid
 */
const net = require('net');
const uuid = require('uuid');
const EventEmitter = require('events');
const NError = require('nerror');

/**
 * Server for card reader
 */
class Cardid extends EventEmitter {
    /**
     * Create the service
     * @param {App} app                     Application
     * @param {object} config               Configuration
     * @param {Logger} logger               Logger service
     */
    constructor(app, config, logger) {
        super();

        this.name = null;
        this.servers = new Map();

        this._app = app;
        this._config = config;
        this._logger = logger;
    }

    /**
     * Service name is 'servers.cardid'
     * @type {string}
     */
    static get provides() {
        return 'servers.cardid';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [ 'app', 'config', 'logger' ];
    }

    /**
     * Initialize the server
     * @param {string} name                     Config section name
     * @return {Promise}
     */
    async init(name) {
        this.name = name;

        for (let i = 1; i <= this._config.get(`servers.${this.name}.num_devices`); i++) {
            let server = net.createServer(this.onConnection.bind(this, i));
            server.on('error', this.onServerError.bind(this, i));
            this.servers.set(
                i,
                {
                    server: server,
                    listening: false,
                    clients: new Map(),
                }
            );
        }
    }

    /**
     * Start the server
     * @param {string} name                     Config section name
     * @return {Promise}
     */
    async start(name) {
        if (name !== this.name)
            throw new Error(`Server ${name} was not properly initialized`);

        for (let [i, server] of Array.from(this.servers)) {
            if (server.listening)
                continue;

            let port = parseInt(this._config.get(`servers.${this.name}.base_port`)) + i;
            server.server.listen(port, this._config.get(`servers.${name}.host`));
            await new Promise(resolve => {
                server.server.once('listening', () => {
                    server.listening = true;
                    this._logger.info(`${this.name}: Card ID is listening on ${port}`);
                    resolve();
                });
            });
        }
    }

    /**
     * Stop the server
     * @param {string} name                     Config section name
     * @return {Promise}
     */
    async stop(name) {
        if (name !== this.name)
            throw new Error(`Server ${name} was not properly initialized`);

        for (let [i, server] of Array.from(this.servers)) {
            if (server.listening)
                continue;

            let port = parseInt(this._config.get(`servers.${this.name}.base_port`)) + i;
            server.server.close();
            await new Promise(resolve => {
                server.server.once('close', () => {
                    server.listening = false;
                    this._logger.info(`${this.name}: Card ID is no longer listening on ${port}`);
                    resolve();
                });
            });
        }
    }

    /**
     * Error handler
     * @param {number} device                   Device number
     * @param {object} error                    The error
     * @return {Promise}
     */
    async onServerError(device, error) {
        if (error.syscall !== 'listen')
            return this._logger.error(new NError(error, `Express.onError(${device})`));

        let port = parseInt(this._config.get(`servers.${this.name}.base_port`)) + device;
        let msg;
        switch (error.code) {
            case 'EACCES':
                msg = `${this.name}: Could not bind to port: ${port}`;
                break;
            case 'EADDRINUSE':
                msg = `${this.name}: Port is already in use: ${port}`;
                break;
            default:
                msg = error;
        }
        return this._app.exit(this._app.constructor.fatalExitCode, msg);
    }

    /**
     * Connection handler
     * @param {number} device                   Device number
     * @param {object} socket                   Client socket
     */
    onConnection(device, socket) {
        let server = this.servers.get(device);
        if (!server)
            return;

        if (!server.listening) {
            socket.end();
            return;
        }

        let id = uuid.v1();
        this._logger.debug('daemon', `New socket ${id} on ${device}`);

        let client = {
            socket: socket,
            data: '',
        };
        server.clients.set(id, client);

        socket.on(
            'data',
            async data => {
                if (!await this.onData(device, id, data))
                    socket.end();
            }
        );

        socket.on('error', async error => { await this.onError(device, id, error); });
        socket.on('close', async () => { await this.onClose(device, id); });

        this.emit('connection', device, id);
    }

    /**
     * Client message handler
     * @param {number} device                   Device number
     * @param {string} id                       Client ID
     * @param {Buffer} data                     Message
     * @return {boolean}                        Destroy socket on false
     */
    async onData(device, id, data) {
        let server = this.servers.get(device);
        if (!server)
            return false;

        let client = server.clients.get(id);
        if (!client)
            return false;

        this._logger.debug('cardid', `Incoming message from ${id}`);
        client.data += data.toString();
        return !client.data.includes('\n');
    }

    /**
     * Client error handler
     * @param {number} device                   Device number
     * @param {string} id                       Client ID
     * @param {Error} error                     Error
     */
    async onError(device, id, error) {
        this._logger.error(`Cardid(${device}) socket error: ${error.fullStack || error.stack}`);
    }

    /**
     * Client disconnect handler
     * @param {number} device                   Device number
     * @param {string} id                       Client ID
     */
    async onClose(device, id) {
        let server = this.servers.get(device);
        if (!server)
            return;

        let client = server.clients.get(id);
        if (client) {
            this._logger.debug('daemon', `Client disconnected ${id}`);
            this.emit('new_id', device, client.data);
            client.socket.destroy();
            server.clients.delete(id);
        }
    }
}

module.exports = Cardid;
