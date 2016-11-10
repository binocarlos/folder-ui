/*

  an ajax database client that uses the 'crud' urls
  
*/

import Ajax from './ajax'
import urls from './urls'

export default function crudDB(opts = {}){

  const db = Ajax(Object.assign({}, opts, {
    urls:urls.crud
  }))

  /*
  
    encode the data ready for folder-ui
    
  */
  const encode = (data) => {
    return opts.encode ?
      opts.encode(data) :
      data
  }

  /*
  
    decode the data back ready for the database
    
  */
  const decode = (data) => {
    return opts.decode ?
      opts.decode(data) :
      data
  }

  return {
    loadTree:(context, done) => {
      done('crud db has no loadTree')
    },
    loadDeepChildren:(context, id, done) => {
      done('crud db has no loadDeepChildren')
    },
    loadChildren:(context, id, done) => {
      db.loadChildren(context, id, (err, data = []) => {
        if(err) return done(err)
        done(null, data.map(encode))
      })
    },
    loadItem:(context, id, done) => {
      db.loadItem(context, id, (err, data = {}) => {
        if(err) return done(err)
        done(null, encode(data))
      })
    },
    addItem:(context, parent, item, done) => {
      db.addItem(context, parent, decode(Object.assign({}, item)), done)
    },
    saveItem:(context, id, data, done) => {
      db.saveItem(context, id, decode(Object.assign({}, data)), done)
    },
    deleteItem:(context, id, done) => {
      db.deleteItem(context, id, done)
    }
  }
}