import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Form from '../components/Form'
import { getDatabaseContext } from '../tools'

export class FormContainer extends Component {

  initializeData(id) {
    if(this.props.mode=='edit'){
      this.props.requestData(this.props.id)
    }
    else if(this.props.mode=='add'){
      this.props.setInitialData(this.props.parentNode, this.props.descriptor)
    }
  }

  componentDidMount() {
    this.initializeData()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.id != this.props.id){
      this.initializeData()
    }
  }

  render() {
    return (     
      <Form {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {

  const actions = ownProps.actions
  const info = ownProps.info
  const state = actions.getState(s)

  const formInfo = info.form ? info.form(ownProps.params) : {}

  const data = state.editing.data || {}
  const meta = state.editing.meta || null

  const type = formInfo.mode == 'edit' ? ownProps.getItemType(data) : formInfo.type

  const schema = ownProps.getSchema(type) || {}
  const parentNode = state.tree.db ? state.tree.db.data[formInfo.parent] : null

  let schemaFields = schema.fields || []

  // turn the schema into read-only if the item is not editable
  if(formInfo.mode == 'edit' && ownProps.isEditable){
    if(!ownProps.isEditable(data)){
      schemaFields = schemaFields.map(field => {
        return Object.assign({}, field, {
          readonly:true
        })
      })
    }
  }

  return {
    id:formInfo.id,
    mode:formInfo.mode,
    data,
    meta,
    schema:schemaFields,
    descriptor:schema,
    parentNode,
    getState:() => s
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const context = getDatabaseContext(ownProps)
  return {
    dispatch,
    onUpdate:(data, meta) => {
      dispatch(actions.updateEditNode(data, meta))
    },
    requestData:(id) => {
      if(!id) return
      dispatch(actions.requestNodeData(context, id))
    },
    setData:(data = {}) => {
      dispatch(actions.setEditData(data))
    },
    // initialize the form data with the `initialData`
    // property of the schema descriptor
    // if we have been given a 'getNewItem' prop
    // use it to get the data instead
    setInitialData:(parent, descriptor = {}) => {

      const newItem = ownProps.getNewItem ?
        ownProps.getNewItem(parent, descriptor) :
        descriptor.initialData

      dispatch(actions.setEditData(JSON.parse(JSON.stringify(newItem || {}))))
    }
  }
}

FormContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  info:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FormContainer))