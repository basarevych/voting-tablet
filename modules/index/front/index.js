/**
 * Front index module
 * @module front/index
 */

'use strict';

import 'bootstrap';
import { transition } from 'transition';


/**
 * Hide loader on start
 */
$(window).on('load', () => {
    transition('/start');
});
