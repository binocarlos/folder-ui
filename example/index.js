import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'

import AppNavWrapper from 'kettle-ui/lib/AppNavWrapper'
import { Container, Row, Col } from 'kettle-ui/lib/Grid'

import TreeContainer from './TreeContainer'
import ContentContainer from './ContentContainer'
import reducer from './reducer'

const finalCreateStore = compose(
  applyMiddleware(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const store = finalCreateStore(reducer)

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
            title="My Folders" />
        }>
        <ContentContainer />
      </AppNavWrapper>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)