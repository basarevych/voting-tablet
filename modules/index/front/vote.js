/**
 * Voting module
 * @module front/vote
 */
'use strict';

import { socket } from 'socket';
import { transition, lastTransition } from 'transition';

let score, timer, counter;
export function installVote(el) {
    if (el.find('.score-list').length && lastTransition.code)
        $('body').addClass('colors-' + lastTransition.code);

    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    let done = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        socket.io.emit('score', { score });
        transition('/thanks', 3, '/select');
    };

    el.find('.score-item').click(function () {
        score = $(this).data('score');
        counter = 3;

        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        timer = setInterval(
            () => {
                if (--counter <= 0)
                    done();
                else
                    el.find('.btn-ok').html(`OK ${counter}`);
            },
            1000
        );
        lastTransition.startTimer();

        el.find('.score-item').each(function (index) {
            if (index + 1 <= score)
                $(this).find('.score-pic').addClass('selected');
            else
                $(this).find('.score-pic').removeClass('selected');
        });
    });
    el.find('.btn-ok').click(done);
}
