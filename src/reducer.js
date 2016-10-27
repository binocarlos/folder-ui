import update from 'react/lib/update'
import {
  FOLDERUI_TREE_DATA_LOADED,
  FOLDERUI_TREE_DATA_ERROR,
  FOLDERUI_TREE_TOGGLE,
  FOLDERUI_TREE_SELECT,
  FOLDERUI_CHILD_DATA_LOADED,
  FOLDERUI_CHILD_DATA_ERROR,
  FOLDERUI_CHILD_DATA_SELECT,
  FOLDERUI_EDIT_UPDATE,
  FOLDERUI_EDIT_DATA_LOADED,
  FOLDERUI_EDIT_DATA_ERROR
} from './actions'

const INITIAL_STATE = {
  tree:{
    db:null,
    selected:null,
    open:{},
    error:null
  },
  // the current node being viewed
  parent:null,
  children:{
    // the current list of data in the view
    data:[],
    // selected the ids of the selected children
    selected:{}
  },
  // the current clipboard array
  clipboard:[],
  // the currently editing item
  editing:{
    data:{},
    meta:null
  }
}

const ReducerFactory = (opts = {}) => {

  if(typeof(opts)==='string') opts = {
    name:opts
  }

  if(!opts.name) throw new Error('ReducerFactory requires a name')

  // filter out actions meant for other reducers
  const filterAction = (action) => {
    return action._filter == opts.name
  }

  return (state = INITIAL_STATE, action = {}) => {
    if(!filterAction(action)) return state

    switch (action.type) {

      case FOLDERUI_TREE_DATA_LOADED:
        return update(state, {
          tree:{
            db:{
              $set:action.data
            }
          }
        })

      case FOLDERUI_TREE_TOGGLE:

        const toggleValue = !(state.tree.open[action.id] ? true : false)
        const useValue = typeof(action.open) == 'boolean' ? action.open : toggleValue

        return update(state, {
          tree:{
            open:{
              [action.id]:{
                $set: useValue
              }
            }
          }
        })

      case FOLDERUI_TREE_SELECT:

        return update(state, {
          parent:{
            $set: action.data
          }
        })

      case FOLDERUI_CHILD_DATA_LOADED:
        return update(state, {
          children:{
            data:{
              $set:action.data
            },
            selected:{
              $set:{}
            }
          }
        })

      case FOLDERUI_CHILD_DATA_SELECT:
        let ids = {}
        action.ids.forEach((id) => {
          ids[id] = true
        })
        return update(state, {
          selected:{
            $set:ids
          }
        })

      case FOLDERUI_EDIT_DATA_LOADED:
        return update(state, {
          editing:{
            data:{
              $set:action.data
            },
            meta:{
              $set:null
            }
          }
        })
        
      case FOLDERUI_EDIT_UPDATE:
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

      default:
        return state
    }
  }
}

export default ReducerFactory