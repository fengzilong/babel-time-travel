#!/usr/bin/env node

const path = require( 'path' )
const chalk = require( 'chalk' )
const execa = require( 'execa' )
const { clearData } = require( '../lib/hijack' )

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

    process.on( 'SIGINT', () => {
      subprocess.kill( 'SIGINT', {
        forceKillAfterTimeout: 1000
      } )
    } )

    await subprocess

    require( '../lib/serve' )()
  } catch ( e ) {
    console.log( e )
  }
} )()

