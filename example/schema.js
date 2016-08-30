const TYPES = {
  folder:[{
    name:'name'
  }],
  item:[{
    name:'name'
  },{
    name:'comment'
  }]
}

export function get_schema(item){
  var type = item.type || 'folder'
  return TYPES[type]
}