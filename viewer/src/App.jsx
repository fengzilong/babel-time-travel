/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
import { useState, useMemo, useEffect } from 'react'
import { parseDiff, Diff, Hunk } from 'react-diff-view'
import Select from 'react-select'
import tokenize from './tokenize'

import 'react-diff-view/style/index.css'
import 'prism-color-variables/variables.css'
import 'prism-color-variables/themes/visual-studio.css'
import './App.less'

const EMPTY_HUNKS = []

function IconoirRedo( props ) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}><g strokeWidth="1.5" fill="none"><path d="M19 9.5H9c-.162 0-4 0-4 4C5 18 8.702 18 9 18h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.5 13L19 9.5L15.5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
  )
}

function IconoirUndo( props ) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}><g strokeWidth="1.5" fill="none"><path d="M5 9.5h10c.162 0 4 0 4 4c0 4.5-3.702 4.5-4 4.5H7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 13L5 9.5L8.5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
  )
}

function DiffViewer( { transition } ) {
  const [ { type, hunks } ] = parseDiff( transition.diff, {
    nearbySequence: 'zip',
  } )

  const tokens = useMemo( () => tokenize( {
    hunks,
    oldSource: transition.oldSource
  } ), [ hunks, transition ] )

  return <Diff
    viewType="split"
    diffType={ type }
    hunks={ hunks || EMPTY_HUNKS }
    tokens={ tokens }
  >
    { hunks => hunks.map( hunk => <Hunk key={ hunk.content } hunk={ hunk } /> ) }
  </Diff>
}

function App( props ) {
  const { transitions } = props

  const selectOptions = useMemo(
    () => {
      if ( !transitions ) {
        return []
      }

      const files = Object.keys( transitions )

      return files.map( file => ( {
        label: file + ` ( ${ hasTransition( transitions[ file ] ) ? transitions[ file ].length + ' changes' : 'No changes' } )`,
        value: file,
      } ) )
    },
    [ transitions ]
  )

  const [ file, setFile ] = useState(
    () => selectOptions[ 0 ] && selectOptions[ 0 ].value
  )
  const [ index, setIndex ] = useState( 0 )

  useEffect( () => {
    if ( !file ) {
      alert( 'No file included' )
    }
  }, [] )

  function onChange( selected ) {
    setFile( selected.value )
    setIndex( 0 )
  }

  function hasTransition( trans = [] ) {
    return trans.length > 0
  }

  if ( !file ) {
    return null
  }

  return <div className="container">
    <div className="header">
      <div className="search">
        <Select
          defaultValue={ selectOptions[ index ] }
          options={ selectOptions }
          onChange={ onChange }
        />
      </div>

      <div className="controls">
        <div
          className={ 'control-item ' + ( index === 0 ? 'is-disabled' : '' ) }
          onClick={ () => setIndex( index => index - 1 ) }
        >
          <IconoirUndo></IconoirUndo>
        </div>

        <div
          className={ 'control-item ' + ( index === ( transitions[ file ].length - 1 ) ? 'is-disabled' : '' ) }
          onClick={ () => setIndex( index => index + 1 ) }
        >
          <IconoirRedo></IconoirRedo>
        </div>

        {
          hasTransition( transitions[ file ] ) ?
            <>
              <span className="transition-info">( { ( index + 1 ) } / { transitions[ file ].length } )</span>
              <span className="transition-info">{ transitions[ file ][ index ].pluginAlias }</span>
              <span className="transition-info">{ transitions[ file ][ index ].currentNode }:{ transitions[ file ][ index ].visitorType }</span>
            </> :
            null
        }
      </div>
    </div>

    <div className="diff-view">
      {
        hasTransition( transitions[ file ] ) ?
          <DiffViewer transition={ transitions[ file ][ index ] } /> :
          <div style={{ padding: '20px' }}>No changes</div>
      }
    </div>
  </div>
}

export default App

/*
<ReactDiffViewer
            styles={ newStyles }
            oldValue={ transitions[ file ][ index ].code }
            newValue={ transitions[ file ][ index + 1 ].code }
            splitView={ true }
            useDarkTheme={ false }
            renderContent={ highlight }
          /> :
*/
