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
import { serialize } from '../tools'

// inject a key that represents what database this item came from
// this lets us save it back to the same place and allows us to combine
// multiple data sources into one tree
const CODEC_KEY = '_folderui_dbname'
const CODEC_DELIMITER = '_'

const extractCodecFromId = (id) => {
  let idParts = id.split(CODEC_DELIMITER)
  return idParts.shift()
}

const decodeID = (id) => {
  let idParts = id.split(CODEC_DELIMITER)
  idParts.shift()
  return idParts.join(CODEC_DELIMITER)
}

// reducer -> database
const decode = (item) => {
  if(!item) return item
  if(typeof(item) == 'string') {
    return item.split(CODEC_DELIMITER)[1]
  }
  // we must serialize here because this data cannot be mutated
  // because there are memory pointers into reducer state
  item = serialize(item)
  delete(item[CODEC_KEY])
  if(item.id){
    item.id = decodeID(item.id)  
  }
  return item
}

const codecFactory = (database) => {

  const encodeID = (id) => {
    return database.id + CODEC_DELIMITER + id
  }

  // tells you if this is the root node
  const isRootID = (id) => {
    return id == encodeID(database.id)
  }

  // database -> reducer
  const encode = (item) => {
    if(!item) return item
    item[CODEC_KEY] = database.id
    item.id = encodeID(item.id)
    item.children = (item.children || []).map((child) => {
      return encode(child)
    })
    return item
  }

  const rootNodeFactory = (extra = {}) => {
    return Object.assign({}, database.rootNode, {
      id:database.id
    }, extra)
  }
  // this is loadTree but we return a single node that
  // the async.parallel maps onto the root data array
  const getRootNode = (done) => {
    database.db.loadTree((err, data) => {
      if(err) return done(err)
      const rootNode = rootNodeFactory({
        children:data || []
      })
      done(null, encode(rootNode))
    })
  }

  const saveItem = (item, done) => {
    database.db.saveItem(decode(item), (err, data) => {
      if(err) return done(err)
      done(null, encode(data))
    })
  }

  const addItem = (parent, item, done) => {
    // the actual database gets passed null as the parent
    // if it's a root node
    parent = isRootID(parent.id) ? null : parent
    database.db.addItem(decode(parent), decode(item), (err, data) => {
      if(err) return done(err)
      done(null, encode(data))
    })
  }

  const pasteItems = (mode, parent, items, done) => {
    parent = isRootID(parent.id) ? null : parent
    database.db.pasteItems(mode, decode(parent), items.map(decode), done)
  }

  const deleteItem = (id, done) => {
    database.db.deleteItem(decodeID(id), done)
  }

  const loadItem = (id, done) => {
    id = isRootID(id) ? null : id

    if(isRootID(id)){
      done(null, encode(rootNodeFactory()))
    }
    else{
      database.db.loadItem(decodeID(id), (err, data) => {
        if(err) return done(err)
        done(null, encode(data))
      })
    }
    
  }

  const loadChildren = (id, done) => {
    id = isRootID(id) ? null : id
    database.db.loadChildren(decode(id), (err, data = []) => {
      if(err) return done(err)
      done(null, data.map(encode))
    })
  }

  return {
    id:database.id,
    database,
    encode,
    decode,
    getRootNode,
    saveItem,
    addItem,
    pasteItems,
    deleteItem,
    loadItem,
    loadChildren
  }
}

export default function compositedb(databases = []){

  // map database name onto codec for it
  // (the codec contains a ref to the original db for storage)
  const codecs = {}
  databases.forEach((database) => {
    codecs[database.id] = codecFactory(database)
  })

  const getItemCodecId = (item) => {
    return typeof(item) == 'string' ?
      extractCodecFromId(item) :
      item[CODEC_KEY]
  }
  // use the encoded field to find out what database
  // originated the given item
  const getItemCodec = (item) => {
    return codecs[getItemCodecId(item)]
  }

  return {
    saveItem:(item, done) => {
      const codec = getItemCodec(item)
      if(!codec) return done('no codec found for: ' + getItemCodecId(item))
      codec.saveItem(item, done)
    },
    addItem:(parent, item, done) => {
      const codec = getItemCodec(parent)
      if(!codec) return done('no codec found for: ' + getItemCodecId(parent))
      codec.addItem(parent, item, done)
    },
    pasteItems:(mode, parent, items, done) => {
      const codec = getItemCodec(parent)
      if(!codec) return done('no codec found for: ' + getItemCodecId(parent))
      codec.pasteItems(mode, parent, items, done)
    },
    deleteItem:(id, done) => {
      const codec = getItemCodec(id)
      if(!codec) return done('no codec found for: ' + getItemCodecId(id))
      codec.deleteItem(id, done)
    },
    loadItem:(id, done) => {
      const codec = getItemCodec(id)
      if(!codec) return done('no codec found for: ' + getItemCodecId(id))
      codec.loadItem(id, done)
    },
    loadChildren:(id, done) => {
      const codec = getItemCodec(id)
      if(!codec) return done('no codec found for: ' + getItemCodecId(id))
      codec.loadChildren(id, done)
    },
    loadTree:(done) => {
      // load each of the databases answers
      // then filter each node with a tag for that db
      async.parallel(databases.map((database) => {
        return (next) => {
          const codec = codecs[database.id]
          codec.getRootNode(next)
        }
      }), done)

    }
  }
}