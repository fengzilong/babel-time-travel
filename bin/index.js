#!/usr/bin/env node
/* eslint-disable no-magic-numbers */

const path = require( 'path' )
const chalk = require( 'chalk' )
const execa = require( 'execa' )
const cli = require( 'cac' )()
const { clearData } = require( '../lib/hijack' )
const generateDiffs = require( '../lib/diff' )
const pkg = require( '../package.json' )

cli
  .command( '', 'Run babel time travel' )
  .option( '--filter <filter>', 'Filter files' )
  .action( async ( options = {} ) => {
    const { filter = '', '--': command = [] } = options

    clearData()

    try {
      const subprocess = execa.command(
        command.join( ' ' ),
        {
          preferLocal: true,
          stdio: 'inherit',
          env: {
            NODE_OPTIONS: `--require ${ path.join( __dirname, '../lib/preload.js' ) }`,
            BTT_FILTER: filter,
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
  } )
cli.help()
cli.version( pkg.version )
cli.parse()

