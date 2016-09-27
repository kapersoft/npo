#!/usr/bin/env node

"use strict";

var chalk           = require('chalk')
var commander       = require('commander');
var figlet          = require('figlet');
var request         = require('sync-request');
var S               = require('string');
var shell           = require('shelljs');
var sleep           = require('sleep')

const video_app     = 'QuickTime Player';
const stream_list   = require('./stream_list.json')
const pjson         = require('./package.json');

// Show banner
console.log(
    chalk.red(
        figlet.textSync('NPO Streams', {
            horizontalLayout: 'full',
            verticalLayout: 'default'}
            )
        )
    );
info(pjson.description + '\n');

// Tweak command line arguments a bit
if (process.argv.length == 2) process.argv.push('--help'); // show help if no command is entered
if (process.argv.indexOf('-v') > -1) process.argv[process.argv.indexOf('-v')] = '-V' // use -v for version

// Set-up commander
commander.option('-i, --info', 'display license- and contact information');
commander.option('', '');
stream_list.forEach (function (stream) { 
    commander.option(stream.cmd, stream.description);
});
commander.on('--help', function(){
  console.log('  Example:');
  console.log('');
  console.log('    $ npo cultura');
  console.log('');
});
commander.parse(process.argv);

// Check command line for valid streams
stream_list.forEach (function (stream) { 
    if (commander[stream.cmd]) {

        comment('Fetching stream URL for ' + stream.description);

        // Get URL
        try {
            var streamUrl = getStreamUrl(stream.url);
        }
        catch(e) {
            error('Error fetching stream URL');
        }
    
        if (streamUrl.length > 0) {

            // Inform user
            comment('Stream URL found: ' + streamUrl.replace(/\\\//g, "/"));
            comment('Opening stream in ' + video_app);

            // Close video_app and (re-)open with streaming URL
            shell.exec('osascript -e \'quit app "' + video_app + '"\'');
            sleep.sleep(1); // Give the video_app some time to close
            shell.exec('open -a "' + video_app + '" ' + streamUrl, { async: true });

            // Exit program
            comment('Happy streaming!');
            shell.exit();
        }
        else {
            error('Error fetching stream URL');
        }
    }
});

// Display license- contact information
if (commander.info || commander.i) {
    info('Version           : npo ' + pjson.version);
    info('Author            : ' + pjson.author);
    info('Homepage          : ' + pjson.homepage);
    info('Questions & bugs  : ' + pjson.bugs.url);
    info('License           : ' + pjson.license + '\n');
    info(shell.cat([__dirname + '/LICENSE.txt']).stdout + '\n');
    shell.exit();
}

// No valid command line option entered
error('"' + process.argv[2] + '" is not a NPO stream. See `npo --help` for a list of NPO streams.')


// Helper functions

function info(message) {
    console.log(
        chalk.bold.yellow(message)
        );
}

function comment(message) {
    console.log(
        chalk.bold.green(pjson.name + ': ' + message)
        );
}

function error(error)
{
    console.log(
        chalk.bold.red(pjson.name + ': ' + error)
        );
    shell.exit();
}

function setCharAt(str, index, chr) {
    if ( index > str.length - 1 ) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

function getStreamUrl(url) {

    // Get Token
    var res = request('GET', 'http://ida.omroep.nl/npoplayer/i.js?s=' + encodeURIComponent(url));
    var npoToken = S(res.getBody()).between('"', '"').toString();
    var firstPosition = null;
    var secondPosition = null;
    for (var i = 5; i < (npoToken.length - 5); i++) {
        if (!isNaN(npoToken[i])) {
            if (firstPosition === null) {
                firstPosition = i;
            } else if (secondPosition === null) {
                secondPosition = i;
                break;
            }
        }
    }
    if (secondPosition !== null) {
        var first_digit = npoToken[firstPosition];
        var second_digit = npoToken[secondPosition];
        npoToken = setCharAt(npoToken, firstPosition, second_digit);
        npoToken = setCharAt(npoToken, secondPosition, first_digit);
    } else {
        var first_character = npoToken[12];
        var second_character = npoToken[13];
        npoToken = setCharAt(npoToken, 12, second_character);
        npoToken = setCharAt(npoToken, 13, first_character);
    }

    // Get Stream URL
    res = request('GET', 'http://ida.omroep.nl/aapi/?type=jsonp&callback=?&stream=' + encodeURIComponent(url) + '&token=' + npoToken);
    var url2 = JSON.parse(S(res.getBody()).between('(', ')').toString()).stream;
    res = request('GET', url2);
    return S(res.getBody()).between('"', '"').toString();
}

