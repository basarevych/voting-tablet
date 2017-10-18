/**
 * Target model
 * @module models/target
 */
const BaseModel = require('arpen/src/models/mysql');

/**
 * Target model class
 */
class TargetModel extends BaseModel {
    /**
     * Create model
     * @param {MySQL} mysql             Mysql service
     * @param {Util} util               Util service
     */
    constructor(mysql, util) {
        super(mysql, util);

        this.name = undefined;
    }

    /**
     * Service name is 'models.target'
     * @type {string}
     */
    static get provides() {
        return 'models.target';
    }

    /**
     * Name setter
     * @type {undefined|string}
     */
    set name(name) {
        return this._setField('name', name);
    }

    /**
     * Name getter
     * @type {undefined|string}
     */
    get name() {
        return this._getField('name');
    }
}

module.exports = TargetModel;
