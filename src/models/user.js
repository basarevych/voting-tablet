/**
 * User model
 * @module models/user
 */
const moment = require('moment-timezone');
const BaseModel = require('arpen/src/models/mysql');

/**
 * User model class
 */
class UserModel extends BaseModel {
    /**
     * Create model
     * @param {MySQL} mysql             Mysql service
     * @param {Util} util               Util service
     */
    constructor(mysql, util) {
        super(mysql, util);

        this._addField('portal_id', 'portalId');
        this._addField('card_id', 'cardId');
        this._addField('scanned_at', 'scannedAt');
        this._addField('registered_at', 'registeredAt');
    }

    /**
     * Service name is 'models.user'
     * @type {string}
     */
    static get provides() {
        return 'models.user';
    }

    /**
     * Portal ID setter
     * @type {undefined|number}
     */
    set portalId(id) {
        return this._setField('portal_id', id);
    }

    /**
     * Portal ID getter
     * @type {undefined|number}
     */
    get portalId() {
        return this._getField('portal_id');
    }

    /**
     * Card ID setter
     * @type {undefined|string}
     */
    set cardId(id) {
        return this._setField('card_id', id);
    }

    /**
     * Card ID getter
     * @type {undefined|string}
     */
    get cardId() {
        return this._getField('card_id');
    }

    /**
     * Scan time setter
     * @type {undefined|object}
     */
    set scannedAt(scannedAt) {
        return this._setField('scanned_at', scannedAt && moment(scannedAt));
    }

    /**
     * Scan time getter
     * @type {undefined|object}
     */
    get scannedAt() {
        return this._getField('scanned_at');
    }

    /**
     * Registration time setter
     * @type {undefined|object}
     */
    set registeredAt(registeredAt) {
        return this._setField('registered_at', registeredAt && moment(registeredAt));
    }

    /**
     * Registration time getter
     * @type {undefined|object}
     */
    get registeredAt() {
        return this._getField('registered_at');
    }
}

module.exports = UserModel;
