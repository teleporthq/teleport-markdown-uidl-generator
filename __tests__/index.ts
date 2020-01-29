import { markdownUIDLGenerator } from '../src/index'

describe('Parsing markdown and generating UIDL Nodes', () => {
  const generator = markdownUIDLGenerator()

  it('Parses markdown and generates empty UIDLElementNode', () => {
    const markdown = ``
    const uidl = generator.parse(markdown)
    expect(uidl.content.children.length).toBe(0)
  })

  it('Parses markdown with heading and generates UIDLElementNode', () => {
    const markdown = `# Heading`
    const uidl = generator.parse(markdown)

    expect(uidl.content.children.length).toBeGreaterThan(0)
  })
})
