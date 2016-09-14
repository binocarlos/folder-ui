import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import TreeContainer from '../src/TreeContainer'
import ContentContainer from '../src/ContentContainer'

import Wrapper from './Wrapper'
import Home from './Home'
import About from './About'
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

/*

TODO - get the routing to handle the page transitions

      <Router history={history}>
        <Route path="/" component={App}>
          <Route path="foo" component={Foo}/>
          <Route path="bar" component={Bar}/>
        </Route>
      </Router>
*/
ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>

      <Router history={history}>
        <Route path="/" component={Wrapper}>
          <IndexRoute component={Home} />
          <Route path="folders" component={Folders} />
          <Route path="folders/*" component={Folders} />
          <Route path="about" component={About} />
        </Route>
      </Router>

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)