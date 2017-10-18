/**
 * User repository
 * @module repositories/user
 */
const path = require('path');
const BaseRepository = require('arpen/src/repositories/mysql');

/**
 * User repository class
 */
class UserRepository extends BaseRepository {
    /**
     * Create repository
     * @param {App} app                             The application
     * @param {MySQL} mysql                         Mysql service
     * @param {Util} util                           Util service
     */
    constructor(app, mysql, util) {
        super(app, mysql, util);
        this._loadMethods(path.join(__dirname, 'user'));
    }

    /**
     * Service name is 'repositories.user'
     * @type {string}
     */
    static get provides() {
        return 'repositories.user';
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
        return 'voting_tablet_users';
    }

    /**
     * Model name
     * @type {string}
     */
    static get model() {
        return 'user';
    }

    /**
     * Table time zone
     * @type {string|null}
     */
    static get timeZone() {
        return null; // no convert
    }
}

module.exports = UserRepository;
