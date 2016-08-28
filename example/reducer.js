import { 
  FOLDERUI_TREE_SELECT_NODE,
  FOLDERUI_TABLE_SELECT_NODES,
  FOLDERUI_EDIT_ITEM,
  FOLDERUI_EDIT_ITEM_CANCEL,
  FOLDERUI_EDIT_ITEM_SAVE
} from './actions'
import update from 'react/lib/update'
import { processTreeData, getChildren } from '../src/tools'

const DEFAULT_DATA = [{
  id:1,
  name:'Folder A',
  children:[]
},{
  name:'Folder B',
  id:2,
  children:[{
    name:'Sub Folder B1',
    id:3,
    children:[{
      name:'Sub Folder C1',
      id:25
    },{
      name:'Sub Folder C2',
      id:26
    }]
  },{
    name:'Sub Folder B2',
    id:24
  }]
},{
  name:'Folder C',
  id:4,
  children:[]
},{
  name:'Folder C1',
  id:5,
  children:[]
},{
  name:'Folder C2',
  id:6,
  children:[]
},{
  name:'Folder C3',
  id:7,
  children:[]
},{
  name:'Folder C4',
  id:8,
  children:[]
},{
  name:'Folder C5',
  id:9,
  children:[]
},{
  name:'Folder C6',
  id:10,
  children:[]
},{
  name:'Folder C7',
  id:11,
  children:[]
},{
  name:'Folder C8',
  id:12,
  children:[]
},{
  name:'Folder C9',
  id:13,
  children:[]
},{
  name:'Folder C10',
  id:14,
  children:[]
},{
  name:'Folder C11',
  id:15,
  children:[]
},{
  name:'Folder C12',
  id:16,
  children:[]
},{
  name:'Folder C13',
  id:17,
  children:[]
},{
  name:'Folder C14',
  id:18,
  children:[]
},{
  name:'Folder C15',
  id:19,
  children:[]
},{
  name:'Folder C16',
  id:20,
  children:[]
},{
  name:'Folder C17',
  id:21,
  children:[]
},{
  name:'Folder C18',
  id:22,
  children:[]
},{
  name:'Folder C19',
  id:23,
  children:[]
}]

const ROOT_DATA = [{
  name:'My Folders',
  open:true,
  children:DEFAULT_DATA
}]

const DEFAULT_STATE = {
  // * data - id -> {}
  // * children - id -> [id]
  // * rootids - [id]
  tree:processTreeData(ROOT_DATA),
  table:DEFAULT_DATA,
  treeselected:ROOT_DATA[0],
  tableselected:[],
  // the item we are currently editing
  editing:null,
  viewtitle:ROOT_DATA[0].name,
  contentmode:'children'
}

export default function treereducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case FOLDERUI_TREE_SELECT_NODE:
      var newNode = update(action.data, {
        open:{
          $set: true
        }
      })

      var newTree = update(state.tree, {
        data:{
          [newNode.id]:{
            $set: newNode
          }
        }
      })

      var children = getChildren(newTree, newNode.id)

      return update(state, {
        treeselected:{
          $set: newNode
        },
        table:{
          $set: children
        },
        tree:{
          $set: newTree
        },
        viewtitle:{
          $set: newNode.name
        },
        tableselected:{
          $set: []
        }
      })
    case FOLDERUI_TABLE_SELECT_NODES:
      var selected = action.data.map(id => {
        return state.tree.data[id]
      })
      var viewtitle = ''
      if(selected.length<=0){
        viewtitle = state.treeselected.name
      }
      else if(selected.length==1){
        viewtitle = selected[0].name
      }
      else{
        viewtitle = selected.length + ' item' + (selected.length==1 ? '' : 's')
      }
      return update(state, {
        tableselected:{
          $set: selected
        },
        viewtitle:{
          $set: viewtitle
        }
      })
    case FOLDERUI_EDIT_ITEM:
      return update(state, {
        editing:{
          $set: action.item
        }
      })
    case FOLDERUI_EDIT_ITEM_CANCEL:
      return update(state, {
        editing:{
          $set: null
        }
      })
    case FOLDERUI_EDIT_ITEM_SAVE:
      return update(state, {
        editing:{
          $set: null
        }
      })
    default:
      return state
  }
}