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
     * @param {MySQL} mysql             Mysql service
     */
    constructor(app, config, mysql) {
        this._app = app;
        this._config = config;
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
        return [ 'app', 'config', 'mysql' ];
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
        const latestVersion = 2;

        try {
            let client = await this._mysql.connect(instance);
            let currentVersion = 0;
            try {
                await client.query(
                    `SELECT *
                       FROM voting_tablet_sessions`
                );
                currentVersion = 1;
            } catch (error) {
                // do nothing
            }
            if (currentVersion === 1) {
                try {
                    let result = await client.query(
                        `SELECT count(*) as count
                           FROM voting_tablet_targets
                          WHERE code = 'bill'`
                    );
                    if (result[0].count >= 1)
                        currentVersion = 2;
                } catch (error) {
                    // do nothing
                }
            }
            client.done();

            let deltas = [];
            for (let i = currentVersion + 1; i <= latestVersion; i++)
                deltas.push(`schema.${i}.sql`);

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
                    return this._mysql.exec(filename, instance);
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
