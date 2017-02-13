import React from 'react'
import ReactDOM from 'react-dom'

class SidebarLeft extends React.Component {
  constructor () {
    super()
    this.state = {
      menuTree: [],
      selectedNodeId: ''
    }
  }

  componentDidMount = () => {
    fetch('http://localhost:3083/workspaces/treeview_root', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(json => {
      this.setState({menuTree: json.d})
    })
  }

  handleChangeSelectedNodeId = newId => this.setState({...this.state, selectedNodeId: newId})

  render () {
    const styles = {
      title: {
        margin: '20px 0'
      }
    }

    return (
      <div className={'textMenuColor'}>
        <div style={styles.title}>Espaces de travail</div>
        { this.state.menuTree.map((treeItem, i) =>
          <MenuNode
            data={treeItem}
            nodeDeepness={0}
            selectedNodeId={this.state.selectedNodeId}
            handleChangeSelectedNodeId={this.handleChangeSelectedNodeId}
            key={'root_' + i}
          />)}
      </div>
    )
  }
}

class MenuNode extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuTree: props.data,
      isNodeHovered: false
    }
  }

  handlerOnClickSubMenuItem = (e, subMenuItem) => {
    e.stopPropagation()

    this.props.handleChangeSelectedNodeId(subMenuItem.id)

    if (subMenuItem.type !== 'workspace' && subMenuItem.type !== 'folder') return console.log('this is neither a workspace nor a folder')
    if (subMenuItem.type === 'folder' && subMenuItem.children === false) return console.log('this is an empty folder')

    fetch('http://localhost:3083/workspaces/treeview_children?id=' + subMenuItem.id, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(json => this.setState({...this.state, menuTree: {...this.state.menuTree, children: json.d}}))
  }

  handleMouseEnter = () => this.setState({...this.state, isNodeHovered: true})
  handleMouseLeave = () => this.setState({...this.state, isNodeHovered: false})

  render () {
    const { nodeDeepness, selectedNodeId, handleChangeSelectedNodeId } = this.props
    const { menuTree } = this.state

    const styles = {
      menuItem: {
        margin: '5px 0 5px 10px'
      }
    }

    const nodeClass = (rez => {
      if (this.props.selectedNodeId === menuTree.id) rez += 'textMenuClickedColor textMenuClickedBgColor '
      if (this.state.isNodeHovered) rez += 'textMenuColor-hover textMenuBgColor-hover '
      return rez
    })(' ')

    return (
      <div style={styles.menuItem}>
        <div className={nodeClass} onClick={e => this.handlerOnClickSubMenuItem(e, menuTree)} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          { menuTree.text }
        </div>
        { Array.isArray(menuTree.children) && menuTree.children.map((child, i) =>
          <MenuNode
            data={child}
            nodeDeepness={nodeDeepness + 1}
            handleOnClick={this.handlerOnClickSubMenuItem}
            selectedNodeId={selectedNodeId}
            handleChangeSelectedNodeId={handleChangeSelectedNodeId}
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
