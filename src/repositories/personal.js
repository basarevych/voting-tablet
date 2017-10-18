/**
 * Personal repository
 * @module repositories/personal
 */
const path = require('path');
const BaseRepository = require('arpen/src/repositories/mysql');

/**
 * Personal repository class
 */
class PersonalRepository extends BaseRepository {
    /**
     * Create repository
     * @param {App} app                             The application
     * @param {MySQL} mysql                         MySQL service
     * @param {Util} util                           Util service
     */
    constructor(app, mysql, util) {
        super(app, mysql, util);
        this._loadMethods(path.join(__dirname, 'personal'));
    }

    /**
     * Service name is 'repositories.personal'
     * @type {string}
     */
    static get provides() {
        return 'repositories.personal';
    }

    /**
     * DB instance
     * @type {string}
     */
    static get instance() {
        return 'portal';
    }

    /**
     * DB table name
     * @type {string}
     */
    static get table() {
        return 'scms_personal';
    }

    /**
     * Model name
     * @type {string}
     */
    static get model() {
        return 'personal';
    }

    /**
     * Table time zone
     * @type {string|null}
     */
    static get timeZone() {
        return null; // no convert
    }
}

module.exports = PersonalRepository;
