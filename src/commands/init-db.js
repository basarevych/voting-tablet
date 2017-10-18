/**
 * Init DB command
 * @module commands/init-db
 */
const argvParser = require('argv');

/**
 * Command class
 */
class InitDb {
    /**
     * Create the service
     * @param {App} app                 The application
     * @param {object} config           Configuration
     * @param {Util} util               Util service
     * @param {Filer} filer             Filer service
     * @param {Runner} runner           Runner service
     */
    constructor(app, config, util, filer, runner) {
        this._app = app;
        this._config = config;
        this._util = util;
        this._filer = filer;
        this._runner = runner;
    }

    /**
     * Service name is 'commands.initDb'
     * @type {string}
     */
    static get provides() {
        return 'commands.initDb';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [ 'app', 'config', 'util', 'filer', 'runner' ];
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
            .option({
                name: 'password',
                short: 'p',
                type: 'boolean',
            })
            .run(argv);

        let usePassword = args.options.password || false;

        const instance = 'portal';
        const tmpFile = '/tmp/' + this._util.getRandomString(32);

        try {
            let sql =
`create user '${this._config.get(`mysql.${instance}.user`)}'@'${this._config.get(`mysql.${instance}.host`)}'
    identified by '${this._config.get(`mysql.${instance}.password`)}';
grant all privileges on ${this._config.get(`mysql.${instance}.database`)}.voting_tablet_sessions
    to '${this._config.get(`mysql.${instance}.user`)}'@'${this._config.get(`mysql.${instance}.host`)}';
grant all privileges on ${this._config.get(`mysql.${instance}.database`)}.voting_tablet_users
    to '${this._config.get(`mysql.${instance}.user`)}'@'${this._config.get(`mysql.${instance}.host`)}';
grant all privileges on ${this._config.get(`mysql.${instance}.database`)}.voting_tablet_targets
    to '${this._config.get(`mysql.${instance}.user`)}'@'${this._config.get(`mysql.${instance}.host`)}';
grant all privileges on ${this._config.get(`mysql.${instance}.database`)}.voting_tablet_votes
    to '${this._config.get(`mysql.${instance}.user`)}'@'${this._config.get(`mysql.${instance}.host`)}';
grant select on ${this._config.get(`mysql.${instance}.database`)}.scms_personal
    to '${this._config.get(`mysql.${instance}.user`)}'@'${this._config.get(`mysql.${instance}.host`)}';
flush privileges;`;

            await this._filer.lockWrite(tmpFile, sql);

            if (usePassword)
                await this._app.info('Please enter MySQL root password');

            let result = await this._runner.exec(
                'sh',
                ['-c', `mysql -f -u root ${usePassword ? '-p' : ''} < ${tmpFile}`],
                { pipe: process }
            );

            await this._filer.remove(tmpFile);

            return result.code;
        } catch (error) {
            try {
                await this._filer.remove(tmpFile);
            } catch (error) {
                // do nothing
            }
            await this.error(error);
        }
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

module.exports = InitDb;
