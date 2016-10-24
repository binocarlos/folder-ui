import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Routes from './routes'
import FolderReducer from '../src/reducer'

const finalCreateStore = compose(
  applyMiddleware(thunk, routerMiddleware(hashHistory)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const reducer = combineReducers({
  routing: routerReducer,
  products:FolderReducer('products')
})

const store = finalCreateStore(reducer)

const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

const routes = Routes()

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>

      <Router history={history}>

        {routes}

      </Router>

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)