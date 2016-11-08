import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'

import Toolbar from '../components/FormToolbar'
import { getDatabaseContext } from '../tools'

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

  const formInfo = info.form ? info.form(ownProps.params) : {}
  const data = state.editing.data || {}
  const meta = state.editing.meta || {}
  const originalData = state.editing.originalData || {}

  const type = formInfo.mode == 'edit' ? data.type : formInfo.type
  const schema = ownProps.getSchema(type) || {}
  const title = formInfo.mode == 'edit' ? originalData.name : 'New ' + schema.title

  const parentNode = state.tree.db ? state.tree.db.data[formInfo.parent] : null
  const item = state.tree.db ? state.tree.db.data[formInfo.id] : null

  let readonly = false

  // hide the save/revert buttons if the item is not editable
  if(formInfo.mode == 'edit' && ownProps.isEditable){
    readonly = ownProps.isEditable(item) ? false : true
  }

  return {
    title,
    parentNode,
    readonly,
    data,
    meta,
    schema,
    item,
    mode:formInfo.mode,
    saveTitle:formInfo.mode == 'edit' ? 'Save' : 'Add'
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const routeHandlers = ownProps.handlers
  const context = getDatabaseContext(ownProps)
  const params = ownProps.params

  const route = ownProps.route || {}

  const info = ownProps.info
  const formInfo = info.form ? info.form(ownProps.params) : {}

  return {
    save:(data, meta, parentNode) => {
      if(!meta.valid){
        // TODO - display a message?
        return
      }
      if(formInfo.mode=='add'){
        dispatch(actions.requestAddItem(context, parentNode, data, (err) => {
          if(!routeHandlers.open && !parentNode) return
          const schema = ownProps.getSchema(formInfo.type) || {}
          dispatch(actions.showChildrenMessage(schema.title + ' added'))
          dispatch(push(routeHandlers.open(parentNode, params)))
        }))
      }
      else if(formInfo.mode=='edit'){
        dispatch(actions.requestSaveItem(context, parentNode, data, (err) => {
          if(!routeHandlers.open && !parentNode) return
          dispatch(actions.showChildrenMessage(data.name + ' saved'))
          dispatch(push(routeHandlers.open(parentNode, params)))
        }))
      }
    },
    cancel:(parentNode) => {
      if(!routeHandlers.open && !parentNode) return
      dispatch(push(routeHandlers.open(parentNode, params)))
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