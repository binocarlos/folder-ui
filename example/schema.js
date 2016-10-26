export const PRODUCT_TYPES = {
  folder:{
    title:'Folder',
    fields:[{
      name:'name'
    }]
  },
  item:{
    title:'Item',
    fields:[{
      name:'name'
    },{
      name:'comment'
    }]
  }
}

export const PRODUCT_TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]