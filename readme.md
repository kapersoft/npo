# NPO Streams
CLI utility for macOS to watch NPO streams in QuickTime Player.

## Introduction
Last summer the Dutch public broadcaster [NPO](http://npo.nl) had a bunch of live streams to watch the 2016 summer olympics. I got annoyed watching the streams in a browser, so I created a little tool to watch the olympics in QuickTime Player. Recently I rewrote the tool to support the 8 public NPO streams and decided to share it with the world.

_**Note**: The NPO has a geoblock on all their streams. Streaming NPO channels is only possible in The Netherlands!_

## Prerequisites
- [OS X or macOS](http://apple.com).
- [NodeJS](https://nodejs.org/en/download/).

## Installation
- In your terminal type `npm install -g npo`.

## Documentation
- Type `npo` or `npo --help` to show the available NPO streams.
- Type `npo [stream name]` to start watching a stream. E.g. `npo cultura`.

## Participate
In case you like to improve this package (e.g. add new streams or support for other platforms/videoplayers) then feel free to create a pull request.

## License
NPO Streams is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
