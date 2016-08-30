import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'
import AppNavWrapper from 'kettle-ui/lib/AppNavWrapper'

import { Container, Row, Col } from 'kettle-ui/lib/Grid'

import DB from './db'
import TreeContainer from '../src/TreeContainer'
import ContentContainer from '../src/ContentContainer'

import folderreducer from '../src/reducer'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const reducer = combineReducers({
  folderui: folderreducer
})

const store = finalCreateStore(reducer)

var db = DB()

injectTapEventPlugin()

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>
     <AppNavWrapper
        appbar={
          <AppBar
            showMenuIconButton={false}
            title="Home"
            zDepth={2} />
        }
        width={250}
        paperprops={{
          zDepth:1,
          rounded:false
        }}
        navbar={
          <TreeContainer 
            loadTree={db.loadTree}
            loadChildren={db.loadChildren}
            title="My Folders" />
        }>
        
        <ContentContainer 
          loadChildren={db.loadChildren}
          saveItem={db.saveItem}
          offsetWidth={250} />
        
      </AppNavWrapper>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)