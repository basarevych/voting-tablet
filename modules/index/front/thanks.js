/**
 * Target selecting module
 * @module front/select
 */

'use strict';

import { transition, lastTransition } from 'transition';

let savedTransition;
export function installThanks(el) {
    let thanks = el.find('.thanks-message');
    if (thanks.length) {
        savedTransition = lastTransition.timestamp;
        setTimeout(
            () => {
                if (lastTransition.timestamp === savedTransition)
                    transition('/start');
            },
            5000
        );
    }
}
