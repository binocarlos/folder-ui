import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { TreeContainer } from './TreeContainer'
import treereducer from './reducer'

const TREE_DATA = {
  id:'123',
  name:'My Tree',
  children:[{
    id:'456',
    name:'Folder A',
    children:[]
  },{
    id:'457',
    name:'Folder B',
    children:[{
      id:'459',
      name:'Sub Folder B1'
    }]
  },{
    id:'458',
    name:'Folder C',
    children:[]
  }]
}

const reducer = combineReducers({
  tree: treereducer
})

const finalCreateStore = compose(
  applyMiddleware(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const store = finalCreateStore(reducer)

injectTapEventPlugin()

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>
      <TreeContainer 
        data={TREE_DATA}
      />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)