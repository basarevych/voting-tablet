/**
 * Front index module
 * @module front/index
 */

'use strict';

import 'bootstrap';
import { socket } from 'socket';
import { transition } from 'transition';

/**
 * Hide loader on start
 */
$(window).on('load', () => {
    socket.start();
    setInterval(
        () => {
            $.get('/status', status => {
                if (!status.authorized)
                    transition('/start');
            });
        },
        60 * 60 * 1000
    );
});
