import React, { useState, useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'
import HashLoader from 'react-spinners/HashLoader'
import { getHighlighter, setCDN } from 'shiki'
import jsGrammar from 'shiki-languages/data/javascript.tmLanguage.json'

import App from './App'
import theme from './theme.json'

setCDN( '/shiki/' )

function AppContainer() {
  const [ highlighter, setHighlighter ] = useState( null )
  const [ transitions, setTransitions ] = useState( [] )
  const [ loading, setLoading ] = useState( true )

  useEffect( () => {
    Promise.all( [
      getHighlighter( {
        theme: theme,
        langs: [ 'javascript' ],
      } ),
      fetch( '/transitions.json?t=' + Date.now() ).then( res => res.json() )
    ] )
      .then( ( [ highlighter, transitions ] ) => {
        setHighlighter( highlighter )
        setTransitions( transitions )
        setLoading( false )

        // for debug
        window.transitions = transitions
      } )
  }, [] )

  if ( loading ) {
    return <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate3d(-50%,-50%,0)'
    }}>
      <HashLoader loading={ true } color="#2e92f5" size={ 36 } />
    </div>
  }

  return <React.StrictMode>
    <App highlighter={ highlighter } transitions={ transitions } />
  </React.StrictMode>
}

ReactDOM.render(
  <AppContainer />,
  document.getElementById( 'root' )
)

