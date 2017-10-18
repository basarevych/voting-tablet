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

        this.name = undefined;
        this.surname = undefined;
        this.lastname = undefined;
        this.nameUa = undefined;
        this.surnameUa = undefined;
        this.lastnameUa = undefined;
        this.nameEn = undefined;
        this.surnameEn = undefined;
        this.lastnameEn = undefined;
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
     * ID setter (synonym)
     * @type {undefined|number}
     */
    set uid(id) {
        return this._setField('uid', id);
    }

    /**
     * ID getter (synonym)
     * @type {undefined|number}
     */
    get uid() {
        return this._getField('uid');
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

    /**
     * Surname setter
     * @type {undefined|string}
     */
    set surname(surname) {
        return this._setField('surname', surname);
    }

    /**
     * Surname getter
     * @type {undefined|string}
     */
    get surname() {
        return this._getField('surname');
    }

    /**
     * Last name setter
     * @type {undefined|string}
     */
    set lastname(lastname) {
        return this._setField('lastname', lastname);
    }

    /**
     * Last name getter
     * @type {undefined|string}
     */
    get lastname() {
        return this._getField('lastname');
    }

    /**
     * Name setter
     * @type {undefined|string}
     */
    set nameUa(name) {
        return this._setField('name_ua', name);
    }

    /**
     * Name getter
     * @type {undefined|string}
     */
    get nameUa() {
        return this._getField('name_ua');
    }

    /**
     * Surname setter
     * @type {undefined|string}
     */
    set surnameUa(surname) {
        return this._setField('surname_ua', surname);
    }

    /**
     * Surname getter
     * @type {undefined|string}
     */
    get surnameUa() {
        return this._getField('surname_ua');
    }

    /**
     * Last name setter
     * @type {undefined|string}
     */
    set lastnameUa(lastname) {
        return this._setField('lastname_ua', lastname);
    }

    /**
     * Last name getter
     * @type {undefined|string}
     */
    get lastnameUa() {
        return this._getField('lastname_ua');
    }

    /**
     * Name setter
     * @type {undefined|string}
     */
    set nameEn(name) {
        return this._setField('name_en', name);
    }

    /**
     * Name getter
     * @type {undefined|string}
     */
    get nameEn() {
        return this._getField('name_en');
    }

    /**
     * Surname setter
     * @type {undefined|string}
     */
    set surnameEn(surname) {
        return this._setField('surname_en', surname);
    }

    /**
     * Surname getter
     * @type {undefined|string}
     */
    get surnameEn() {
        return this._getField('surname_en');
    }

    /**
     * Last name setter
     * @type {undefined|string}
     */
    set lastnameEn(lastname) {
        return this._setField('lastname_en', lastname);
    }

    /**
     * Last name getter
     * @type {undefined|string}
     */
    get lastnameEn() {
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
