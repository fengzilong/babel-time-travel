#!/usr/bin/env node
/* eslint-disable no-magic-numbers */

const path = require( 'path' )
const chalk = require( 'chalk' )
const execa = require( 'execa' )
const { clearData } = require( '../lib/hijack' )
const generateDiffs = require( '../lib/diff' )

;( async () => {
  clearData()

  try {
    const subprocess = execa.command(
      process.argv.slice( 2 ).join( ' ' ),
      {
        preferLocal: true,
        stdio: 'inherit',
        env: {
          NODE_OPTIONS: `--require ${ path.join( __dirname, '../lib/preload.js' ) }`,
        }
      }
    )

    process.on( 'SIGTERM', () => {
      subprocess.kill( 'SIGTERM', {
        forceKillAfterTimeout: 0
      } )
    } )

    await subprocess

    await generateDiffs()

    require( '../lib/serve' )()
  } catch ( e ) {
    console.log( e )
  }
} )()

