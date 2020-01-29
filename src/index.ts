import unified from 'unified'
import markdownParser from 'remark-parse'

import { generateHTMLTagNode, generateUIDL } from './utils'

export const markdownUIDLGenerator = () => {
  const parser = () => unified().use(markdownParser)

  const parse = (content: string) => {
    const tree = parser().parse(content)

    const uidl = generateUIDL(tree, generateHTMLTagNode('container'))
    return uidl
  }

  return {
    parser,
    parse,
  }
}
