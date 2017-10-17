/**
 * Session model
 * @module models/session
 */
const moment = require('moment-timezone');
const BaseModel = require('arpen/src/models/mysql');

/**
 * Session model class
 */
class SessionModel extends BaseModel {
    /**
     * Create model
     * @param {MySQL} mysql             Mysql service
     * @param {Util} util               Util service
     */
    constructor(mysql, util) {
        super(mysql, util);

        this.token = undefined;
        this.userId = undefined;
        this.payload = undefined;
        this.info = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }

    /**
     * Service name is 'models.session'
     * @type {string}
     */
    static get provides() {
        return 'models.session';
    }

    /**
     * Token setter
     * @type {undefined|string}
     */
    set token(token) {
        return this._setField('token', token);
    }

    /**
     * Token getter
     * @type {undefined|string}
     */
    get token() {
        return this._getField('token');
    }

    /**
     * User ID setter
     * @type {undefined|number|null}
     */
    set userId(id) {
        return this._setField('user_id', id);
    }

    /**
     * User ID getter
     * @type {undefined|number|null}
     */
    get userId() {
        return this._getField('user_id');
    }

    /**
     * Payload setter
     * @type {undefined|object}
     */
    set payload(payload) {
        return this._setField('payload', payload && JSON.stringify(payload));
    }

    /**
     * Payload getter
     * @type {undefined|object}
     */
    get payload() {
        let payload = this._getField('payload');
        if (payload)
            payload = JSON.parse(payloao);
        return payload;
    }

    /**
     * Info setter
     * @type {undefined|object}
     */
    set info(info) {
        return this._setField('info', info && JSON.stringify(info));
    }

    /**
     * Info getter
     * @type {undefined|object}
     */
    get info() {
        let info = this._getField('info');
        if (info)
            info = JSON.parse(info);
        return info;
    }

    /**
     * Creation time setter
     * @type {undefined|object}
     */
    set createdAt(createdAt) {
        return this._setField('created_at', createdAt && moment(createdAt));
    }

    /**
     * Creation time getter
     * @type {undefined|object}
     */
    get createdAt() {
        return this._getField('created_at');
    }

    /**
     * Modification time setter
     * @type {undefined|object}
     */
    set updatedAt(updatedAt) {
        return this._setField('updated_at', updatedAt && moment(updatedAt));
    }

    /**
     * Modification time getter
     * @type {undefined|object}
     */
    get updatedAt() {
        return this._getField('updated_at');
    }
}

module.exports = SessionModel;
