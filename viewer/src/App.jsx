/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
import { useState, useMemo, useEffect } from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import Select from 'react-select'
import { renderToHtml } from 'shiki'
import './App.less'

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

function App( props ) {
  const { highlighter, transitions } = props

  const selectOptions = useMemo(
    () => {
      if ( !transitions ) {
        return []
      }

      const files = Object.keys( transitions )

      return files.map( file => ( {
        label: file + ` ( ${ transitions[ file ].length === 1 ? 'No changes' : transitions[ file ].length - 1 + ' changes' } )`,
        value: file,
      } ) )
    },
    [ transitions ]
  )

  const [ file, setFile ] = useState(
    () => selectOptions[ 0 ] && selectOptions[ 0 ].value
  )
  const [ index, setIndex ] = useState( 0 )

  const newStyles = {
    variables: {
      dark: {
        removedBackground: '#c8636360',
        wordRemovedBackground: '#b14b4b60',
        removedGutterBackground: '#c8636360',

        addedGutterBackground: '#2e9d6060',
        addedBackground: '#2e9d6060',
        wordAddedBackground: '#1d854c60'
      },
    },
    line: {
      padding: '5px 2px'
    },
    codeFold: {
      a: {
        textDecoration: 'none!important',
      },
    }
  }

  function onChange( selected ) {
    setFile( selected.value )
    setIndex( 0 )
  }

  function highlight( code = '' ) {
    const tokens = highlighter.codeToThemedTokens( code, 'js' )
    return <div
      dangerouslySetInnerHTML={{
        __html: renderToHtml( tokens, {
          fg: highlighter.getForegroundColor(),
          bg: 'inherit'
        } )
      }}>
    </div>
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
          className={ 'control-item ' + ( index <= 0 ? 'is-disabled' : '' ) }
          onClick={ () => setIndex( index => index - 1 ) }
        >
          <IconoirUndo></IconoirUndo>
        </div>

        <div
          className={ 'control-item ' + ( index >= ( transitions[ file ].length - 2 ) ? 'is-disabled' : '' ) }
          onClick={ () => setIndex( index => index + 1 ) }
        >
          <IconoirRedo></IconoirRedo>
        </div>

        {
          transitions[ file ].length > 1 ?
            <>
              <span className="transition-info">( { ( index + 1 ) } / { transitions[ file ].length - 1 } )</span>
              <span className="transition-info">{ transitions[ file ][ index + 1 ].pluginAlias }</span>
              <span className="transition-info">{ transitions[ file ][ index + 1 ].currentNode }:{ transitions[ file ][ index + 1 ].visitorType }</span>
            </> :
            null
        }
      </div>
    </div>

    <div className="diff-view">
      {
        transitions[ file ].length > 1 ?
          <ReactDiffViewer
            styles={ newStyles }
            oldValue={ transitions[ file ][ index ].code }
            newValue={ transitions[ file ][ index + 1 ].code }
            splitView={ true }
            useDarkTheme={ false }
            renderContent={ highlight }
          /> :
          <div style={{ padding: '20px' }}>No changes</div>
      }
    </div>
  </div>
}

export default App
