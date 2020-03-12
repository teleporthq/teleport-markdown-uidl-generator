import { UIDLElementNode, UIDLNode } from '@teleporthq/teleport-types'

export const generateUIDL = (tree: any, parentNode: UIDLElementNode) => {
  tree.children.forEach((treeNode: any) => {
    switch (treeNode.type) {
      case 'paragraph': {
        const staticNode = generateHTMLTagNode('textblock')
        if (treeNode.children) {
          generateUIDL(treeNode, staticNode)
        }
        parentNode.content.children.push(staticNode)
        return parentNode
      }

      case 'heading': {
        const headingNode = generateHTMLTagNode(`h${treeNode.depth}`)
        if (treeNode.children) {
          generateUIDL(treeNode, headingNode)
        }
        parentNode.content.children.push(headingNode)
        return parentNode
      }

      case 'link': {
        const anchorNode = generateAnchorNode(treeNode.url)
        parentNode.content.children.push(anchorNode)
        if (treeNode.children) {
          generateUIDL(treeNode, anchorNode)
        }
        return parentNode
      }

      case 'text': {
        const textNode = generateStaticTextNode(treeNode.value)
        parentNode.content.children.push(textNode as UIDLNode)
        return parentNode
      }

      case 'code': {
        /* We don't set ths using dangerouslySetInnerHTML, because if we set them as htmlnodes
         if the code have any script tags, instead of rendering they 
         tend to behave as a actual dome nodes */
        const code = '<code>' + '${`' + treeNode.value + '`}' + '</code>'
        const rawNode = generateRawNode(code)
        parentNode.content.children.push(rawNode as UIDLNode)
        return parentNode
      }

      case 'inlineCode': {
        const inlineCodeNode = generateInlineCodeNode(`<pre><code>${treeNode.value}</code></pre>`)
        parentNode.content.children.push(inlineCodeNode as UIDLNode)
        return parentNode
      }

      case 'image': {
        const imageNode = generateCustomtNodeWithContent(treeNode.type, null, {
          url: treeNode.url,
          alt: treeNode.alt,
        })
        parentNode.content.children.push(imageNode)
        return parentNode
      }

      case 'html': {
        const rawNode = generateRawNode(`${treeNode.value}`)
        parentNode.content.children.push(rawNode as UIDLNode)
        return parentNode
      }

      default: {
        const defaultNode = generateHTMLTagNode(htmlTagNameMapper(treeNode.type))
        if (treeNode.children) {
          generateUIDL(treeNode, defaultNode)
        }
        parentNode.content.children.push(defaultNode)
        return parentNode
      }
    }
  })

  return parentNode
}

export const generateHTMLTagNode = (tagName: string) => {
  const node: UIDLElementNode = {
    type: 'element',
    content: {
      elementType: tagName,
      children: [],
    },
  }
  return node
}

const htmlTagNameMapper = (tagType: string) => {
  const elements: Record<string, string> = {
    emphasis: 'em',
    listItem: 'li',
    list: 'ul',
    thematicBreak: 'hr',
    tableRow: 'tr',
    tableCell: 'td',
  }
  return elements[tagType] ? elements[tagType] : tagType
}

const generateAnchorNode = (target: string) => {
  const node: UIDLElementNode = {
    type: 'element',
    content: {
      elementType: 'link',
      attrs: {
        url: {
          type: 'static',
          content: `${target}`,
        },
      },
      children: [],
    },
  }
  return node
}

const generateCustomtNodeWithContent = (tagName: string, content?: string, attrs?: any) => {
  let node: UIDLElementNode = {
    type: 'element',
    content: {
      elementType: `${tagName}`,
      attrs: {},
      children: [],
    },
  }
  if (content) {
    node.content.children.push({
      type: 'static',
      content: `${content}`,
    })
  }
  if (attrs) {
    node = {
      ...node,
      content: {
        ...node.content,
        attrs,
      },
    }
  }
  return node
}

const generateStaticTextNode = (content: string) => {
  return {
    type: 'static',
    content,
  }
}

const generateRawNode = (content: string) => {
  return {
    type: 'element',
    content: {
      elementType: 'pre',
      children: [
        {
          type: 'static',
          content,
        },
      ],
    },
  }
}

const generateInlineCodeNode = (content: string) => {
  return {
    type: 'element',
    content: {
      elementType: 'span',
      style: {
        margin: '0px 5px',
      },
      children: [
        {
          type: 'raw',
          content,
        },
      ],
    },
  }
}
