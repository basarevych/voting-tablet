/**
 * Voting module
 * @module front/vote
 */
'use strict';

import { socket } from 'socket';
import { transition, state } from 'transition';
import { Form } from 'arpen-express/front/jquery/bootstrap-form';

let score, timer, counter, savedTransition;
let commentModal;
let commentForm = new Form();

function cancelTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function done(comment) {
    cancelTimer();
    savedTransition = 0;
    socket.io.emit('vote', { score, comment: comment || null });
    transition('/thanks', 3, '/select');
}

function startTimer(el) {
    if (savedTransition !== state.timestamp)
        return;

    counter = 6;
    cancelTimer();
    timer = setInterval(
        () => {
            if (--counter <= 0)
                done();
            else
                el.find('.btn-ok').html(`OK ${counter}`);
        },
        1000
    );
}

export function installVote(el) {
    cancelTimer();
    if (!el.find('.score-list').length || !state.code)
        return;

    savedTransition = state.timestamp;
    $('body').addClass('colors-' + state.code);

    commentModal = $('#commentModal');
    commentForm.init(
        commentModal,
        {
            url: '/vote/comment',
            statusCode: {
                401: () => {
                    transition('/start');
                },
            },
            success: data => {
                if (data.success) {
                    commentModal.modal('hide');
                    done(data.form.body.value);
                }
            },
        },
        {
            url: '/vote/comment',
            statusCode: {
                401: () => {
                    transition('/start');
                },
            },
        },
    );
    commentModal.on('hidden.bs.modal', () => {
        state.startTimer();
        startTimer(el);
    });

    el.find('.btn-ok').click(() => done());
    el.find('.btn-comment').on('click', () => {
        state.cancelTimer();
        cancelTimer();
        commentModal.modal('show');
    });
    el.find('.buttons').css('visibility', 'hidden');

    el.find('.score-item').click(function () {
        score = $(this).data('score');

        state.startTimer();
        startTimer(el);

        el.find('.buttons').css('visibility', 'visible');
        el.find('.score-item').each(function (index) {
            if (index + 1 <= score)
                $(this).find('.score-pic').addClass('selected');
            else
                $(this).find('.score-pic').removeClass('selected');
        });
    });
}
