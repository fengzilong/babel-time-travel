const http = require( 'http' )
const handler = require( 'serve-handler' )
const getPort = require( 'get-port' )
const chalk = require( 'chalk' )
const { VIEWER_PATH } = require( './constants' )

async function serve() {
  const server = http.createServer( ( request, response ) => {
    return handler( request, response, {
      public: VIEWER_PATH
    } )
  } )

  const port = await getPort()
  server.listen( port, () => {
    console.log( `\nView ${ chalk.blue( 'Babel Time Travel' ) } at http://127.0.0.1:${ port }` )
  } )
}

module.exports = serve
