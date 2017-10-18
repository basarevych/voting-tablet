/**
 * PersonalRepository.find()
 */
'use strict';

const NError = require('nerror');

/**
 * Find a model by ID
 * @instance
 * @method find
 * @memberOf module:repositories/personal~PersonalRepository
 * @param {number} id                       ID to search by
 * @param {MySQLClient|string} [mysql]      Will reuse the MySQL client provided, or if it is a string then will
 *                                          connect to this instance of MySQL.
 * @return {Promise}                        Resolves to array of models
 */
module.exports = async function (id, mysql) {
    let client;

    try {
        client = typeof mysql === 'object' ? mysql : await this._mysql.connect(mysql || this.constructor.instance);
        let rows = await client.query(
            `SELECT * 
               FROM ${this.constructor.table} 
              WHERE uid = ?`,
            [id]
        );

        if (typeof mysql !== 'object')
            client.done();

        return this.getModel(rows);
    } catch (error) {
        if (client && typeof mysql !== 'object')
            client.done();

        throw new NError(error, { id }, 'PersonalRepository.find()');
    }
};
