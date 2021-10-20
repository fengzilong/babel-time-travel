const path = require( 'path' )

const VIEWER_PATH = path.join( __dirname, '../viewer/dist' )
const TRANSITIONS_PATH = path.join( VIEWER_PATH, 'transitions.json' )
const DIFFS_PATH = path.join( VIEWER_PATH, 'diffs.json' )

module.exports = {
  VIEWER_PATH,
  TRANSITIONS_PATH,
  DIFFS_PATH
}
