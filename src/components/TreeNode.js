import React, { PropTypes, Component } from 'react'

const DEFAULT_OFFSET_STYLE = {
  paddingLeft:'20px'
}

class TreeNode extends Component {
  
  render() {

    var children = this.props.data.children || []
    var expandLink = (this.props.isroot || children.length<=0) ? null : (
      <span>+</span>
    )

    var use_offset_style = this.props.offset_style || DEFAULT_OFFSET_STYLE

    var wrapperStyle = this.props.isroot ? null : use_offset_style

    return (
      <div style={wrapperStyle}>
        {expandLink} {this.props.data.name}
        <div>
        {
          children.map((child, i) => {
            return (
              <TreeNode
                key={i}
                offset_style={this.props.offset_style}
                data={child} />
            )
          })
        }
        </div>
      </div>
    )
  }

}

export default TreeNode