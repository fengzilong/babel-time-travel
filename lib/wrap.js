/* eslint-disable no-magic-numbers */
const { relative } = require( 'path' )

const transitions = exports.transitions = {}

const cwd = process.cwd()

exports.wrap = function ( pluginAlias, visitorType, callback ) {
  return ( path, ...rest ) => {
    const type = path.node.type
    const oldProgramPath = path.find( p => p.isProgram() )
    const filename = relative( cwd, oldProgramPath.hub.file.opts.filename )

    // skip node_modules by default
    if ( filename.includes( 'node_modules' ) ) {
      callback.call( this, path, ...rest )
      return
    }

    const oldCode = oldProgramPath.toString()

    callback.call( this, path, ...rest )

    const programPath = path.find( p => p.isProgram() )
    const code = programPath.toString()

    transitions[ filename ] = transitions[ filename ] || []

    const lastIndex = Math.max( 0, transitions[ filename ].length - 1 )

    if ( transitions[ filename ].length === 0 ) {
      // original code
      transitions[ filename ].push( {
        code: oldCode
      } )
    }

    if ( transitions[ filename ][ lastIndex ].code !== code ) {
      transitions[ filename ].push( {
        code,
        pluginAlias,
        visitorType,
        currentNode: type,
      } )
    }
  }
}
