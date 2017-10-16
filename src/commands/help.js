/**
 * Help command
 * @module commands/help
 */
const argvParser = require('argv');

/**
 * Command to print usage
 */
class Help {
    /**
     * Create the service
     * @param {App} app                 The application
     * @param {object} config           Configuration
     * @param {Util} util               Utility service
     */
    constructor(app, config, util) {
        this._app = app;
        this._config = config;
        this._util = util;
    }

    /**
     * Service name is 'commands.help'
     * @type {string}
     */
    static get provides() {
        return 'commands.help';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [ 'app', 'config', 'util' ];
    }

    /**
     * Run the command
     * @param {string[]} argv           Arguments
     * @return {Promise}
     */
    async run(argv) {
        let args = argvParser
            .option({
                name: 'help',
                short: 'h',
                type: 'boolean',
            })
            .run(argv);

        if (args.targets.length < 2)
            return this.usage();

        let method = this[`help${this._util.dashedToCamel(args.targets[1], true)}`];
        if (typeof method !== 'function')
            return this.usage();

        return method.call(this, argv);
    }

    /**
     * General help
     * @return {Promise}
     */
    async usage() {
        await this._app.info(
            'Usage:\tcmd <command> [<parameters]\n\n' +
            'Commands:\n' +
            '\thelp\t\tPrint help about any other command\n' +
            '\tinit-db\t\tInitialize the database\n' +
            '\tmigrate-db\tMigrate the database'

        );
        process.exit(0);
    }

    /**
     * Help command
     * @return {Promise}
     */
    async helpHelp(argv) {
        await this._app.info(
            'Usage:\tcmd help <command>\n\n' +
            '\tPrint help for the given command'
        );
        process.exit(0);
    }

    /**
     * Init DB command
     * @return {Promise}
     */
    async helpInitDb(argv) {
        await this._app.info(
            'Usage:\tcmd init-db\n\n' +
            '\tInitialize the database'
        );
        process.exit(0);
    }

    /**
     * Migrate DB command
     * @return {Promise}
     */
    async helpMigrateDb(argv) {
        await this._app.info(
            'Usage:\tcmd migrate-db\n\n' +
            '\tMigrate the database'
        );
        process.exit(0);
    }

    /**
     * Log error and terminate
     * @param {...*} args
     * @return {Promise}
     */
    async error(...args) {
        try {
            await args.reduce(
                async (prev, cur) => {
                    await prev;
                    return this._app.error(cur.fullStack || cur.stack || cur.message || cur);
                },
                Promise.resolve()
            );
        } catch (error) {
            // do nothing
        }
        process.exit(1);
    }
}

module.exports = Help;
