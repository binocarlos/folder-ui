import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { edit_item_cancel, edit_item_save } from '../actions'
import FormToolbar from '../../src/FormToolbar'

export class FormToolbarContainer extends Component {

  render() {
    return (   
      <FormToolbar {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  var item = state.folderui.editing || {}
  return {
    title:item.name,
    selected:item
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onbutton:function(name, selected){
      switch (name) {
        case 'save':
          return dispatch(edit_item_save(selected))
        case 'cancel':
          return dispatch(edit_item_cancel())
        default:
          return
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormToolbarContainer)