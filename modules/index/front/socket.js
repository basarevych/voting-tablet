/**
 * Web socket module
 * @module front/socket
 */

'use strict';

import io from 'socket.io-client';
import { transition } from 'transition';

export let socket = {
    io: null,
    connected: false,
    registered: false,
    start: () => {
        socket.io = io();
        socket.io.on('connect', socket.onConnect);
        socket.io.on('reconnect', socket.onConnect);
        socket.io.on('disconnect', socket.onDisconnect);
        socket.io.on('reload', socket.onReload);
        socket.io.on('identify', socket.onIdentify);
        socket.io.on('select', socket.onSelect);
        socket.io.on('vote', socket.onVote);
    },
    onConnect: () => {
        socket.connected = true;
        socket.registered = false;
        transition('/start');
    },
    onDisconnect: () => {
        socket.connected = false;
        socket.registered = false;
        transition('/start');
    },
    onReload: () => {
        transition('/start');
    },
    onIdentify: () => {
        transition('/identify');
    },
    onSelect: () => {
        transition('/select');
    },
    onVote: () => {
        transition('/vote');
    },
};
