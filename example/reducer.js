import { UPDATE_EXPANDSTATE } from './actions'

const DEFAULT_TREE_DATA = {
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

const DEFAULT_STATE = {
  data:DEFAULT_TREE_DATA,
  expandstate:{}
}

export default function treereducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case UPDATE_EXPANDSTATE:
      return Object.assign({}, state, {
        expandstate:action.data
      })
    default:
      return state
  }
}