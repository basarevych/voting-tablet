/**
 * SessionRepository.save()
 */
'use strict';

const NError = require('nerror');

/**
 * Save model
 * @instance
 * @method save
 * @memberOf module:repositories/session~SessionRepository
 * @param {BaseModel} model                 The model
 * @param {MySQLClient|string} [mysql]      Will reuse the MySQL client provided, or if it is a string then will
 *                                          connect to this instance of MySQL.
 * @return {Promise}                        Resolves to record ID
 */
module.exports = async function (model, mysql) {
    let client;

    try {
        client = typeof mysql === 'object' ? mysql : await this._mysql.connect(mysql || this.constructor.instance);

        let result = await client.transaction({ name: 'session_save' }, async rollback => {
            if (!model.id)
                return this._save(model, client);

            let sessions = await this.find(model.id, client);
            let old = sessions.length && sessions[0];
            if (!old)
                return this._save(model, client);

            if (old.updatedAt.isBefore(model.updatedAt))
                return this._save(model, client);

            return rollback(model.id);
        });

        if (typeof mysql !== 'object')
            client.done();

        return result;
    } catch (error) {
        if (client && typeof mysql !== 'object')
            client.done();

        throw new NError(error, { model }, 'SessionRepository.save()');
    }
};
