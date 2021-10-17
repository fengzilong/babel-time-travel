const Module = require( 'module' )
const { wrap } = require( './wrap' )

delete require.cache[ '@babel/traverse' ]

const req = Module.prototype.require

Module.prototype.require = function require( id, ...rest ) {
  let mod = req.call( this, id, ...rest )
  return hook( mod, id, Module._resolveFilename.call( this, id, this ) )
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

  return mod
}
