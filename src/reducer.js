import update from 'react/lib/update'
import {
  FOLDERUI_TREE_DATA_LOADED,
  FOLDERUI_TREE_DATA_ERROR,
  FOLDERUI_TABLE_DATA_LOADED,
  FOLDERUI_TABLE_DATA_ERROR,
  FOLDERUI_TREE_SELECT_NODE,
  FOLDERUI_TABLE_SELECT_NODES,
  FOLDERUI_EDIT_ITEM,
  FOLDERUI_OPEN_ITEM,
  FOLDERUI_EDIT_ITEM_UPDATE,
  FOLDERUI_EDIT_ITEM_CANCEL,
  FOLDERUI_EDIT_ITEM_SAVE,
  FOLDERUI_EDIT_ITEM_REVERT,
  FOLDERUI_SNACKBAR_OPEN,
  FOLDERUI_SNACKBAR_CLOSE
} from './actions'
import { processTreeData, processListData, getChildren } from './tools'

const treedata = processTreeData([])
const DEFAULT_STATE = {
  // * data - id -> {}
  // * children - id -> [id]
  // * rootids - [id]
  tree:null,
  treeselected:null,
  // * data - id -> {}
  // * table - [id]
  table:null,
  // the item we are currently editing
  editing:null,
  // the snackbar
  snackbar:{
    open:false,
    message:''
  }
}

function selectItem(state, selectedNode){
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
      $set: processListData(getChildren(state.tree, selectedNode.id))
    },
    editing:{
      $set: null
    }
  })
}

export default function folderuireducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {

    // clicked a node in the tree
    case FOLDERUI_TREE_DATA_LOADED:

      var treeData = processTreeData(action.data)
      var selected = treeData.data[treeData.rootids[0]]

      return update(state, {
        tree:{
          $set:treeData
        },
        treeselected:{
          $set: selected
        },
      })

    // clicked a node in the tree
    case FOLDERUI_TREE_SELECT_NODE:

      var selectedNode = action.data

      return selectItem(state, selectedNode)

    case FOLDERUI_OPEN_ITEM:

      var selectedNode = action.item

      // this means we have opened something not in the tree
      if(!state.tree.data[selectedNode.id]) return state

      return selectItem(state, selectedNode)
      
    // selected some items in the table
    case FOLDERUI_TABLE_SELECT_NODES:
      var selectedmap = {}
      action.data.forEach(i => {
        selectedmap[state.table.list[i]] = true
      })
      return update(state, {
        table:{
          data:{
            $apply: function(table){
              var ret = {}
              Object.keys(table || {}).forEach(function(key){
                var row = table[key]
                ret[row.id] = update(row, {
                  _selected:{
                    $set: selectedmap[row.id]
                  }
                })         
              })
              return ret
            }
          }
        }
      })

    // edit an item
    case FOLDERUI_EDIT_ITEM:
      return update(state, {
        editing:{
          $set: {
            data:action.item,
            original:action.item,
            meta:{}
          }
        }
      })
    case FOLDERUI_EDIT_ITEM_UPDATE:
      return update(state, {
        editing:{
          data:{
            $set:action.data
          },
          meta:{
            $set:action.meta
          }
        }
      })
    case FOLDERUI_EDIT_ITEM_REVERT:
      return update(state, {
        editing:{
          data:{
            $set:state.editing.original
          },
          meta:{
            $set:{}
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
        tree:{
          data:{
            [action.item.id]:{
              $merge:action.item
            }
          }
        },
        table:{
          data:{
            [action.item.id]:{
              $merge:action.item
            }
          }
        },
        editing:{
          $set: null
        }
      })
    case FOLDERUI_SNACKBAR_OPEN:
      return update(state, {
        snackbar:{
          open:{
            $set:true
          },
          message:{
            $set:action.message
          }
        }
      })
    case FOLDERUI_SNACKBAR_CLOSE:
      return update(state, {
        snackbar:{
          open:{
            $set:false
          },
          message:{
            $set:''
          }
        }
      })
    default:
      return state
  }
}