import { tokenize, markEdits } from 'react-diff-view'
import refractor from 'refractor'

export default ( { hunks, oldSource } ) => {
  if ( !hunks ) {
    return undefined
  }

  const options = {
    highlight: true,
    refractor,
    oldSource,
    language: 'javascript',
    enhancers: [ markEdits( hunks, { type: 'block' } ) ],
  }

  try {
    return tokenize( hunks, options )
  } catch ( ex ) {
    return undefined
  }
}
