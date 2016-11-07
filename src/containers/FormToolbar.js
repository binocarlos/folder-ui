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

  const formInfo = info.form ? info.form(ownProps) : {}
  const data = state.editing.data || {}
  const meta = state.editing.meta || {}
  const originalData = state.editing.originalData || {}

  const type = formInfo.mode == 'edit' ? data.type : formInfo.type
  const schema = ownProps.getSchema(type) || {}
  const title = formInfo.mode == 'edit' ? originalData.name : 'New ' + schema.title

  const parentNode = state.tree.db ? state.tree.db.data[formInfo.parent] : null

  return {
    title,
    parentNode,
    data,
    meta
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
        console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('parasm')
      console.dir(params)
      console.log('parentNode')
      console.dir(parentNode)
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