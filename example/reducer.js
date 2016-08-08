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
},{
  name:'Folder C1',
  children:[]
},{
  name:'Folder C2',
  children:[]
},{
  name:'Folder C3',
  children:[]
},{
  name:'Folder C4',
  children:[]
},{
  name:'Folder C5',
  children:[]
},{
  name:'Folder C6',
  children:[]
},{
  name:'Folder C7',
  children:[]
},{
  name:'Folder C8',
  children:[]
},{
  name:'Folder C9',
  children:[]
},{
  name:'Folder C10',
  children:[]
},{
  name:'Folder C11',
  children:[]
},{
  name:'Folder C12',
  children:[]
},{
  name:'Folder C13',
  children:[]
},{
  name:'Folder C14',
  children:[]
},{
  name:'Folder C15',
  children:[]
},{
  name:'Folder C16',
  children:[]
},{
  name:'Folder C17',
  children:[]
},{
  name:'Folder C18',
  children:[]
},{
  name:'Folder C19',
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