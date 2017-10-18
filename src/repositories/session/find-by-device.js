/**
 * SessionRepository.findByDevice()
 */
'use strict';

const NError = require('nerror');

/**
 * Find a model by device number
 * @instance
 * @method findByDevice
 * @memberOf module:repositories/session~SessionRepository
 * @param {number} device                   Device number
 * @param {MySQLClient|string} [mysql]      Will reuse the MySQL client provided, or if it is a string then will
 *                                          connect to this instance of MySQL.
 * @return {Promise}                        Resolves to array of models
 */
module.exports = async function (device, mysql) {
    let client;

    try {
        client = typeof mysql === 'object' ? mysql : await this._mysql.connect(mysql || this.constructor.instance);

        let result = [];
        for (let session of await this.findAll(client)) {
            if (session.payload.started && session.payload.device === device)
                result.push(session);
        }

        if (typeof mysql !== 'object')
            client.done();

        return result;
    } catch (error) {
        if (client && typeof mysql !== 'object')
            client.done();

        throw new NError(error, { id }, 'SessionRepository.findByDevice()');
    }
};
