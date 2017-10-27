/**
 * Target selecting module
 * @module front/select
 */

'use strict';

import { socket } from 'socket';
import { state } from 'transition';

export function installSelect(el) {
    el.find('.target-item').click(function () {
        state.code = $(this).data('code');
        socket.io.emit('select', { id: $(this).data('id') });
    });
}
