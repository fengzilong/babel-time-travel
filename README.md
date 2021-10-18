# babel-time-travel

[![npm](https://img.shields.io/npm/v/babel-time-travel.svg)](https://www.npmjs.org/package/babel-time-travel)
[![npm](https://img.shields.io/npm/dm/babel-time-travel.svg)](https://www.npmjs.org/package/babel-time-travel)
[![npm](https://img.shields.io/npm/l/babel-time-travel.svg)](https://www.npmjs.org/package/babel-time-travel)

<img src="media/screenshot.jpg" alt="screenshot" width="450" />

<img src="media/screenshot2.jpg" alt="screenshot" width="450" />

Tell you the story about how every babel plugin transform your file inside a blackbox

## Installation

```bash
npm i babel-time-travel
```

## Usage

```js
const { WebpackHijackPlugin, WebpackPlugin } = require( 'babel-time-travel' )

// in your webpack config
{
  plugins: [
    // hijack plugin is used to hook your babel
    new WebpackHijackPlugin(),
    // webpack plugin is used to serve the time travel viewer page
    new WebpackPlugin(),
  ]
}
```

## Thanks

Highly inspired by [babel/babel-time-travel](https://github.com/babel/babel-time-travel) which supports view time-travel in browser

## License

MIT
