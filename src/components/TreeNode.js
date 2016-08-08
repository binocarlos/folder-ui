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
    var meta = this.props.meta || {}
    var expandmap = meta.expandmap || {}
    var expanded = this.props.isroot || expandmap[id] ? true : false
    var children = expanded ? (this.props.data.children || []) : []

    var expandsymbol = expanded ? '-' : '+'
    var toggleExpanded = () => {
      var newexpandvalue = expanded ? false : true
      var newmeta = update(this.props.meta, {
        expandmap:{
          $set: {
            [id]: newexpandvalue
          }
        }
      })

      this.props.update_meta(newmeta)
    }

    // dont show the expand link for the root node or nodes with no children
    var expandLink = (this.props.isroot || (this.props.data.children || []).length<=0) ? null : (
      <a href="javascript:void(0);" onClick={toggleExpanded} style={styles.toggleLink}>
        <span>{expandsymbol}</span>
      </a>
    )

    // control how much offset padding relative to the parent
    var use_offset_style = this.props.offset_style || DEFAULT_OFFSET_STYLE

    // use no padding for the root element
    var wrapperStyle = this.props.isroot ? null : use_offset_style

    return (
      <div style={wrapperStyle}>
        {expandLink} {this.props.data.name}
        <div>
        {
          children.map((child, i) => {
            return (
              <TreeNode
                data={child}
                meta={meta}
                update_meta={this.props.update_meta}
                offset_style={this.props.offset_style}
                key={i} />
            )
          })
        }
        </div>
      </div>
    )
    
  }

}

export default TreeNode