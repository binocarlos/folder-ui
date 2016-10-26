import update from 'react/lib/update'
import {
  FOLDERUI_TREE_DATA_LOADED,
  FOLDERUI_TREE_DATA_ERROR,
  FOLDERUI_TREE_TOGGLE
} from './actions'

const INITIAL_STATE = {
  tree:{
    db:null,
    selected:null,
    open:{},
    error:null
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

      default:
        return state
    }
  }
}

export default ReducerFactory