/**
 * Front index module
 * @module front/index
 */

'use strict';

import 'bootstrap';
import { socket } from 'socket';

/**
 * Hide loader on start
 */
$(window).on('load', () => {
    socket.start();
    setInterval(
        () => {
            $.get('/');
        },
        60 * 60 * 1000
    );
});
