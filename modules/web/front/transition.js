/**
 * Switch content module
 * @module front/switch
 */
'use strict';

import packageInfo from '../package.json';
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

export let state = {
    url: null,
    timestamp: 0,
    timer: null,
    code: null,
    cancelTimer: function () {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    },
    startTimer: function (timeout = 15, url = '/start') {
        this.savedTransition = state.timestamp;
        this.cancelTimer();
        this.timer = setTimeout(
            () => {
                this.timer = null;
                if (this.timestamp === this.savedTransition && this.url !== '/start')
                    transition(url);
            },
            timeout * 1000
        );
    }
};

export function transition(url, timeoutSec, timeoutUrl) {
    state.cancelTimer();
    checkConnected();

    $.get('/status', status => {
        let forceTransition = false;
        if (!status.authorized) {
            forceTransition = true;
            socket.registered = false;
            if (url !== '/start')
                return transition('/start');
        } else if (socket.connected && !socket.registered) {
            forceTransition = true;
            socket.registered = true;
            socket.io.emit('register', { server: status.server, token: status.token, version: packageInfo.version });
        }

        if (socket.registered && url === '/start')
            url = '/select';

        if (!forceTransition && state.url === url)
            return;

        state.url = url;
        state.timestamp = Date.now();

        let prev = $('#page' + (curPage === 1 ? 2 : 1));

        let counter = 0;
        let done = () => {
            if (++counter < 2)
                return;

            $('body').removeAttr('class');
            installAuth(prev);
            installStart(prev);
            installIdentify(prev);
            installSelect(prev);
            installVote(prev);
            installThanks(prev);

            prev.show();
            curPage = (curPage === 1 ? 2 : 1);

            let height = prev.height();
            if ($(window).height() < height) {
                $('html').css('height', height);
                $('body').css('height', height);
            } else {
                $('html').css('height', '100%');
                $('body').css('height', '100%');
            }

            if (url === '/start')
                socket.io.emit('reset');
            else
                state.startTimer(timeoutSec, timeoutUrl);

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
                    done();
                },
            }
        );
        $('#page' + curPage).fadeOut(done);
    });
}
