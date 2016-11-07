/*

  a database implementation that uses ajax
  to speak to a remote REST API
  
*/

import superagent from 'superagent'

const getUrl = (base, path, id) => {
  return base + path + (id ? '/' + id : '')
}
const itemUrl = (base, id) => {
  return getUrl(base, '/item', id)
}
const DEFAULT_URLS = {
  loadTree:(base) => {
    return getUrl(base, '/tree')
  },
  loadChildren:(base, id) => {
    return getUrl(base, '/children', id)
  },
  pasteItems:(base, id) => {
    return getUrl(base, '/paste', id)
  },
  loadItem:itemUrl,
  addItem:itemUrl,
  saveItem:itemUrl,
  deleteItem:itemUrl
}

export default function ajaxdb(opts = {}){

  if(!opts.baseurl || (typeof(opts.baseurl) != 'function' && typeof(opts.baseurl) != 'string')){
    throw new Error('ajax db requires a baseurl that is a function or string')
  }

  const urls = Object.assign({}, DEFAULT_URLS, opts.urls)
  const filters = Object.assign({}, opts.filters)

  /*
  
    pre and post filters passed in
    
  */
  const filterData = (type, data) => {
    return filters[type] ? filters[type](data) : data
  }

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
        .get(urls.loadTree(getBaseUrl(context)))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, filterData('loadTree', res.body))
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
            done && done(null, filterData('loadChildren', res.body))
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
            done && done(null, filterData('loadItem', res.body))
          }
        })
    },
    addItem:(context, parent, item, done) => {
      item = filterData('addItem', item)
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
    saveItem:(context, item, done) => {
      const id = item.id
      const data = filterData('saveItem', item)
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

    pasteItems:(context, mode, parent, items, done) => {
      const data = filterData('pasteItems', items)
      superagent
        .post(urls.pasteItems(getBaseUrl(context), parent ? parent.id : null))
        .send(JSON.stringify({
          mode:mode,
          data:data
        }))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status>=400){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
    }
    
  }
}