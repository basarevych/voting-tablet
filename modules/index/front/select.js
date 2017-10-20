/**
 * Target selecting module
 * @module front/select
 */

'use strict';

import { socket } from 'socket';
import { lastTransition } from 'transition';

export function installSelect(el) {
    el.find('.target-item').click(function () {
        lastTransition.code = $(this).data('code');
        socket.io.emit('target_id', { id: $(this).data('id') });
    });
}
