/**
 * Personal model
 * @module models/personal
 */
const BaseModel = require('arpen/src/models/mysql');

/**
 * Personal model class
 */
class PersonalModel extends BaseModel {
    /**
     * Create model
     * @param {MySQL} mysql             MySQL service
     * @param {Util} util               Util service
     */
    constructor(mysql, util) {
        super(mysql, util);

        this.firstNameRu = undefined;
        this.middleNameRu = undefined;
        this.lastNameRu = undefined;
        this.firstNameUk = undefined;
        this.middleNameUk = undefined;
        this.lastNameUk = undefined;
        this.firstNameEn = undefined;
        this.middleNameEn = undefined;
        this.lastNameEn = undefined;
        this.login = undefined;
        this.title = undefined;
    }

    /**
     * Service name is 'models.personal'
     * @type {string}
     */
    static get provides() {
        return 'models.personal';
    }

    /**
     * ID setter
     * @type {undefined|number}
     */
    set id(id) {
        return this._setField('uid', id);
    }

    /**
     * ID getter
     * @type {undefined|number}
     */
    get id() {
        return this._getField('uid');
    }

    /**
     * First name setter
     * @type {undefined|string}
     */
    set firstNameRu(name) {
        return this._setField('name', name);
    }

    /**
     * First name getter
     * @type {undefined|string}
     */
    get firstNameRu() {
        return this._getField('name');
    }

    /**
     * Middle name setter
     * @type {undefined|string}
     */
    set middleNameRu(surname) {
        return this._setField('surname', surname);
    }

    /**
     * Middle name getter
     * @type {undefined|string}
     */
    get middleNameRu() {
        return this._getField('surname');
    }

    /**
     * Last name setter
     * @type {undefined|string}
     */
    set lastNameRu(lastname) {
        return this._setField('lastname', lastname);
    }

    /**
     * Last name getter
     * @type {undefined|string}
     */
    get lastNameRu() {
        return this._getField('lastname');
    }

    /**
     * First name setter
     * @type {undefined|string}
     */
    set firstNameUk(name) {
        return this._setField('name_ua', name);
    }

    /**
     * First name getter
     * @type {undefined|string}
     */
    get firstNameUk() {
        return this._getField('name_ua');
    }

    /**
     * Middle name setter
     * @type {undefined|string}
     */
    set middleNameUk(surname) {
        return this._setField('surname_ua', surname);
    }

    /**
     * Middle name getter
     * @type {undefined|string}
     */
    get middleNameUk() {
        return this._getField('surname_ua');
    }

    /**
     * Last name setter
     * @type {undefined|string}
     */
    set lastNameUk(lastname) {
        return this._setField('lastname_ua', lastname);
    }

    /**
     * Last name getter
     * @type {undefined|string}
     */
    get lastNameUk() {
        return this._getField('lastname_ua');
    }

    /**
     * First name setter
     * @type {undefined|string}
     */
    set firstNameEn(name) {
        return this._setField('name_en', name);
    }

    /**
     * First name getter
     * @type {undefined|string}
     */
    get firstNameEn() {
        return this._getField('name_en');
    }

    /**
     * Middle name setter
     * @type {undefined|string}
     */
    set middleNameEn(surname) {
        return this._setField('surname_en', surname);
    }

    /**
     * Middle name getter
     * @type {undefined|string}
     */
    get middleNameEn() {
        return this._getField('surname_en');
    }

    /**
     * Last name setter
     * @type {undefined|string}
     */
    set lastNameEn(lastname) {
        return this._setField('lastname_en', lastname);
    }

    /**
     * Last name getter
     * @type {undefined|string}
     */
    get lastNameEn() {
        return this._getField('lastname_en');
    }

    /**
     * Login setter
     * @type {undefined|string}
     */
    set login(login) {
        return this._setField('login', login);
    }

    /**
     * Login getter
     * @type {undefined|string}
     */
    get login() {
        return this._getField('login');
    }

    /**
     * Title setter
     * @type {undefined|string|null}
     */
    set title(title) {
        return this._setField('pos_title', title);
    }

    /**
     * Title getter
     * @type {undefined|string|null}
     */
    get title() {
        return this._getField('pos_title');
    }
}

module.exports = PersonalModel;
