export const PRODUCT_TYPES = {
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

export const PRODUCT_TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]