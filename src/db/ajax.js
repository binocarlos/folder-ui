/*

  a database implementation that uses ajax
  to speak to a remote REST API
  
*/

import superagent from 'superagent'

export default function ajaxdb(opts = {}){

  if(!opts.baseurl || (typeof(opts.baseurl) != 'function' && typeof(opts.baseurl) != 'string')){
    throw new Error('ajax db requires a baseurl that is a function or string')
  }

  if(!opts.urls){
    throw new Error('ajax db requires a urls object')
  }

  const urls = opts.urls

  /*
  
    the baseurl option might be a function - in which case pass it the context
    
  */
  const getBaseUrl = (context) => {
    return typeof(opts.baseurl) == 'function' ?
      opts.baseurl(context) :
      opts.baseurl
  }

  return {
    loadTree:(context, done) => {
      superagent
        .get(urls.loadTree(getBaseUrl(context), context.search))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },
    loadChildren:(context, id, done) => {
      superagent
        .get(urls.loadChildren(getBaseUrl(context), id))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },
    loadDeepChildren:(context, id, done) => {
      superagent
        .get(urls.loadDeepChildren(getBaseUrl(context), id))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },
    loadItem:(context, id, done) => {
      superagent
        .get(urls.loadItem(getBaseUrl(context), id))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },
    addItem:(context, parent, item, done) => {
      if(opts.readOnly) return done('this database is readonly')
      superagent
        .post(urls.addItem(getBaseUrl(context), parent ? parent.id : null))
        .send(JSON.stringify(item))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },
    saveItem:(context, id, data, done) => {
      if(opts.readOnly) return done('this database is readonly')
      superagent
        .put(urls.saveItem(getBaseUrl(context), id))
        .send(JSON.stringify(data))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },
    
    deleteItem:(context, id, done) => {
      if(opts.readOnly) return done('this database is readonly')
      superagent
        .delete(urls.deleteItem(getBaseUrl(context), id))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    },

    filterPaste:(mode, item) => {
      return item
    }
    
  }
}