#!/usr/bin/env node --harmony

/**
 *  Copyright (c) 2016 Jan Willem Kaper <kapersoft@gmail.com>
 *
 *  MIT license. See LICENSE.txt for details
 */

"use strict";

const consoleIO   = require('./src/consoleIO');
const video       = require('./src/video');

/**
 *
 * Main program
 *
 */
consoleIO.processMenu()
    .then(function(data) {
        switch(data.type) {
            case 'info':
                consoleIO.showInfo();
                break;
            case 'live':
                video.showChannel(data.stream);
                break;
            case 'video':
                video.showVideo(data.url);
                break;
            case 'download':
                video.downloadVideo(data.url);
                break;
            default:
                consoleIO.error(data.message);
                break;
        }
     });




