/*

  a database implementation that uses ajax
  to speak to a remote REST API
  
*/

import superagent from 'superagent'

const DEFAULT_URLS = {
  loadTree:(base) => {
    return base + '/tree'
  },
  addItem:(base, id) => {
    return base + '/add/:id'
  }
}

export default function ajaxdb(opts = {}){

  const urls = Object.assign({}, DEFAULT_URLS, opts.urls)

  return {
    saveItem:(item, done) => {
      
    },
    addItem:(parent, item, done) => {
      superagent
        .post(urls.addItem(opts.base, parent))
        .send(JSON.stringify(item))
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(res.status<500){
            done && done(res.body)
          }
          else{
            done && done(null, res.body)
          }
        })
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
      superagent
        .get(urls.loadTree(opts.base))
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