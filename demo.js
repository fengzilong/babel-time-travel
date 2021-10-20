const { diff } = require( 'string-diff-viewer' )

diff(
  `const path = require( 'path' )

const VIEWER_PATH = path.join( __dirname, '../viewer/dist' )
const TRANSITIONS_PATH = path.join( VIEWER_PATH, 'transitions.json' )

module.exports = {
  VIEWER_PATH,
  TRANSITIONS_PATH
}`,
  `const path = require( 'path' )

const VIEWER_PATH = path.join( __dirname, '../viewer/dist' )
const TRANSITIONS_PATH = path.join( VIEWER_PATH, 'transitions.json' )

module.exports = {
  VIEWER_PATH__,
  TRANSITIONS_PATH
}`
).then( o => {
  console.log( '>>>', o )
} )
