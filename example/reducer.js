import { TREE_SELECT_NODE } from './actions'
import update from 'react/lib/update'

const DEFAULT_TREE_DATA = [{
  name:'Folder A',
  children:[]
},{
  name:'Folder B',
  children:[{
    name:'Sub Folder B1'
  }]
},{
  name:'Folder C',
  children:[]
}]

const DEFAULT_STATE = {
  data:DEFAULT_TREE_DATA,
  selected:null
}

export default function treereducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case TREE_SELECT_NODE:
      return update(state, {
        selected:{
          $set: action.data
        }
      })
    default:
      return state
  }
}