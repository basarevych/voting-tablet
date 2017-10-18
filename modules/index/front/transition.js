/**
 * Switch content module
 * @module front/switch
 */
'use strict';

import { socket } from 'index';
import { installAuth } from 'auth';

let curPage = 1;

function checkConnected() {
    if (socket.connected) {
        $('.when-connected').show();
        $('.when-disconnected').hide();
    } else {
        $('.when-connected').hide();
        $('.when-disconnected').show();
    }
}

export function install(el) {
    installAuth(el);
    checkConnected();
}

export function transition(url) {
    checkConnected();

    $.get('/authorized', auth => {
        if (!auth.success && url !== '/start')
            return transition('/start');

        let prev = $('#page' + (curPage === 1 ? 2 : 1));

        let counter = 0;
        let done = () => {
            if (++counter < 2)
                return;

            prev.show();
            curPage = (curPage === 1 ? 2 : 1);

            if (auth.success && socket.connected && !socket.registered) {
                socket.registered = true;
                socket.io.emit('register', { server: auth.server, token: auth.token });
            }
        };

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
                    prev.html(data);
                    install(prev);
                    done();
                },
            }
        );

        $('#page' + curPage).fadeOut(done);
    });
}