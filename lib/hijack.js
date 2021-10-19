const Module = require( 'module' )
const path = require( 'path' )
const fse = require( 'fs-extra' )
const { wrap, transitions } = require( './wrap' )
const { TRANSITIONS_PATH } = require( './constants' )

exports.clearData = function () {
  fse.removeSync( TRANSITIONS_PATH )
}

exports.hijack = function () {
  const req = Module.prototype.require
  Module.prototype.require = function require( id, ...rest ) {
    const resolvedFileName = Module._resolveFilename.call( this, id, this )

    let mod = req.call( this, id, ...rest )
    return hook( mod, id, resolvedFileName )
  }

  function hook( mod, id, filename ) {
    // `@babel/core` is complicated to hook(also use generator internally)
    // so we hook `@babel/traverse` here
    if ( filename.includes( '@babel/traverse/lib/visitors.js' ) ) {
      const originalMerge = mod.merge

      mod.merge = function ( visitors, states ) {
        let newWrapper

        // if states.length < visitors.length, wrapping will cause error
        if ( visitors && states && ( states.length >= visitors.length ) ) {
          newWrapper = wrap
        }

        return originalMerge( visitors, states, newWrapper )
      }
    }

    if ( filename.includes( '@babel/traverse/lib/index.js' ) ) {
      const originalTraverse = mod.default

      mod.default = function ( ...args ) {
        const result = originalTraverse.call( this, ...args )

        console.log( '--- writing transitions', JSON.stringify( transitions, null, 0 ).length )
        // write transitions.json to viewer on every traversing end
        fse.writeFileSync(
          TRANSITIONS_PATH,
          // eslint-disable-next-line no-magic-numbers
          JSON.stringify( transitions, null, 0 ),
          'utf8'
        )

        return result
      }

      // there are other properties on `originalTraverse` should be re-assigned
      Object.assign( mod.default, originalTraverse )
    }

    return mod
  }
}
