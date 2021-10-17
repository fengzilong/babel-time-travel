/* eslint-disable no-magic-numbers */
const { relative } = require( 'path' )
const generate = require( '@babel/generator' ).default

const transitions = exports.transitions = {}

const cwd = process.cwd()

exports.wrap = function ( pluginAlias, visitorType, callback ) {
  return ( path, ...rest ) => {
    const type = path.node.type

    const oldPprogramPath = path.find( p => p.isProgram() )
    const { code: oldCode } = generate( oldPprogramPath.node )

    callback.call( this, path, ...rest )

    const programPath = path.find( p => p.isProgram() )
    const filename = relative( cwd, programPath.hub.file.opts.filename )
    const { code } = generate( programPath.node )

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
