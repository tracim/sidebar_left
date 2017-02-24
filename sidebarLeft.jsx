import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MenuNode from './menuNode.jsx'
require('./style.styl')

const propTypes = {
  nodeAreLink: PropTypes.bool.isRequired,
  apiPath: PropTypes.string.isRequired,
  apiParameters: PropTypes.string.isRequired,
  apiChildPath: PropTypes.string.isRequired,
  apiChildParameters: PropTypes.string.isRequired
}

class SidebarLeft extends React.Component {
  constructor () {
    super()
    this.state = {
      menuTree: [],
      selectedNode: '' // node selected (clicked) by the user
    }
  }

  componentDidMount = () => {
    fetch(this.props.apiPath + this.props.apiParameters, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(json => this.setState({menuTree: json.d}))
  }

  handleChangeSelectedNode = (newSelectedNodeId) => {
    this.setState({...this.state, selectedNode: newSelectedNodeId})
  }

  render () {
    return (
      <div className={'sidebarleft textMenuColor'}>
        <div className={'sidebarleft__menu'}>
          { this.state.menuTree.map((treeItem, i) =>
            <MenuNode
              data={treeItem}
              nodeAreLink={this.props.nodeAreLink}
              nodeDeepness={0}
              key={'root_' + i}
              apiChildPath={this.props.apiChildPath}
              apiChildParameters={this.props.apiChildParameters || ''}
              selectedNode={this.state.selectedNode}
              handlerSelectNode={this.handleChangeSelectedNode}
            />
          )}
        </div>
      </div>
    )
  }
}

SidebarLeft.propTypes = propTypes

// wrapper for app launcher (it's better to have the wrapper in a separated file but since this app can only be used for tracim, it's not required)
const sidebarLeft = (element, nodeAreLink, apiPath, apiParameters = '', apiChildPath = '', apiChildParameters = '') => {
  ReactDOM.render(
    <SidebarLeft nodeAreLink={nodeAreLink} apiPath={apiPath} apiParameters={apiParameters} apiChildPath={apiChildPath} apiChildParameters={apiChildParameters} />,
    element
  )
}
module.exports = sidebarLeft
