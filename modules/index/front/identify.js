/**
 * User identification module
 * @module front/identify
 */
'use strict';

import { socket } from 'socket';

export function installIdentify(el) {
    el.find('.user-item').click(function () {
        socket.io.emit('user_id', { id: $(this).data('id') });
    });
}
