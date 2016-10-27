export const TYPES = {
  folder:{
    title:'Folder',
    fields:[{
      name:'name'
    }],
    initialData:{
      
    }
  },
  item:{
    title:'Item',
    fields:[{
      name:'name'
    },{
      name:'comment'
    }],
    initialData:{
      
    }
  }
}

export const TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]

export const LIBRARY = {}