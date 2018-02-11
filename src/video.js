/**
 *
 * Show or download online video's
 *
 */

const consoleIO   = require('./consoleIO');
const npo         = require('./npo');
const shell       = require('shelljs');
const sleep       = require('sleep');
const https       = require('https');
const fs          = require('fs');
const url         = require('url');
const ProgressBar = require('ascii-progress');

/**
 * Show Live channel
 * @param stream
 */
exports.showChannel = function(stream) {
    consoleIO.comment('Fetching stream URL for ' + stream.description);

    // Get URL
    try {
        npo.getLiveUrl(stream.key).then(function(streamUrl) {
            displayVideo(streamUrl);
        });
    }
    catch (e) {
        consoleIO.error('Error fetching stream URL');
    }
};

/**
 * Show video stream
 * @param url
 */
exports.showVideo = function(url) {
    if (!checkUrl(url)) {
        consoleIO.error('Only urls from the NPO site (https://npo.nl) are allowed.');
    } else {
        try {
            let key = url.split('?')[0].split('/')[5];
            consoleIO.comment('Fetching stream URL for ' + key);
            npo.getVideoUrl(key).then(function(streamUrl) {
                displayVideo(streamUrl);
            });
        }
        catch (e) {
            consoleIO.error('Error fetching stream URL');
        }
    }
};

/**
 * Download video
 * @param url
 */
exports.downloadVideo = function(url) {
    if (!checkUrl(url)) {
        consoleIO.error('Only urls from the NPO site (http://npo.nl) are allowed.');
    } else {
        try {
            let key = url.split('?')[0].split('/')[5];
            consoleIO.comment('Fetching download URL for ' + key);
            npo.getVideoUrl(key).then(function(streamUrl) {
                downloadFile(streamUrl, process.cwd() + '/' + key + '.m4v');
            });
        }
        catch (e) {
            consoleIO.error('Error fetching stream URL');
        }
    }
};

/**
 * Displays the videostream in video_app
 * @param location
 */
function displayVideo(location) {
    const video_app     = 'QuickTime Player';

    // Inform user
    consoleIO.comment('Stream URL found: ' + location);
    consoleIO.comment('Opening stream in ' + video_app);

    // Close video_app and (re-)open with streaming URL
    shell.exec('osascript -e \'quit app "' + video_app + '"\'');
    sleep.sleep(1); // Give the video_app some time to close
    shell.exec('open -a "' + video_app + '" ' + location, { async: true });

    // Exit program
    consoleIO.comment('Happy streaming!');
}

function downloadFile(downloadUrl, saveLocation) {
    const megaByte = 1048576;

    // Inform user
    consoleIO.comment('Download video from: ' + downloadUrl);
    consoleIO.newLine();

    // Compose options
    let parsedUrl = url.parse(downloadUrl);
    let options = {
        hostname  : parsedUrl.hostname,
        port      : parsedUrl.port,
        path      : parsedUrl.path,
        method    : 'GET'
    };

    // Setup file stream
    let file = fs.createWriteStream(saveLocation);

    // Setup https request
    let req = https.request(options, function(response) {

        // Setup progressbar
        let current = 0;
        let total = Math.round(parseInt(response.headers['content-length'], 10) / megaByte);
        let bar = new ProgressBar({
            schema: 'Downloading [:bar.white ].white :current.redMB.red/:total.redMB.red :percent.yellow :elapseds.green :etas.green',
            width: 80,
            total: total
        });

        response.on('data', function(data) {
            // Update progressbar
            current += data.length;
            if (current > megaByte) {
                bar.tick(1);
                current = current - megaByte;
            }

            // Add data to filestream
            file.write(data);
        });

        response.on('end', function() {
            // Inform user
            bar.tick(1);
            consoleIO.newLine();
            consoleIO.comment('Video saved to: ' + saveLocation);
        })
    });
    req.end();
}

/**
 * Check if the given URL is a correct NPO-site url
 * @param checkUrl
 * @returns {boolean}
 */
function checkUrl(checkUrl) {
    let parsedUrl = url.parse(checkUrl);
    return (['npo.nl', 'www.npo.nl'].indexOf(parsedUrl.hostname) > 0) && (checkUrl !== '')
}
