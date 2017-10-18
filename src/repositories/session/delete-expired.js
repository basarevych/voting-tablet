/**
 * SessionRepository.deleteExpired()
 */
'use strict';

const moment = require('moment-timezone');
const NError = require('nerror');

/**
 * Delete expired models
 * @instance
 * @method deleteExpired
 * @memberOf module:repositories/session~SessionRepository
 * @param {number} expiration               Number of seconds
 * @param {MySQLClient|string} [mysql]      Will reuse the MySQL client provided, or if it is a string then will
 *                                          connect to this instance of MySQL.
 * @return {Promise}                        Resolves to number of deleted records
 */
module.exports = async function (expiration, mysql) {
    let client;

    try {
        let exp = this.getModel();
        exp.updatedAt = moment().subtract(expiration, 'seconds');

        client = typeof mysql === 'object' ? mysql : await this._mysql.connect(mysql || this.constructor.instance);
        let result = await client.query(
            `DELETE 
               FROM ${this.constructor.table}
              WHERE updated_at < ?`,
            [ exp._serialize({ timeZone: this.constructor.timeZone }).updated_at ]
        );

        if (typeof mysql !== 'object')
            client.done();

        return result.affectedRows;
    } catch (error) {
        if (client && typeof mysql !== 'object')
            client.done();

        throw new NError(error, { expiration }, 'SessionRepository.deleteExpired()');
    }
};
