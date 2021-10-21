# babel-time-travel

[![npm](https://img.shields.io/npm/v/babel-time-travel.svg)](https://www.npmjs.org/package/babel-time-travel)
[![npm](https://img.shields.io/npm/dm/babel-time-travel.svg)](https://www.npmjs.org/package/babel-time-travel)
[![npm](https://img.shields.io/npm/l/babel-time-travel.svg)](https://www.npmjs.org/package/babel-time-travel)

<img src="media/screenshot.jpg" alt="screenshot" width="650" />

<img src="media/screenshot2.jpg" alt="screenshot" width="650" />

Tell you the story about how every babel plugin transform your file inside a blackbox

## Installation

```bash
npm i babel-time-travel -g
```

## Usage

`babel-time-travel` will register a global command named `btt` after a global installation

To use it, simply add your own command after `btt`

> Format: btt [options] -- [your-command]

```bash
btt -- npm run build
btt -- babel src --out-dir lib
btt -- ... # any other command
```

With options

- --filter

  ```bash
  btt --filter axios/lib -- npm run build
  ```

  If babel-time-travel is slow running in your project, you can limit it to only run on certain files by using `--filter` option

Note

- Blackboxed `babel` should run in the same process with your command
- Don't cache any babel transformation result( like babel-loader caching )
- Options like `--filter` should placed before `--`

## Thanks

Highly inspired by [babel/babel-time-travel](https://github.com/babel/babel-time-travel) which supports time travel in browser

## License

MIT
