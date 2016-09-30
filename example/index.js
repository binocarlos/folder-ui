import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Wrapper from './Wrapper'
import Folders from './Folders'

import folderreducer from '../src/reducer'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const reducer = combineReducers({
  folderui: folderreducer,
  routing: routerReducer
})

const store = finalCreateStore(reducer)

const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>

      <Router history={history}>
        <Route path="/" component={Wrapper}>
          <IndexRoute component={Folders} />
          <Route path="*" component={Folders} />
        </Route>
      </Router>

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)