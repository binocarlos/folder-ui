import React, { PropTypes, Component } from 'react'
import TreeNode from './TreeNode'

class TreeViewer extends Component {
  
  render() {
    return (
      <TreeNode
        isroot={true}
        offset_style={this.props.offset_style}
        data={this.props.data} />
    )
  }

}

export default TreeViewer