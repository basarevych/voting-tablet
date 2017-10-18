/**
 * Front index module
 * @module front/index
 */

'use strict';

import 'bootstrap';
import io from 'socket.io-client';
import { transition } from 'transition';

export let socket = {
    io: io(),
    connected: false,
    registered: false,
};

socket.io.on('connect', () => { socket.connected = true; transition('/start'); });
socket.io.on('reconnect', () => { socket.connected = true; transition('/start'); });
socket.io.on('disconnect', () => { socket.connected = false; socket.registered = false; transition('/start'); });

/**
 * Hide loader on start
 */
$(window).on('load', () => {
    transition('/start');
});
