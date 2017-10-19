/**
 * Switch content module
 * @module front/switch
 */
'use strict';

import { socket } from 'socket';
import { installAuth } from 'auth';
import { installStart } from 'start';
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

export let lastTransition = { url: null, timestamp: 0, timer: null };

export function transition(url, timeout = 15) {
    checkConnected();

    if (lastTransition.timer) {
        clearTimeout(lastTransition.timer);
        lastTransition.timer = null;
    }

    $.get('/authorized', auth => {
        if (!auth.success) {
            socket.registered = false;
            if (url !== '/start')
                return transition('/start');
        } else if (socket.connected && !socket.registered) {
            socket.registered = true;
            socket.io.emit('register', { server: auth.server, token: auth.token });
        }

        if (lastTransition.url === url)
            return;

        lastTransition.url = url;
        lastTransition.timestamp = Date.now();

        let prev = $('#page' + (curPage === 1 ? 2 : 1));

        let counter = 0;
        let done = () => {
            if (++counter < 2)
                return;

            prev.show();
            curPage = (curPage === 1 ? 2 : 1);

            if (url === '/start') {
                socket.io.emit('reset');
            } else {
                let savedTransition = lastTransition.timestamp;
                lastTransition.timer = setTimeout(
                    () => {
                        if (lastTransition.timestamp === savedTransition &&
                            lastTransition.url !== '/start') {
                            transition('/start');
                        }
                    },
                    timeout * 1000
                );
            }

            checkConnected();
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

                    installAuth(prev);
                    installStart(prev);
                    installIdentify(prev);
                    installSelect(prev);
                    installVote(prev);
                    installThanks(prev);

                    let height = prev.height();
                    if ($(window).height() < height) {
                        $('html').css('height', height);
                        $('body').css('height', height);
                    } else {
                        $('html').css('height', '100%');
                        $('body').css('height', '100%');
                    }

                    done();
                },
            }
        );
        $('#page' + curPage).fadeOut(done);
    });
}
