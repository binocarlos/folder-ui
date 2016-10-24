export const FOLDERUI_TREE_DATA_LOADED = 'FOLDERUI_TREE_DATA_LOADED'

export function tree_data_loaded(data) {
  return {
    type: FOLDERUI_TREE_DATA_LOADED,
    data
  }
}

export const FOLDERUI_TREE_DATA_ERROR = 'FOLDERUI_TREE_DATA_ERROR'

export function tree_data_error(error) {
  return {
    type: FOLDERUI_TREE_DATA_ERROR,
    error
  }
}

const ActionFactory = (name, db) => {

  if(!name || !db) throw new Error('ActionFactory requires a name and db')

  // the reducer will use this to filter actions not for it
  const processAction = (action) => {
    action._filter = name
    return action
  }
  
  return {
    name,
    // return the correct part of the state tree based on the 'name'
    getState:(state) => {
      return state[name]
    },

    // request the tree data
    requestTreeData:() => {
      return (dispatch, getState) => {
        db.loadTree((err, data) => {
          if(err) return dispatch(tree_data_error(err))
          dispatch(tree_data_loaded(data))
        })
      }
    }
  }
}

export default ActionFactory