/**
 * Vote repository
 * @module repositories/vote
 */
const BaseRepository = require('arpen/src/repositories/mysql');

/**
 * Vote repository class
 */
class VoteRepository extends BaseRepository {
    /**
     * Service name is 'repositories.vote'
     * @type {string}
     */
    static get provides() {
        return 'repositories.vote';
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
        return 'voting_tablet_votes';
    }

    /**
     * Model name
     * @type {string}
     */
    static get model() {
        return 'vote';
    }

    /**
     * Table time zone
     * @type {string|null}
     */
    static get timeZone() {
        return null; // no convert
    }
}

module.exports = VoteRepository;
