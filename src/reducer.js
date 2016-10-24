const INITIAL_STATE = {
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

const ReducerFactory = (settings = {}) => {

  if(typeof(settings)==='string') settings = {
    name:settings
  }

  if(!settings.name) throw new Error('ReducerFactory requires a name')

  // filter out actions meant for other reducers
  const filterAction = (action) => {
    return action._filter == settings.name
  }

  return (state = INITIAL_STATE, action = {}) => {
    if(!filterAction(action)) return state
    return state
  }
}

export default ReducerFactory