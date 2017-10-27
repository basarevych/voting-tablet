/**
 * Start screen module
 * @module front/start
 */

'use strict';

import { socket } from 'socket';
import { transition, state } from 'transition';

let savedTransition;
let installed = false;
export function installStart() {
    savedTransition = state.timestamp;
    if (!installed) {
        installed = true;
        $('body').on('click', () => {
            if (state.timestamp === savedTransition &&
                state.url === '/start' && socket.registered)
                transition('/select');
        });
    }
}
