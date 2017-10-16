/**
 * Migrate DB command
 * @module commands/migrate-db
 */
const path = require('path');
const fs = require('fs');
const argvParser = require('argv');

/**
 * Command class
 */
class MigrateDb {
    /**
     * Create the service
     * @param {App} app                 The application
     * @param {object} config           Configuration
     * @param {Runner} runner           Runner service
     * @param {Mysql} mysql             Mysql service
     */
    constructor(app, config, runner, mysql) {
        this._app = app;
        this._config = config;
        this._runner = runner;
        this._mysql = mysql;
    }

    /**
     * Service name is 'commands.migrateDb'
     * @type {string}
     */
    static get provides() {
        return 'commands.migrateDb';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [ 'app', 'config', 'runner', 'mysql' ];
    }

    /**
     * Run the command
     * @param {string[]} argv           Arguments
     * @return {Promise}
     */
    async run(argv) {
        argvParser
            .option({
                name: 'help',
                short: 'h',
                type: 'boolean',
            })
            .run(argv);

        const instance = 'portal';
        const latestVersion = 1;

        try {
            let client = await this._mysql.connect(instance);
            let currentVersion = 0;
            try {
                await client.query(
                    `SELECT *
                       FROM voting_tablet_users`
                );
                currentVersion = 1;
            } catch (error) {
                // do nothing
            }
            client.done();

            let deltas = [];
            for (let i = currentVersion; i < latestVersion; i++)
                deltas.push(i ? `schema.${i}-${i + 1}.sql` : `schema.1.sql`);

            await deltas.reduce(
                async (prev, cur) => {
                    await prev;

                    let filename = path.join(__dirname, '..', '..', 'database', cur);
                    try {
                        fs.accessSync(filename, fs.constants.F_OK);
                    } catch (error) {
                        return; // skip
                    }

                    await this._app.info(`==> ${path.basename(filename)}\n`);
                    return this._runner.exec(
                        'sh',
                        [
                            '-c',
                            `mysql -f -u ${this._config.get(`mysql.${instance}.user`)} `
                            + `-p${this._config.get(`mysql.${instance}.password`)} `
                            + `-h ${this._config.get(`mysql.${instance}.host`)} `
                            + `-P ${this._config.get(`mysql.${instance}.port`)} `
                            + `${this._config.get(`mysql.${instance}.database`)} < ${filename}`
                        ],
                        { pipe: process }
                    );
                },
                Promise.resolve()
            );

            return 0;
        } catch (error) {
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

module.exports = MigrateDb;
