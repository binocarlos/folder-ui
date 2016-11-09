const DEFAULT_TYPES = {
  folder:{
    id:'folder',
    title:'Folder',
    fields:[{
      name:'name'
    }],
    initialData:{
      type:'folder'
    }
  },
  item:{
    id:'item',
    title:'Item',
    leaf:true,
    fields:[{
      name:'name'
    },{
      name:'comment'
    }],
    initialData:{
      type:'item'
    }
  }
}

const DEFAULT_TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]

const DEFAULT_LIBRARY = {}

const REQUIRED_OPTIONS = [
  'name',
  'path',
  'db'
]

const factory = (opts = {}) => {

  opts = Object.assign({}, {
    width:250,
    types:DEFAULT_TYPES,
    tableFields:DEFAULT_TABLE_FIELDS,
    library:DEFAULT_LIBRARY,
    childrenToolbar:{},
    formToolbar:{}
  }, opts)

  REQUIRED_OPTIONS.forEach((name) => {
    if(!opts[name]) throw new Error(name + ' option required')
  })

  return opts
}

export default factory