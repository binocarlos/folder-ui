/*

  a combination of databases into one tree

  each database has a 'root' node that is a ghost
  we record the '_folderui_rootnode' as a property of every object

  const db = compositeDB({
    dbs:[{
      node:{
        id:'db1',
        name:'My DB 1'
      },
      db:DB1()
    },{
      node:{
        id:'db2',
        name:'My DB 2'
      },
      db:DB2()
    }]
  })
  
*/

import async from 'async'

// inject a key that represents what database this item came from
// this lets us save it back to the same place and allows us to combine
// multiple data sources into one tree
const nodeProcessor = (dbname) => {
  const processNode = (node) => {
    node._folderui_dbname = dbname
    node.children = (node.children || []).map((child) => {
      return processNode(child)
    })
    return node
  }
  return processNode
}

export default function compositedb(databases = []){

  return {
    saveItem:(item, done) => {
      
    },
    addItem:(parent, item, done) => {
      
      // add item
      console.log('add item')
    },
    pasteItems:(mode, parent, items, done) => {
      
    },
    deleteItem:(id, done) => {
      
    },
    loadItem:(id, done) => {
      
    },
    loadChildren:(id, done) => {
      
    },
    loadTree:(done) => {
      // load each of the databases answers
      // then filter each node with a tag for that db
      async.parallel(databases.map((database) => {
        const id = database.node.id
        const processor = nodeProcessor(id)
        return (next) => {
          database.db.loadTree((err, data) => {
            if(err) return next(err)
            const rootNode = Object.assign({}, database.node, {
              children:data
            })
            next(null, processor(rootNode))
          })
        }
      }), done)

    }
  }
}