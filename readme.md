# NPO Streams
CLI utility for macOS to watch NPO live- and video streams in QuickTime Player.

## Introduction
In 2016 the Dutch public broadcaster [NPO](http://npo.nl) had a bunch of live streams to watch the 2016 summer olympics. I got annoyed watching the streams in a browser, so I created a small tool to watch the olympics in QuickTime Player. Recently I rewrote the tool to support the 11 public NPO streams plus NPO videos (e.g. 'uitzending gemist') and decided to share it with the world.

_**Note**: The NPO has a geoblock on their streams. Streaming NPO channels and videos is only possible in The Netherlands!_

## Prerequisites
- [OS X or macOS](http://apple.com).
- [NodeJS](https://nodejs.org/en/download/).

## Installation
- In your terminal type `npm install -g npo`.

## Documentation

#### Watch NPO live streams
In your terminal type
- `npo` or `npo --help` to show the available NPO live streams.
- `npo [stream name]` to start watching a stream. E.g. `npo cultura`.

#### Watch NPO Video streams
Go to the [NPO site](http://npo.nl) and select the video of your choosing. Copy the url from the address. Open your terminal and type `npo --video [url from your address bar]` to start watching the video. E.g. `npo --video http://www.npo.nl/zondag-met-lubach/VPWON_1250334`.

#### Download NPO Video streams
Go to the [NPO site](http://npo.nl) and select the video of your choosing. Copy the url from the address. Open your terminal and type `npo --download [url from your address bar]` to start watching the video. E.g. `npo --download http://www.npo.nl/zondag-met-lubach/VPWON_1250334`.

## Participate
In case you like to improve this package (e.g. add new streams or support for other platforms/videoplayers) then feel free to create a pull request.

## License
NPO Streams is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT). See LICENSE.txt for more information.
