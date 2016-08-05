import React, { PropTypes, Component } from 'react'
import TreeNode from './TreeNode'

class TreeViewer extends Component {
  
  render() {
    return (
      <TreeNode
        isroot={true}
        offset_style={this.props.offset_style}
        expandstate={this.props.expandstate}
        update_expandstate={this.props.update_expandstate}
        data={this.props.data} />
    )
  }

}

export default TreeViewer