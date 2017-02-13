module.exports = function () {
  console.log(window.location.search)
  var data = {
    "d": [
      {
        "type": "folder",
        "children": false,
        "id": "workspace_25__content_141",
        "li_attr": {
          "title": "ok folder",
          "class": "tracim-tree-item-is-a-folder"
        },
        "a_attr": {
          "href": "/workspaces/25/folders/141"
        },
        "state": {
          "selected": false,
          "opened": false
        },
        "text": "ok folder"
      },
      {
        "type": "page",
        "children": false,
        "id": "workspace_25__content_125",
        "li_attr": {
          "title": "woioy",
          "class": "tracim-tree-item-is-a-folder"
        },
        "a_attr": {
          "href": "/workspaces/25/folders/124/pages/125"
        },
        "state": {
          "selected": false,
          "opened": true
        },
        "text": "woioy"
      },
      {
        "type": "thread",
        "children": false,
        "id": "workspace_25__content_126",
        "li_attr": {
          "title": "bonjour Mr",
          "class": "tracim-tree-item-is-a-folder"
        },
        "a_attr": {
          "href": "/workspaces/25/folders/124/threads/126"
        },
        "state": {
          "selected": false,
          "opened": true
        },
        "text": "bonjour Mr"
      },
      {
        "type": "file",
        "children": false,
        "id": "workspace_25__content_133",
        "li_attr": {
          "title": "ok file",
          "class": "tracim-tree-item-is-a-folder"
        },
        "a_attr": {
          "href": "/workspaces/25/folders/124/files/133"
        },
        "state": {
          "selected": false,
          "opened": true
        },
        "text": "ok file"
      }
    ]
  }

  const query = window.location.search.substring(1).split('=')[1]

  return data.d.filter(item => item.id === query)
}
