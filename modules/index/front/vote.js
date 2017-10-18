/**
 * Voting module
 * @module front/vote
 */
'use strict';

import { socket } from 'socket';
import { transition } from 'transition';

let score, timer, counter;
export function installVote(el) {
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
        transition('/thanks');
    };

    el.find('.score-item').click(function () {
        score = $(this).data('score');
        counter = 6;

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

        el.find('.score-item').each(function (index) {
            if (index + 1 <= score)
                $(this).find('.score-pic').addClass('selected');
            else
                $(this).find('.score-pic').removeClass('selected');
        });
    });
    el.find('.btn-ok').click(done);
}