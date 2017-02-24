import React, { PropTypes } from 'react'
import Collapse from 'react-collapse'

const propTypes = {
  data: PropTypes.object.isRequired,
  nodesAreLinks: PropTypes.bool.isRequired,
  nodeDeepness: PropTypes.number.isRequired,
  apiChildPath: PropTypes.string.isRequired,
  apiChildParameters: PropTypes.string.isRequired,
  selectedNode: PropTypes.string
}

const defaultProps = {
  selectedNode: ''
}

export default class MenuNode extends React.Component {
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

    if (nodeData.type !== 'workspace' && nodeData.type !== 'folder') return

    if (nodeData.state.opened) {
      return this.setState({...this.state, nodeData: {...nodeData, state: {...nodeData.state, opened: false}, children: true}})
    }
    if (nodeData.type === 'folder' && nodeData.children === false) {
      return this.setState({...this.state, nodeData: {...nodeData, state: {...nodeData.state, opened: true}}})
    }

    // bellow getChildTreeUrl is a bit unnatural because it was a bit complicated to handle GET parameters from tracim to sidebarleft
    const getChildTreeUrl = this.props.apiChildPath + '?id=' + nodeData.id + (this.props.apiChildParameters !== ''
      ? '&' + this.props.apiChildParameters.substr(1) // substr(1) removes the first '?'
      : ''
    )
    fetch(getChildTreeUrl, {
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
    const { nodesAreLinks, apiChildPath, apiChildParameters, nodeDeepness, selectedNode, handlerSelectNode } = this.props
    const { nodeData, isNodeHovered } = this.state

    const styles = {
      menuItem: {
        paddingLeft: nodeDeepness * 10 + 'px'
      }
    }

    const nodeClass = (rez => {
      // displays node as "selected", in sidebarleft, only when they have the selected attribute at true
      // or in the 'move folder popup or tracim', only when it is the clicked node
      if ((nodesAreLinks && nodeData.state.selected) || selectedNode === nodeData.id) rez += 'textMenuClickedColor textMenuClickedBgColor '
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
            { nodesAreLinks
              ? <a className={'sidebarleft__menu__item__link'} href={nodeData.a_attr.href} id={nodeData.id}><i className={'fa ' + faIcon} />{ nodeData.text }</a>
              : <div className={'sidebarleft__menu__item__link'} id={nodeData.id} onClick={() => handlerSelectNode(nodeData.id)}> <i className={'fa ' + faIcon} />{ nodeData.text }</div>
            }
          </div>
        </div>
        <Collapse isOpened={Array.isArray(nodeData.children)} springConfig={{stiffness: 500, damping: 40}} hasNestedCollapse>
          { Array.isArray(nodeData.children) && nodeData.children.map((child, i) =>
            <MenuNode
              data={child}
              nodesAreLinks={nodesAreLinks}
              nodeDeepness={nodeDeepness + 1}
              key={nodeDeepness + '_' + i}
              apiChildPath={apiChildPath}
              apiChildParameters={apiChildParameters}
              selectedNode={selectedNode}
              handlerSelectNode={handlerSelectNode}
            />
          )}
        </Collapse>
      </div>
    )
  }
}

MenuNode.propTypes = propTypes
MenuNode.defaultProps = defaultProps
