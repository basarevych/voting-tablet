/**
 * Vite comment form
 * @module web/forms/comment
 */

/**
 * Comment form class
 */
class CommentForm {
    /**
     * Create service
     * @param {App} app                     The application
     * @param {object} config               Configuration
     */
    constructor(app, config) {
        this._app = app;
        this._config = config;
    }

    /**
     * Service name is 'web.forms.comment'
     * @type {string}
     */
    static get provides() {
        return 'web.forms.comment';
    }

    /**
     * Dependencies as constructor arguments
     * @type {string[]}
     */
    static get requires() {
        return [ 'app', 'config' ];
    }

    /**
     * Create new instance of the form
     * @param {string} locale               Locale
     * @param {object} vars                 Fields of the form
     * @return {Promise}                    Resolves to Fieldset
     */
    async create(locale, vars) {
        let form = this._app.get('form');
        form.locale = locale;
        form.addField('body', vars.body, { required: true });
        return form;
    }

    /**
     * Validate the form
     * @param {string} locale               Locale
     * @param {object} vars                 Fields of the form
     * @return {Promise}                    Resolves to Form
     */
    async validate(locale, vars) {
        return await this.create(locale, vars);
    }
}

module.exports = CommentForm;
