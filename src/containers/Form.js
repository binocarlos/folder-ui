import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Form from '../components/Form'

export class FormContainer extends Component {

  initializeData(id) {
    if(this.props.mode=='edit'){
      this.props.requestData(this.props.id)
    }
    else if(this.props.mode=='add'){
      this.props.setData(this.props.initialData)
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

  const formInfo = info.form ? info.form(ownProps) : {}

  const data = state.editing.data || {}
  const meta = state.editing.meta || null

  const type = formInfo.mode == 'edit' ? data.type : formInfo.type
  const schema = ownProps.getSchema(type) || {}

  return {
    id:formInfo.id,
    mode:formInfo.mode,
    data,
    meta,
    schema:schema.fields || [],
    initialData:schema.initialData || {}
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  return {
    onUpdate:(data, meta) => {
      dispatch(actions.updateEditNode(data, meta))
    },
    requestData:(id) => {
      if(!id) return
      dispatch(actions.requestNodeData(id))
    },
    setData:(data = {}) => {
      dispatch(actions.setNodeData(data))
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