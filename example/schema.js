const TYPES = {
  folder:[{
    name:'name'
  },{
    name:'name2'
  },{
    name:'name3'
  },{
    name:'name4'
  },{
    name:'name5'
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