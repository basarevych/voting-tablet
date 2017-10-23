/**
 * Start screen module
 * @module front/start
 */

'use strict';

import { socket } from 'socket';
import { transition, lastTransition } from 'transition';

let savedTransition;
let installed = false;
export function installStart() {
    savedTransition = lastTransition.timestamp;
    if (!installed) {
        installed = true;
        $('body').on('click', () => {
            if (lastTransition.timestamp === savedTransition &&
                lastTransition.url === '/start' && socket.registered)
                transition('/select');
        });
    }
}
