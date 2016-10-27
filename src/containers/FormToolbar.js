import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'

import Toolbar from '../components/FormToolbar'

export class FormToolbarContainer extends Component {

  render() {
    return (
      <Toolbar {...this.props} />  
    )
  }
}

function mapStateToProps(s, ownProps) {

  const actions = ownProps.actions
  const info = ownProps.info
  const state = actions.getState(s)

  const formInfo = info.form ? info.form(ownProps) : {}
  const data = state.editing.data || {}
  const originalData = state.editing.originalData || {}

  const type = formInfo.mode == 'edit' ? data.type : formInfo.type
  const schema = ownProps.getSchema(type) || {}
  const title = formInfo.mode == 'edit' ? originalData.name : 'New ' + schema.title

  const parentNode = state.tree.db ? state.tree.db.data[formInfo.parent] : null

  return {
    title,
    parentNode
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const handlers = ownProps.handlers

  const route = ownProps.route || {}

  const info = ownProps.info
  const formInfo = info.form ? info.form(ownProps) : {}

  return {
    save:() => {
      
    },
    cancel:(parentNode) => {
      if(!handlers.open && !parentNode) return
      dispatch(push(handlers.open(parentNode)))
    },
    revert:() => {
      dispatch(actions.revertEditNode())
    }
  }
}

FormToolbarContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  info:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FormToolbarContainer))