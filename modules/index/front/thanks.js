/**
 * Target selecting module
 * @module front/select
 */

'use strict';

import { transition } from 'transition';

export function installThanks(el) {
    let thanks = el.find('.thanks-message');
    if (thanks.length) {
        setTimeout(
            () => {
                transition('/start');
            },
            5000
        );
    }
}
