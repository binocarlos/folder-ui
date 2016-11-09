import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

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
  

  let parentNode = state.tree.db ? state.tree.db.data[formInfo.parent] : null

  if(ownProps.crudParent){
    parentNode = ownProps.crudParent
  }

  let readonly = false

  // hide the save/revert buttons if the item is not editable
  if(formInfo.mode == 'edit' && ownProps.isEditable){
    readonly = ownProps.isEditable(data) ? false : true
  }

  const getItemTitle = (item = {}) => {
    return ownProps.getTitle ?
      ownProps.getTitle(item) :
      item.name
  }

  const title = formInfo.mode == 'edit' ? getItemTitle(originalData) : 'New ' + schema.title

  return {
    title,
    parentNode,
    readonly,
    data,
    meta,
    schema,
    mode:formInfo.mode,
    saveTitle:formInfo.mode == 'edit' ? 'Save' : 'Add',
    getState:() => s
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
    dispatch,
    save:(data, meta, parentNode) => {
      if(!meta.valid){
        // TODO - display a message?
        return
      }
      if(formInfo.mode=='add'){
        dispatch(actions.requestAddItem(context, parentNode, data, (err) => {
          const schema = ownProps.getSchema(formInfo.type) || {}
          dispatch(actions.showChildrenMessage(schema.title + ' added'))
          dispatch(actions.routeOpen(parentNode, params))
        }))
      }
      else if(formInfo.mode=='edit'){
        dispatch(actions.requestSaveItem(context, parentNode, data, (err) => {
          dispatch(actions.showChildrenMessage(data.name + ' saved'))
          dispatch(actions.routeOpen(parentNode, params))
        }))
      }
    },
    cancel:(parentNode) => {
      dispatch(actions.routeOpen(parentNode, params))
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