import { markdownUIDLGenerator } from '../src/index'
import { UIDLElementNode, UIDLElement } from '@teleporthq/teleport-types'

describe('Parsing markdown and generating UIDL Nodes', () => {
  const generator = markdownUIDLGenerator()

  it('Parses markdown and generates empty UIDLElementNode', () => {
    const markdown = ``
    const uidl = generator.parse(markdown)
    expect(uidl.content.children.length).toBe(0)
  })

  it('Parses and generates UIDLElementNode with Heading', () => {
    const markdown = `# Heading`
    const uidl = generator.parse(markdown)

    expect(uidl.content.children.length).toBeGreaterThan(0)
  })

  it('Parses and generates UIDLElementNode with paragraph', () => {
    const markdown = `
# Heading
This is pragraph`
    const uidl = generator.parse(markdown)
    const heading = uidl.content.children[0] as UIDLElementNode
    const paragraph = uidl.content.children[1] as UIDLElementNode

    expect(uidl.content.children.length).toBe(2)
    expect(heading.content.elementType).toBe('h1')
    expect(paragraph.content.elementType).toBe('textblock')
  })

  it('Parses and generates UIDLEmenetNodes with anchor tag', () => {
    const markdown = `
## Heading
[link](https://www.google.com)`
    const uidl = generator.parse(markdown)
    const heading = uidl.content.children[0] as UIDLElementNode
    const paragraph = uidl.content.children[1].content as UIDLElement
    const link = paragraph.children[0] as UIDLElementNode

    expect(uidl.content.children.length).toBe(2)
    expect(heading.content.elementType).toBe('h2')
    expect(link.content.elementType).toBe('link')
    expect(link.content.attrs.url.content).toBe('https://www.google.com')
  })

  it('Parses and generates UIDLEmenetNodes with anchor tag', () => {
    const markdown = `
### Heading
![Alt Text](https://avatars1.githubusercontent.com/u/33519579?s=200&v=4 "Teleport")`
    const uidl = generator.parse(markdown)
    const heading = uidl.content.children[0] as UIDLElementNode
    const paragraph = uidl.content.children[1].content as UIDLElement
    const image = paragraph.children[0] as UIDLElementNode

    expect(uidl.content.children.length).toBe(2)
    expect(heading.content.elementType).toBe('h3')
    expect(image.content.elementType).toBe('image')
    expect(image.content.attrs.url).toBe(
      'https://avatars1.githubusercontent.com/u/33519579?s=200&v=4'
    )
    expect(image.content.attrs.alt).toBe('Alt Text')
  })

  it('Parses code block and generates UIDLElementNode', () => {
    const markdown = `
prensoque morte videri parentibus in
perluit utque!

    type = powerGuidSku;
    edi_definition_bar = commerce;
    var ppiDigitize = avatarPassive -
            extranetPcmcia.template.server_wpa_surface(camelcase + malwareSsl,
            5);
    if (2 <= truncate.winsock(28, 4, scraping_read_error)) {
        pup += http_sip + exif_lpi.ppgaMenu(3, 3);
        floppyFileSoftware += workstationFile + 1 + edutainment;
    } else {
        dhcpArrayKerning.quicktime_slashdot -= of_key_search;
    }

Se tria est deriguere utque scitusque
`
    const uidl = generator.parse(markdown)

    expect(uidl.content.children.length).toBe(3)
    expect(uidl.content.children[1].type).toBe('raw')
  })

  it('Parses markdown with html in it and generates UIDL Nodes', () => {
    const markdown = `<h1>Heading inside html tags</h1>`
    const uidl = generator.parse(markdown)

    expect(uidl.content.children.length).toBe(1)
    expect(uidl.content.children[0].type).toBe('raw')
  })

  it('Parsers and generates line breaks', () => {
    const markdown = `
This is first line with a line break

---


This is second line with a line break
***

This is third Line with a line break
___
`
    const uidl = generator.parse(markdown)
    const firstLine = uidl.content.children[1].content as UIDLElement
    const secondLine = uidl.content.children[3].content as UIDLElement
    const thirdLine = uidl.content.children[5].content as UIDLElement

    expect(uidl.content.children.length).toBe(6)
    expect(firstLine.elementType).toBe('hr')
    expect(secondLine.elementType).toBe('hr')
    expect(thirdLine.elementType).toBe('hr')
  })

  it('Parses tables from markdown and generates UIDLNodes', () => {
    const markdown = `
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
`
    const uidl = generator.parse(markdown)
    const table = uidl.content.children[0].content as UIDLElement

    expect(uidl.content.children.length).toBe(1)
    expect(table.elementType).toBe('table')
    expect(table.children.length).toBe(4)
  })

  it('Parses and generates nodes with video links', () => {
    const markdown = `
<a href="http://www.youtube.com/watch?feature=player_embedded&v=_oet4GOzcRQ
" target="_blank"><img src="http://img.youtube.com/vi/_oet4GOzcRQ/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>
`
    const uidl = generator.parse(markdown)

    expect(uidl.content.children.length).toBe(1)
  })

  it('Parses and generates UIDL with blockquotes', () => {
    const markdown = `> Blockquotes are very handy in email to emulate reply text.`
    const uidl = generator.parse(markdown)
    const blockQuote = uidl.content.children[0].content as UIDLElement

    expect(uidl.content.children.length).toBe(1)
    expect(blockQuote.elementType).toBe('blockquote')
  })

  it('Parses markdown with inline-code elements', () => {
    const markdown = 'This line consists of a inline ``yarn/npm`` elements'
    const uidl = generator.parse(markdown)

    expect(uidl.content.children.length).toBe(1)
  })
})
