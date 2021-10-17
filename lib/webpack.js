const fs = require( 'fs' )
const path = require( 'path' )
const http = require( 'http' )
const handler = require( 'serve-handler' )
const getPort = require( 'get-port' )
const { transitions } = require( './wrap' )

const ID = `WebpackBabelTimeTravelPlugin`
const VIEWER_PATH = path.join( __dirname, '../viewer/dist' )

class ViewerPlugin {
  apply( compiler ) {
    compiler.hooks.done.tapPromise( ID, async () => {
      // write transition to viewer
      fs.writeFileSync(
        path.join( VIEWER_PATH, 'transitions.json' ),
        // eslint-disable-next-line no-magic-numbers
        JSON.stringify( transitions, null, 0 ),
        'utf8'
      )

      // start server
      const server = http.createServer( ( request, response ) => {
        return handler( request, response, {
          public: VIEWER_PATH
        } )
      } )

      const port = await getPort()
      server.listen( port, () => {
        console.log( `View Babel Time Travel at http://127.0.0.1:${ port }` )
      } )
    } )
  }
}

class HijackPlugin {
  apply() {
    require( './hijack' )
  }
}

exports.Plugin = ViewerPlugin
exports.HijackPlugin = HijackPlugin
