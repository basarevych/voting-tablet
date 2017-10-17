/**
 * Switch content module
 * @module front/switch
 */
'use strict';

import { installAuth } from 'auth';

let curPage = 1;

export function install(el) {
    installAuth(el)
}

export function transition(url) {
    $.ajax(
        url,
        {
            type: 'GET',
            statusCode: {
                401: () => {
                    if (url !== '/start')
                        transition('/start');
                },
            },
            success: data => {
                let prev = $('#page' + (curPage === 1 ? 2 : 1));
                prev.html(data);
                install(prev);

                $('#page' + curPage).fadeOut(() => {
                    prev.show();
                    curPage = (curPage === 1 ? 2 : 1);
                });
            },
        }
    );
}