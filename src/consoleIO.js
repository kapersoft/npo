/**
 *
 * Console functions
 *
 */

const commander     = require('commander');
const pjson       = require('./../package.json');
const chalk       = require('chalk');
const figlet      = require('figlet');
const shell       = require('shelljs');
const stream_list = require('../stream_list.json');

/**
 * Displays welcome screen and process commandline arguments
 * @returns {Promise}
 */
exports.processMenu = function() {
    return new Promise((resolve) => {
        console.log(
            chalk.red(
                figlet.textSync('NPO Streams', {
                        horizontalLayout: 'full',
                        verticalLayout: 'default'
                    }
                )
            )
        );

        this.info(pjson.description + '\n');

        // Tweak commandline arguments a bit
        if (process.argv.length === 2) process.argv.push('--help'); // show help if no command is entered
        if (process.argv.indexOf('-v') > -1) process.argv[process.argv.indexOf('-v')] = '-V'; // use -v for version

        // Setup commander
        commander.option('-i, --info', 'display license- and contact information');
        commander.option('', '');
        stream_list.forEach(function (stream) {
            commander.option(stream.cmd, stream.description);
        });
        commander.option('-v --video [url]', 'Stream a video from https://npo.nl, use url from the address bar');
        commander.option('-d --download [url]', 'Download a video from https://npo.nl, use url from the address bar');

        // Add extra info for help option
        commander.on('--help', function () {
            console.log('');
            console.log('  Examples:');
            console.log('    $ npo cultura');
            console.log('    $ npo --url https://www.npo.nl/zondag-met-lubach/VPWON_1250334');
            console.log('    $ npo --download https://www.npo.nl/the-mind-of-the-universe/07-05-2017/VPWON_1240593');
            console.log('');
            console.log('  NPO is the Dutch public broadcaster. More info about NPO can be found at https://npo.nl');
            console.log('');
        });

        // Parse commandline arguments
        commander.parse(process.argv);

        // Check commandline for options
        stream_list.forEach(function (stream) {
            if (commander[stream.cmd]) {
                return resolve({type: 'live', stream: stream});
            }
        });
        if (commander.video) return resolve({type: 'video', url: commander.video});
        if (commander.download) return resolve({type: 'download', url: commander.download});
        if (commander.info || commander.i) return resolve({type: 'info'});
        return resolve({type: 'error', 'argument': process.argv[2]});
    });
};

/**
 * Show information about this tool
 */
exports.showInfo = function() {
    this.info('Version           : npo ' + pjson.version);
    this.info('Author            : ' + pjson.author);
    this.info('Homepage          : ' + pjson.homepage);
    this.info('Questions & bugs  : ' + pjson.bugs.url);
    this.info('License           : ' + pjson.license + '\n');
    this.info(shell.cat([__dirname + '/../LICENSE.txt']).stdout + '\n');
};

/**
* Display information in console
* @param message
*/
exports.info = function(message) {
    console.log(
        chalk.bold.yellow(message)
    );
};

/**
 * Display a comment in console
 * @param message
 */
exports.comment = function (message) {
    console.log(
        chalk.bold.green(pjson.name + ': ' + message)
    );
};

/**
 * Display error message in console and exit
 * @param error
 */
exports.error = function (error) {
    console.log(
        chalk.bold.red(pjson.name + ': ' + error)
    );
    shell.exit();
};

/**
 * Insert a empty line in console
 */
exports.newLine = function() {
    console.log('');
};
