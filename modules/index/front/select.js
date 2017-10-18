/**
 * Target selecting module
 * @module front/select
 */
'use strict';

import { socket } from 'socket';

export function installSelect(el) {
    el.find('.target-item').click(function () {
        socket.io.emit('target_id', { id: $(this).data('id') });
    });
}
