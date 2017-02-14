import React from 'react'
import ReactDOM from 'react-dom'

const GLOBAL_API_PATH = document.getElementById('sidebarleft_menu').getAttribute('apiPath')
const GLOBAL_API_PARAMETERS = document.getElementById('sidebarleft_menu').getAttribute('apiParameters')

class SidebarLeft extends React.Component {
  constructor () {
    super()
    this.state = {
      menuTree: []
    }
  }

  componentDidMount = () => {
    fetch(GLOBAL_API_PATH + 'workspaces/treeview_root' + GLOBAL_API_PARAMETERS, {
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
          { this.state.menuTree.map((treeItem, i) =>
            <MenuNode data={treeItem} nodeDeepness={0} key={'root_' + i} />
          )}
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

  handlerOnClickExpandPicto = (e) => {
    e.stopPropagation()

    const { nodeData } = this.state

    if (nodeData.type !== 'workspace' && nodeData.type !== 'folder') return console.log('this is neither a workspace nor a folder')
    if (nodeData.type === 'folder' && nodeData.children === false) return console.log('this is an empty folder')

    fetch(GLOBAL_API_PATH + 'workspaces/treeview_children?id=' + nodeData.id, {
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
    const { nodeDeepness, selectedNodeId } = this.props
    const { nodeData, isNodeHovered } = this.state

    const styles = {
      menuItem: {
        marginLeft: '10px'
      },
      expandPicto: {
        position: 'absolute'
      },
      link: {
        display: 'inline',
        whiteSpace: 'nowrap',
        marginLeft: '14px'
      }
    }

    const nodeClass = (rez => {
      if (nodeData.state.selected) rez += 'textMenuClickedColor textMenuClickedBgColor '
      if (isNodeHovered) rez += 'textMenuColor-hover textMenuBgColor-hover '
      return rez
    })('sidebarleft__menu__item__name ')

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
      <div className={'sidebarleft__menu__item'} style={styles.menuItem}>
        <div className={nodeClass} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          <div className={'sidebarleft__menu__item__expandpicto'} style={styles.expandPicto} onClick={e => this.handlerOnClickExpandPicto(e)}>
            <i className={'fa ' + expandPicto} />
          </div>
          <a className={'sidebarleft__menu__item__link'} href={nodeData.a_attr.href} style={styles.link}>
            <i className={'fa ' + faIcon} />
            { nodeData.text }
          </a>
        </div>
        { Array.isArray(nodeData.children) && nodeData.children.map((child, i) =>
          <MenuNode
            data={child}
            nodeDeepness={nodeDeepness + 1}
            handleOnClick={this.handlerOnClickExpandPicto}
            selectedNodeId={selectedNodeId}
            key={nodeDeepness + '_' + i}
          />
        )}
      </div>
    )
  }
}

ReactDOM.render(
  <SidebarLeft />
  , document.getElementById('sidebarleft_menu')
)
