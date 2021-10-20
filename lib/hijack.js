const Module = require( 'module' )
const path = require( 'path' )
const fse = require( 'fs-extra' )
const { wrap, transitions } = require( './wrap' )
const { TRANSITIONS_PATH, DIFFS_PATH } = require( './constants' )

exports.clearData = function () {
  // try to remove previous transitions file
  fse.removeSync( TRANSITIONS_PATH )
  fse.removeSync( DIFFS_PATH )

  // try to remove babel-loader cache
  fse.removeSync( path.join(
    process.cwd(),
    'node_modules/.cache/babel-loader'
  ) )
}

exports.hijack = function () {
  const hijackCache = Object.create( null )

  const req = Module.prototype.require
  Module.prototype.require = function require( id, ...rest ) {
    const resolvedFileName = Module._resolveFilename.call( this, id, this )

    if ( hijackCache[ resolvedFileName ] ) {
      return hijackCache[ resolvedFileName ]
    }

    const mod = req.call( this, id, ...rest )
    const hooked = hook( mod, id, resolvedFileName )

    hijackCache[ resolvedFileName ] = hooked

    return hooked
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
