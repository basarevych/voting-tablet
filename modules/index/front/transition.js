/**
 * Switch content module
 * @module front/switch
 */
'use strict';

import { socket } from 'socket';
import { installAuth } from 'auth';
import { installIdentify } from 'identify';
import { installSelect } from 'select';
import { installVote } from 'vote';
import { installThanks } from 'thanks';

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

function install(el) {
    installAuth(el);
    installIdentify(el);
    installSelect(el);
    installVote(el);
    installThanks(el);
    checkConnected();

    let height = el.height();
    if ($(window).height() < height) {
        $('html').css('height', height);
        $('body').css('height', height);
    } else {
        $('html').css('height', '100%');
        $('body').css('height', '100%');
    }
}

export let lastTransition = { timestamp: 0 };

export function transition(url) {
    lastTransition.timestamp = Date.now();
    checkConnected();

    $.get('/authorized', auth => {
        if (!auth.success) {
            socket.registered = false;
            if (url !== '/start')
                return transition('/start');
        }

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
