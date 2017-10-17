/**
 * SignIn form
 * @module index/forms/sign-in
 */
const validator = require('validator');

/**
 * SignIn form class
 */
class SignInForm {
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
     * Service name is 'forms.signIn'
     * @type {string}
     */
    static get provides() {
        return 'forms.signIn';
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
        form.addField('device', vars.device, { required: true });
        form.addField('pin_code', vars.pin_code, { required: true });
        return form;
    }

    /**
     * Validate the form
     * @param {string} locale               Locale
     * @param {object} vars                 Fields of the form
     * @return {Promise}                    Resolves to Form
     */
    async validate(locale, vars) {
        let form = await this.create(locale, vars);

        let device = parseInt(form.getField('device'));
        if (!isFinite(device) || device < 1 || device > this._config.get('servers.cardid.num_devices'))
            form.addError('pin_code', 'form_field_invalid');

        if (!validator.isLength(form.getField('pin_code'), { min: 6 }))
            form.addError('pin_code', 'form_min_length', { min: 6 });

        return form;
    }
}

module.exports = SignInForm;
