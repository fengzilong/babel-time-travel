const { diff } = require( 'string-diff-viewer' )
const fse = require( 'fs-extra' )
const { TRANSITIONS_PATH, DIFFS_PATH } = require( './constants' )

async function diffTransitions( transitions = {} ) {
  const result = {}

  for ( let [ filename, trans ] of Object.entries( transitions ) ) {
    result[ filename ] = []

    for ( let i = 0, len = trans.length; i < len; i++ ) {
      /*
        code
        pluginAlias
        visitorType
        currentNode
       */
      const prev = trans[ i ]
      const next = trans[ i + 1 ]

      if ( !next ) {
        break
      }

      const tran = {
        diff: await diff( prev.code, next.code ),
        ...next
      }

      delete tran.code

      tran.oldSource = tran.code
      tran.newSource = next.code

      result[ filename ].push( tran )
    }
  }

  return result
}

async function normalizeTransitions() {
  const string = await fse.readFile( TRANSITIONS_PATH, 'utf8' )
  const normalizedString = JSON.stringify( await diffTransitions( JSON.parse( string ) ), null, 4 )
  await fse.writeFile( DIFFS_PATH, normalizedString, 'utf8' )
}

module.exports = normalizeTransitions
