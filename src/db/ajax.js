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

  const urls = Object.assign({}, DEFAULT_URLS, opts.urls)
  const filters = Object.assign({}, opts.filters)

  const filterData = (type, data) => {
    return filters[type] ? filters[type](data) : data
  }

  return {
    loadTree:(done) => {
      superagent
        .get(urls.loadTree(opts.base))
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
    loadChildren:(id, done) => {
      superagent
        .get(urls.loadChildren(opts.base, id))
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
    loadItem:(id, done) => {
      superagent
        .get(urls.loadItem(opts.base, id))
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
    addItem:(parent, item, done) => {
      item = filterData('addItem', item)
      superagent
        .post(urls.addItem(opts.base, parent ? parent.id : null))
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
    saveItem:(item, done) => {
      const id = item.id
      const data = filterData('saveItem', item)
      superagent
        .put(urls.saveItem(opts.base, id))
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
    
    deleteItem:(id, done) => {
      superagent
        .delete(urls.deleteItem(opts.base, id))
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

    pasteItems:(mode, parent, items, done) => {
      const data = filterData('pasteItems', items)
      superagent
        .post(urls.pasteItems(opts.base, parent ? parent.id : null))
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