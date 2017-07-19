import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MenuNode from './menuNode.jsx'
require('./style.styl')

const propTypes = {
  nodesAreLinks: PropTypes.bool.isRequired,
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
    .then(json => this.setState({...this.state, menuTree: json.d}))
  }

  handleChangeSelectedNode = newSelectedNodeId => this.setState({...this.state, selectedNode: newSelectedNodeId})

  render () {
    return (
      <div className={'sidebarleft textMenuColor'}>
        <div className={'sidebarleft__menu'}>
          { this.state.menuTree.map((treeItem, i) =>
            <MenuNode
              data={treeItem}
              nodesAreLinks={this.props.nodesAreLinks}
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
const sidebarLeft = (element, nodesAreLinks, apiPath, apiParameters, apiChildPath, apiChildParameters) => {
  const isParamValid = []
  ;[element, nodesAreLinks, apiPath, apiParameters, apiChildPath, apiChildParameters].forEach(oneParam => isParamValid.push(oneParam === undefined))

  isParamValid.includes(true)
    ? console.error(
      `Error : Wrong sidebarLeft() call.
        sidebarLeft(element, nodesAreLinks, apiPath, apiParameters, apiChildPath, apiChildParameters)
        element : DOM element (from document.getElementById). Where to place SidebarLeft app
        nodesAreLinks : boolean. Whether nodes should be links or not (links are for the left sidebar, not links are for move folder popup)
        apiPath : string. Api full path to get the root tree of workspaces
        apiParameters : string. GET parameters for apiPath (must contains '?' as first char)
        apiChildPath : string. Api full path to get the childrens of any nodes
        apiChildParameters : string. GET parameters for apiChildPath (must contains '?' as first char)`
    )
    : ReactDOM.render(
      <SidebarLeft nodesAreLinks={nodesAreLinks} apiPath={apiPath} apiParameters={apiParameters} apiChildPath={apiChildPath} apiChildParameters={apiChildParameters} />,
      element
    )
}
module.exports = sidebarLeft
