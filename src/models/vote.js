/**
 * Vote model
 * @module models/vote
 */
const moment = require('moment-timezone');
const BaseModel = require('arpen/src/models/mysql');

/**
 * Vote model class
 */
class VoteModel extends BaseModel {
    /**
     * Create model
     * @param {MySQL} mysql             Mysql service
     * @param {Util} util               Util service
     */
    constructor(mysql, util) {
        super(mysql, util);

        this.userId = undefined;
        this.portalId = undefined;
        this.targetId = undefined;
        this.score = undefined;
        this.comment = undefined;
        this.votedAt = undefined;
    }

    /**
     * Service name is 'models.vote'
     * @type {string}
     */
    static get provides() {
        return 'models.vote';
    }

    /**
     * User ID setter
     * @type {undefined|number}
     */
    set userId(id) {
        return this._setField('user_id', id);
    }

    /**
     * User ID getter
     * @type {undefined|number}
     */
    get userId() {
        return this._getField('user_id');
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
     * Target ID setter
     * @type {undefined|number}
     */
    set targetId(id) {
        return this._setField('target_id', id);
    }

    /**
     * Target ID getter
     * @type {undefined|number}
     */
    get targetId() {
        return this._getField('target_id');
    }

    /**
     * Score setter
     * @type {undefined|number}
     */
    set score(score) {
        return this._setField('score', score);
    }

    /**
     * Score getter
     * @type {undefined|number}
     */
    get score() {
        return this._getField('score');
    }

    /**
     * Comment setter
     * @type {undefined|string|null}
     */
    set comment(comment) {
        return this._setField('comment', comment);
    }

    /**
     * Comment getter
     * @type {undefined|string|null}
     */
    get comment() {
        return this._getField('comment');
    }

    /**
     * Vote time setter
     * @type {undefined|object}
     */
    set votedAt(votedAt) {
        return this._setField('voted_at', votedAt && moment(votedAt));
    }

    /**
     * Vote time getter
     * @type {undefined|object}
     */
    get votedAt() {
        return this._getField('voted_at');
    }
}

module.exports = VoteModel;
