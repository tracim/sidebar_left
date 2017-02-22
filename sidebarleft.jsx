import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Collapse from 'react-collapse'
require('./style.styl')

class SidebarLeft extends React.Component {
  constructor () {
    super()
    this.state = {
      menuTree: []
    }
  }

  static propTypes = {
    apiPath: PropTypes.string.isRequired,
    apiParameters: PropTypes.string
  }

  componentDidMount = () => {
    fetch(this.props.apiPath + 'workspaces/treeview_root' + this.props.apiParameters, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(json => this.setState({menuTree: json.d}))
  }

  render () {
    return (
      <div className={'sidebarleft textMenuColor'}>
        <div className={'sidebarleft__menu'}>
          { this.state.menuTree.map((treeItem, i) => <MenuNode data={treeItem} nodeDeepness={0} key={'root_' + i} apiPath={this.props.apiPath} />)}
        </div>
      </div>
    )
  }
}

class MenuNode extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodeData: props.data,
      isNodeHovered: false
    }
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    nodeDeepness: PropTypes.number.isRequired,
    apiPath: PropTypes.string.isRequired
  }

  handlerOnClickExpandPicto = (e) => {
    e.stopPropagation()

    const { nodeData } = this.state

    if (nodeData.type !== 'workspace' && nodeData.type !== 'folder') return

    if (nodeData.state.opened) {
      return this.setState({...this.state, nodeData: {...nodeData, state: {...nodeData.state, opened: false}, children: true}})
    }
    if (nodeData.type === 'folder' && nodeData.children === false) {
      return this.setState({...this.state, nodeData: {...nodeData, state: {...nodeData.state, opened: true}}})
    }

    fetch(this.props.apiPath + 'workspaces/treeview_children?id=' + nodeData.id, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(json => this.setState({...this.state, nodeData: {...nodeData, state: {...nodeData.state, opened: true}, children: json.d}}))
  }

  handleMouseEnter = () => this.setState({...this.state, isNodeHovered: true})
  handleMouseLeave = () => this.setState({...this.state, isNodeHovered: false})

  render () {
    const { nodeDeepness } = this.props
    const { nodeData, isNodeHovered } = this.state

    const styles = {
      menuItem: {
        paddingLeft: nodeDeepness * 10 + 'px'
      }
    }

    const nodeClass = (rez => {
      if (nodeData.state.selected) rez += 'textMenuClickedColor textMenuClickedBgColor '
      if (isNodeHovered) rez += 'textMenuColor-hover textMenuBgColor-hover '
      return rez
    })('sidebarleft__menu__item ')

    const faIcon = (() => {
      switch (nodeData.type) {
        case 'workspace': return 'fa-bank'
        case 'folder': return 'fa-folder-open-o'
        case 'page': return 'fa-file-text-o'
        case 'thread': return 'fa-comments-o'
        case 'file': return 'fa-paperclip'
      }
    })()

    const expandPicto = (() => nodeData.type === 'folder' || nodeData.type === 'workspace' ? (nodeData.state.opened ? 'fa-caret-down' : 'fa-caret-right') : '')()

    return (
      <div>
        <div className={nodeClass} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          <div className={'sidebarleft__menu__item__name'} style={nodeDeepness !== 0 ? styles.menuItem : {}}>
            <div className={'sidebarleft__menu__item__expandpicto'} onClick={e => this.handlerOnClickExpandPicto(e)}>
              <i className={'fa ' + expandPicto} />
            </div>
            <a className={'sidebarleft__menu__item__link'} href={nodeData.a_attr.href}>
              <i className={'fa ' + faIcon} />
              { nodeData.text }
            </a>
          </div>
        </div>
        <Collapse isOpened={Array.isArray(nodeData.children)} springConfig={{stiffness: 500, damping: 40}} hasNestedCollapse>
          { Array.isArray(nodeData.children) && nodeData.children.map((child, i) =>
            <MenuNode
              data={child}
              nodeDeepness={nodeDeepness + 1}
              key={nodeDeepness + '_' + i}
              apiPath={this.props.apiPath}
            />
          )}
        </Collapse>
      </div>
    )
  }
}

// wrapper for app launcher (it's better to have the wrapper in a separated file but since this app can only be used for tracim, it's not required)
const sidebarLeft = (element, apiPath, apiParameters = '') => {
  ReactDOM.render(<SidebarLeft apiPath={apiPath} apiParameters={apiParameters} />, element)
}
module.exports = sidebarLeft
