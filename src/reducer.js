import update from 'react/lib/update'
import {
  FOLDERUI_TREE_DATA_LOADED,
  FOLDERUI_TABLE_DATA_LOADED,
  FOLDERUI_TREE_SELECT_NODE,
  FOLDERUI_TREE_TOGGLE,
  FOLDERUI_TABLE_SELECT_NODES,
  FOLDERUI_CUT_ITEMS,
  FOLDERUI_COPY_ITEMS,
  FOLDERUI_PASTE_ITEMS,
  FOLDERUI_EDIT_ITEM,
  FOLDERUI_ADD_ITEM,
  FOLDERUI_ADD_ITEM_SAVE,
  FOLDERUI_EDIT_ITEM_UPDATE,
  FOLDERUI_EDIT_ITEM_CANCEL,
  FOLDERUI_EDIT_ITEM_SAVE,
  FOLDERUI_EDIT_ITEM_REVERT,
  FOLDERUI_SNACKBAR_OPEN,
  FOLDERUI_SNACKBAR_CLOSE,
  FOLDERUI_DIALOG_OPEN,
  FOLDERUI_DIALOG_CONFIRM,
  FOLDERUI_DIALOG_CLOSE
} from './actions'
import { processTreeData, processListData, getChildren, getAncestors } from './tools'

const treedata = processTreeData([])
const DEFAULT_STATE = {
  // * data - id -> {}
  // * children - id -> [id]
  // * rootids - [id]
  tree:null,
  treeselected:null,
  treeopen:{},
  // * data - id -> {}
  // * table - [id]
  table:null,
  // * [{id:X,type:'{cut,copy}'}]
  clipboard:{
    items:[],
    mode:null
  },
  // the item we are currently editing
  editing:null,
  // if set it means we are adding an item
  addparent:null,
  // the snackbar
  snackbar:{
    open:false,
    message:''
  },
  dialog:{
    open:false,
    message:'',
    data:null
  }
}

function selectItem(state, selectedNode){
  return update(state, {
    treeopen:{
      $apply:(treeopen) => {
        let useTreeOpen = JSON.parse(JSON.stringify(treeopen))
        let ancestors = getAncestors(state.tree, selectedNode.id)

        useTreeOpen[selectedNode.id] = true
        ancestors.forEach(ancestor => {
          useTreeOpen[ancestor.id] = true
        })

        return useTreeOpen
      }
    },
    treeselected:{
      $set: state.tree.data[selectedNode.id]
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

      let treeData = processTreeData(action.data)
      let selected = treeData.data[treeData.rootids[0]]

      return update(state, {
        tree:{
          $set:treeData
        },
        treeselected:{
          $set: selected
        },
        editing:{
          $set: null
        }
      })

    case FOLDERUI_TABLE_DATA_LOADED:

      let tableData = processListData(action.data)

      return update(state, {
        table:{
          $set:tableData
        },
        editing:{
          $set: null
        }
      })

    // clicked a node in the tree
    case FOLDERUI_TREE_SELECT_NODE:

      let selectedNode = action.data

      // this means we have opened something not in the tree
      if(!state.tree.data[selectedNode.id]) return state

      return selectItem(state, selectedNode)
    
    case FOLDERUI_TREE_TOGGLE:

      let existingMode = state.treeopen[action.id] ? true : false

      return update(state, {
        treeopen:{
          [action.id]:{
            $set:!existingMode
          }
        }
      })

    // selected some items in the table
    case FOLDERUI_TABLE_SELECT_NODES:
      let selectedmap = {}
      action.data.forEach(i => {
        selectedmap[state.table.list[i]] = true
      })
      var newData = JSON.parse(JSON.stringify(state.table.data))
      Object.keys(newData || {}).forEach(function(key){
        newData[key]._selected = selectedmap[key] ? true : false
      })
      return update(state, {
        table:{
          data:{
            $set: newData
          }
        }
      })

    case FOLDERUI_CUT_ITEMS:
      return update(state, {
        clipboard:{
          $set:{
            items:action.items,
            type:'cut'
          }
        }
      })

    case FOLDERUI_COPY_ITEMS:
      return update(state, {
        clipboard:{
          $set:{
            items:action.items,
            type:'copy'
          }
        }
      })

    case FOLDERUI_PASTE_ITEMS:
      return update(state, {
        clipboard:{
          $set:{
            items:[],
            type:null
          }
        }
      })

    case FOLDERUI_ADD_ITEM:
      return update(state, {
        addparent:{
          $set:action.parent
        },
        editing:{
          $set: {
            data:action.item,
            original:action.item,
            meta:{}
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
        addparent:{
          $set:null
        },
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
        addparent:{
          $set:null
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
    case FOLDERUI_DIALOG_OPEN:
      return update(state, {
        dialog:{
          $set:{
            open:true,
            message:action.message,
            data:action.data
          }
        }
      })
    case FOLDERUI_DIALOG_CLOSE:
      return update(state, {
        dialog:{
          $set:{
            open:false,
            message:null,
            data:null
          }
        }
      })
    default:
      return state
  }
}