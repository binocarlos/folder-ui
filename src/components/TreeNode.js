import React, { PropTypes, Component } from 'react'
import hat from 'hat'
import update from 'react/lib/update'

const DEFAULT_OFFSET_STYLE = {
  paddingLeft:'20px'
}

const styles = {
  toggleLink:{
    textDecoration:'none'
  }
}

class TreeNode extends Component {

  render() {

    var self = this

    var id = this.props.data.id
    var expanded = this.props.isroot || this.props.expandstate[id] ? true : false
    var children = expanded ? (this.props.data.children || []) : []

    var expandsymbol = expanded ? '-' : '+'
    function toggleExpaded(){
      var newexpandvalue = expanded ? false : true
      var newexpandstate = update(self.props.expandstate, {
        $set: {
          [id]: newexpandvalue
        }
      })

      self.props.update_expandstate(newexpandstate)
    }
    var expandLink = (this.props.isroot || (this.props.data.children || []).length<=0) ? null : (
      <a href="javascript:void(0);" onClick={toggleExpaded} style={styles.toggleLink}>
        <span>{expandsymbol}</span>
      </a>
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
                expandstate={this.props.expandstate}
                update_expandstate={this.props.update_expandstate}
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