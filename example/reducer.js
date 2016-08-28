import { 
  FOLDERUI_TREE_SELECT_NODE,
  FOLDERUI_TABLE_SELECT_NODES,
  FOLDERUI_EDIT_ITEM,
  FOLDERUI_EDIT_ITEM_CANCEL,
  FOLDERUI_EDIT_ITEM_SAVE
} from './actions'
import update from 'react/lib/update'
import { processTreeData, processTableData, getChildren } from '../src/tools'

const ROOT_DATA = [{
  id:0,
  name:'My Folders',
  open:true,
  children:[{
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
}]

const DEFAULT_STATE = {
  // * data - id -> {}
  // * children - id -> [id]
  // * rootids - [id]
  tree:processTreeData(ROOT_DATA),
  treeselected:ROOT_DATA[0],
  // * data - id -> {}
  // * table - [id]
  table:ROOT_DATA[0].children,
  tableselected:[],
  // the item we are currently editing
  editing:null,
}

export default function folderuireducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {

    // clicked a node in the tree
    case FOLDERUI_TREE_SELECT_NODE:

      var selectedNode = action.data

      return update(state, {
        tree:{
          data:{
            [selectedNode.id]:{
              $merge: {
                open: true

              }
            }
          }
        },
        treeselected:{
          $set: state.tree.data[selectedNode.id]
        },
        // this needs to be split out into an async api request
        table:{
          $set: getChildren(state.tree, selectedNode.id)
        },
        tableselected:{
          $set:[]
        }
      })

    // selected some items in the table
    case FOLDERUI_TABLE_SELECT_NODES:
      return update(state, {
        tableselected2:{
          $set: JSON.parse(JSON.stringify(action.data))
        }
      })

    // edit an item
    case FOLDERUI_EDIT_ITEM:
      return update(state, {
        editing:{
          $set: {
            data:action.item,
            meta:{}
          }
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