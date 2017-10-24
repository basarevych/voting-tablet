/**
 * Front authentication module
 * @module front/auth
 */
'use strict';

import { Form } from 'arpen-express/front/jquery/bootstrap-form';
import { transition } from 'transition';

let signInWrapper;
let signInForm = new Form();

/**
 * Install handlers
 */
export function installAuth(el) {
    signInWrapper = el.find('#signInForm');
    if (signInWrapper.length) {
        signInForm.init(
            signInWrapper,
            {
                url: '/sign-in',
                statusCode: {
                    401: () => {
                        transition('/start');
                    },
                },
                success: data => {
                    if (data.success)
                        transition('/start');
                },
            },
            {
                url: '/sign-in',
                statusCode: {
                    401: () => {
                        transition('/start');
                    },
                },
            }
        );
    }

    el.find('.btn-sign-out').on('click', () => {
        $.get('/sign-out', () => {
            window.location.reload();
        });
    });
}
