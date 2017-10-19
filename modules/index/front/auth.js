/**
 * Front authentication module
 * @module front/auth
 */
'use strict';

import { Form } from 'form';
import { transition } from 'transition';

let signInWrapper;
let signInForm = new Form();

/**
 * Sign in
 */
function signIn() {
    let timestamp = Date.now();
    $.ajax(
        '/sign-in',
        {
            type: 'POST',
            data: Form.extract(signInWrapper),
            statusCode: {
                401: () => {
                    transition('/start');
                },
            },
            success: data => {
                Form.reset(signInWrapper);
                if (data.success) {
                    transition('/start');
                } else {
                    Form.unlock(signInWrapper);
                    if (signInForm.timestamp <= timestamp) {
                        signInForm.update(signInWrapper, data, true);
                        signInForm.checkForm(signInWrapper);
                    }
                }
            },
        }
    );
    signInForm.timestamp = timestamp;
    Form.lock(signInWrapper);
}

/**
 * Sign out
 */
function signOut() {
    $.get('/sign-out', () => {
        window.location.reload();
    });
}

/**
 * Install handlers
 */
export function installAuth(el) {
    signInWrapper = el.find('#signInForm');
    if (signInWrapper.length)
        Form.focus(signInWrapper);

    signInWrapper.find('[name]').on('input', event => {
        Form.reset(signInWrapper, $(event.target));
    });
    signInWrapper.find('[validate]').on('focusout', event => {
        if (Form.isLocked(signInWrapper))
            return;

        let timestamp = Date.now();
        setTimeout(() => {
            if (!Form.isLocked(signInWrapper) && signInForm.timestamp < timestamp) {
                Form.reset(signInWrapper, $(event.target));
                $.ajax(
                    '/sign-in',
                    {
                        type: 'POST',
                        data: Object.assign({ _validate: true }, Form.extract(signInWrapper)),
                        statusCode: {
                            401: () => { window.location.reload(); },
                        },
                        success: data => {
                            if (!Form.isLocked(signInWrapper) && signInForm.timestamp < timestamp) {
                                signInForm.update(signInWrapper, data, false);
                                signInForm.checkField(signInWrapper, $(event.target).prop('name'));
                                signInForm.timestamp = timestamp;
                            }
                        },
                    },
                );
            }
        }, 250);
    });
    signInWrapper.find('[type="submit"]').on('click', signIn);

    el.find('.btn-sign-out').on('click', signOut);
}
