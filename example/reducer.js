import { 
  FOLDERUI_TREE_SELECT_NODE,
  FOLDERUI_TABLE_SELECT_NODES,
  FOLDERUI_EDIT_ITEM,
  FOLDERUI_EDIT_ITEM_UPDATE,
  FOLDERUI_EDIT_ITEM_CANCEL,
  FOLDERUI_EDIT_ITEM_SAVE,
  FOLDERUI_EDIT_ITEM_REVERT
} from './actions'
import update from 'react/lib/update'
import { processTreeData, processListData, getChildren } from '../src/tools'

import { ROOT_DATA } from './fixtures'

const treedata = processTreeData(ROOT_DATA)
const DEFAULT_STATE = {
  // * data - id -> {}
  // * children - id -> [id]
  // * rootids - [id]
  tree:treedata,
  treeselected:treedata.data[0],
  // * data - id -> {}
  // * table - [id]
  table:processListData(getChildren(treedata, 0)),
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
          $set: processListData(getChildren(state.tree, selectedNode.id))
        },
        editing:{
          $set: null
        }
      })

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
    default:
      return state
  }
}