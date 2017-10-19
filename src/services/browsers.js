/**
 * Browsers
 * @module services/browsers
 */

/**
 * Browser and its socket
 */
class Browser {
    /**
     * Create instance
     * @param {object} socket                               Web socket
     */
    constructor(socket) {
        this.socket = socket;
        this.clear();
    }

    /**
     * Socket setter
     * @param {object} socket
     */
    set socket(socket) {
        this._socket = socket;
    }

    /**
     * Socket getter
     * @type {object}
     */
    get socket() {
        return this._socket;
    }

    /**
     * Device setter
     * @param {number|null} device
     */
    set device(device) {
        this._device = device;
    }

    /**
     * Device getter
     * @type {number|null}
     */
    get device() {
        return this._device;
    }

    /**
     * Card ID setter
     * @param {string|null} cardId
     */
    set cardId(cardId) {
        this._cardId = cardId;
    }

    /**
     * Card ID getter
     * @return {string|null}
     */
    get cardId() {
        return this._cardId;
    }

    /**
     * Card ID timestamp setter
     * @param {object|null} cardTimestamp
     */
    set cardTimestamp(cardTimestamp) {
        this._cardTimestamp = cardTimestamp;
    }

    /**
     * Card ID timestamp getter
     * @type {object|null}
     */
    get cardTimestamp() {
        return this._cardTimestamp;
    }

    /**
     * User setter
     * @param {object|null} user
     */
    set user(user) {
        this._user = user;
    }

    /**
     * User getter
     * @return {object|null}
     */
    get user() {
        return this._user;
    }

    /**
     * Target setter
     * @param {object|null} target
     */
    set target(target) {
        this._target = target;
    }

    /**
     * Target getter
     * @return {object|null}
     */
    get target() {
        return this._target;
    }

    /**
     * Clear all the data
     * @param {number} [newDevice]
     */
    clear(newDevice) {
        this.device = newDevice || null;
        this.cardId = null;
        this.cardTimestamp = null;
        this.user = null;
        this.target = null;
    }
}

/**
 * Browsers class
 */
class Browsers {
    /**
     * Create service
     */
    constructor() {
        this.browsers = new Map();
    }

    /**
     * Service name is 'browsers'
     * @type {string}
     */
    static get provides() {
        return 'browsers';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [];
    }

    /**
     * This service is a singleton
     * @type {string}
     */
    static get lifecycle() {
        return 'singleton';
    }

    /**
     * Add new browser
     * @param {string} id
     * @param {object} socket
     */
    add(id, socket) {
        this.browsers.set(id, new Browser(socket));
    }

    /**
     * Tetrieve a browser
     * @param {string} id
     * @return {Browser|undefined}
     */
    get(id) {
        return this.browsers.get(id);
    }

    /**
     * Remove a browser
     * @param {string} id
     */
    remove(id) {
        this.browsers.delete(id);
    }

    /**
     * Iterator
     * @return {*}
     */
    [Symbol.iterator]() {
        return this.browsers[Symbol.iterator]();
    }

    /**
     * Iterator
     * @return {*}
     */
    keys() {
        return this.browsers.keys();
    }

    /**
     * Iterator
     * @return {*}
     */
    values() {
        return this.browsers.values();
    }
}

module.exports = Browsers;
