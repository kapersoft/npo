/**
 *
 * Stream functions (this is where the magic happens)
 *
 */

const request     = require('request');
const S           = require('string');

/**
 * Get url for NPO Videostream
 * @param key
 * @returns {Promise}
 */
exports.getVideoUrl = function(key) {
    return new Promise((resolve) => {
        getStreams(key).then(function (streams) {
            let selectedStream = {};
            ['Hoog', 'Normaal', 'Laag'].every(function (label) {
                selectedStream = streams.find(function (stream) {
                    return (stream.label === label);
                });
                return (selectedStream === null);
            });

            if (selectedStream) {
                request(selectedStream.url, function(error, response, body) {
                    if (body.indexOf("errorstring") < 0) {
                        return resolve(JSON.parse(S(body).between('(', ')')).url);
                    } else {
                        return resolve(S(body).between('"errorstring":"', '"').toString());
                    }
                });
            }
        });
    });
};


/**
 * Get url for NPO Livestream
 * @param key
 * @returns {Promise}
 */
exports.getLiveUrl = function(key) {
    return new Promise((resolve) => {
        getStreams(key).then(function (streams) {
            let selectedStream = streams.find(function (stream) {
                return stream.contentType === 'live';
            });
            if (selectedStream) {
                request(selectedStream.url, function(error, response, body) {
                    if (body.indexOf("errorstring") < 0) {
                        return resolve(S(body).between('"', '"').toString().replace(/\\\//g, "/"));
                    } else {
                        return resolve(S(body).between('"errorstring":"', '"').toString());
                    }
                });
            }
        });
    });
};

/**
 * Get Object with stream-data
 * @param key
 * @returns {Promise}
 */
function getStreams(key) {
    return new Promise((resolve) => {
        request('https://ida.omroep.nl/app.php/auth', function(error, response, body) {
            let token = JSON.parse(body).token;
            let url = 'https://ida.omroep.nl/app.php/' + key + '?adaptive=no&token=' + token;
            request(url, function(error, response, body) {
                resolve(JSON.parse(body).items[0]);
            });
        });
    });
}
