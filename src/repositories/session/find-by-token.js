/**
 * SessionRepository.findByToken()
 */
'use strict';

const NError = require('nerror');

/**
 * Find a model by token
 * @instance
 * @method findByToken
 * @memberOf module:repositories/session~SessionRepository
 * @param {string} token                    Token to search by
 * @param {MySQLClient|string} [mysql]      Will reuse the MySQL client provided, or if it is a string then will
 *                                          connect to this instance of MySQL.
 * @return {Promise}                        Resolves to array of models
 */
module.exports = async function (token, mysql) {
    let client;

    try {
        client = typeof mysql === 'object' ? mysql : await this._mysql.connect(mysql || this.constructor.instance);
        let rows = await client.query(
            `SELECT * 
               FROM ${this.constructor.table} 
              WHERE token = ?`,
            [token]
        );

        if (typeof mysql !== 'object')
            client.done();

        return this.getModel(rows);
    } catch (error) {
        if (client && typeof mysql !== 'object')
            client.done();

        throw new NError(error, { id }, 'SessionRepository.findByToken()');
    }
};
