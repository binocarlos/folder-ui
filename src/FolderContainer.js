import React, { Component, PropTypes } from 'react'


import NavWrapper from 'kettle-ui/lib/NavWrapper'

import TreeContainer from '../src/TreeContainer'
import ContentContainer from '../src/ContentContainer'

class FolderContainer extends Component {

  updateView(data = {}){
    let currentPath = (this.props.path || '').replace(/\/?\*?$/g, '')
    let parts = ['']

    if(currentPath) parts.push(currentPath)
    parts.push(data.id, data.view)

    if(data.subid){
      parts.push(data.subid)
    }
    this.props.updateRoute(parts.join('/').replace('//', '/'))
  }

  render() {

    let urlParts = (this.props.splat || '').split('/')

    let currentView = urlParts[0] ? {
      id:urlParts[0],
      view:urlParts[1] || 'children',
      subid:urlParts[2]
    } : null

    return (
      <NavWrapper
        width={this.props.width}
        paperprops={{
          zDepth:1,
          rounded:false
        }}
        navbar={
          <TreeContainer 
            loadTreeDB={this.props.db.loadTree}
            loadChildrenDB={this.props.db.loadChildren}
            loadItemDB={this.props.db.loadItem}
            updateView={this.updateView.bind(this)}
            currentView={currentView} />
        }>
        
        <ContentContainer 
          loadChildrenDB={this.props.db.loadChildren}
          loadTreeDB={this.props.db.loadTree}
          getSchema={this.props.getSchema}
          saveItemDB={this.props.db.saveItem}
          loadItemDB={this.props.db.loadItem}
          addItemDB={this.props.db.addItem}
          deleteItemsDB={this.props.db.deleteItems}
          pasteItemsDB={this.props.db.pasteItems}
          updateView={this.updateView.bind(this)}
          currentView={currentView}
          offsetWidth={this.props.width} />
        
      </NavWrapper>
    )
  }

}

export default FolderContainer