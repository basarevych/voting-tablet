/**
 * Session repository
 * @module repositories/session
 */
const path = require('path');
const BaseRepository = require('arpen/src/repositories/mysql');

/**
 * Session repository class
 */
class SessionRepository extends BaseRepository {
    /**
     * Create repository
     * @param {App} app                             The application
     * @param {MySQL} mysql                         Mysql service
     * @param {Util} util                           Util service
     */
    constructor(app, mysql, util) {
        super(app, mysql, util);
        this._loadMethods(path.join(__dirname, 'session'));
    }

    /**
     * Service name is 'repositories.session'
     * @type {string}
     */
    static get provides() {
        return 'repositories.session';
    }

    /**
     * DB table name
     * @type {string}
     */
    static get table() {
        return 'voting_tablet_sessions';
    }

    /**
     * Model name
     * @type {string}
     */
    static get model() {
        return 'session';
    }

    /**
     * Table time zone
     * @type {string|null}
     */
    static get timeZone() {
        return null; // no convert
    }
}

module.exports = SessionRepository;
