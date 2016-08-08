import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'
import { Container, Row, Col } from 'kettle-ui/lib/Grid'
import Sidebar from 'react-sidebar'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'

import TreeContainer from './TreeContainer'
import treereducer from './reducer'

const reducer = combineReducers({
  tree: treereducer
})

const finalCreateStore = compose(
  applyMiddleware(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const store = finalCreateStore(reducer)

injectTapEventPlugin()

const styles = {
  container:{
    marginTop:'100px'
  },
  drawer:{
    marginTop:'64px'
  }
}

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>
      <div>
        <Sidebar 
          sidebar={
          <TreeContainer 
            title="My Tree" />
          }
          docked={true}
          transitions={false}
          open={true}>
          <div>
            <AppBar
              showMenuIconButton={false}
              title="Home"
              zDepth={3}
            />
            <Row>
              <Col sm={4}></Col>
              <Col sm={8}>
                content
              </Col>
            </Row>
          </div>
        </Sidebar>
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)