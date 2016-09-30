import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'

import NavWrapper from 'kettle-ui/lib/NavWrapper'

import TreeContainer from '../src/TreeContainer'
import ContentContainer from '../src/ContentContainer'

import DB from './db'
import { get_schema } from './schema'

let db = DB()

class Folders extends Component {

  updateView(data = {}){
    let currentPath = this.props.route.path.replace(/\/?\*?$/g, '')

    let parts = ['', currentPath, data.id, data.view]

    if(data.subid){
      parts.push(data.subid)
    }
    this.props.router.push(parts.join('/'))
  }

  render() {

    let urlParts = (this.props.params.splat || '').split('/')

    let currentView = urlParts[0] ? {
      id:urlParts[0],
      view:urlParts[1] || 'children',
      subid:urlParts[2]
    } : null

    return (
      <NavWrapper
        width={250}
        paperprops={{
          zDepth:1,
          rounded:false
        }}
        navbar={
          <TreeContainer 
            loadTreeDB={db.loadTree}
            loadChildrenDB={db.loadChildren}
            loadItemDB={db.loadItem}
            updateView={this.updateView.bind(this)}
            currentView={currentView}
            title="My Folders" />
        }>
        
        <ContentContainer 
          loadChildrenDB={db.loadChildren}
          loadTreeDB={db.loadTree}
          getSchema={get_schema}
          saveItemDB={db.saveItem}
          loadItemDB={db.loadItem}
          addItemDB={db.addItem}
          deleteItemsDB={db.deleteItems}
          pasteItemsDB={db.pasteItems}
          updateView={this.updateView.bind(this)}
          currentView={currentView}
          offsetWidth={250} />
        
      </NavWrapper>
    )
  }

}

export default withRouter(Folders)