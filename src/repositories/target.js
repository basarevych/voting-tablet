/**
 * Target repository
 * @module repositories/target
 */
const BaseRepository = require('arpen/src/repositories/mysql');

/**
 * Target repository class
 */
class TargetRepository extends BaseRepository {
    /**
     * Service name is 'repositories.target'
     * @type {string}
     */
    static get provides() {
        return 'repositories.target';
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
        return 'voting_tablet_targets';
    }

    /**
     * Model name
     * @type {string}
     */
    static get model() {
        return 'target';
    }

    /**
     * Table time zone
     * @type {string|null}
     */
    static get timeZone() {
        return null; // no convert
    }
}

module.exports = TargetRepository;
