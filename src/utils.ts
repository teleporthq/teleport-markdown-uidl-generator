import { UIDLElementNode, UIDLNode } from "@teleporthq/teleport-types";

export const generateUIDL = (tree: any, parentNode: UIDLElementNode) => {
  tree.children.forEach((treeNode: any) => {
    switch (treeNode.type) {
      case "paragraph": {
        const staticNode = generateHTMLTagNode("textblock");
        if (treeNode.children) {
          generateUIDL(treeNode, staticNode);
        }
        parentNode.content.children.push(staticNode);
        return parentNode;
      }

      case "heading": {
        const headingNode = generateHTMLTagNode(`h${treeNode.depth}`);
        if (treeNode.children) {
          generateUIDL(treeNode, headingNode);
        }
        parentNode.content.children.push(headingNode);
        return parentNode;
      }

      case "link": {
        const anchorNode = generateAnchorNode(treeNode.url);
        parentNode.content.children.push(anchorNode);
        if (treeNode.children) {
          generateUIDL(treeNode, anchorNode);
        }
        return parentNode;
      }

      case "text": {
        const textNode = generateStaticTextNode(treeNode.value);
        parentNode.content.children.push(textNode as UIDLNode);
        return parentNode;
      }

      case "code": {
        const codeBlockNode = generateCustomtNodeWithContent(
          treeNode.type,
          `${String(treeNode.value)}`
        );
        parentNode.content.children.push(codeBlockNode);
        return parentNode;
      }

      case "image": {
        const imageNode = generateCustomtNodeWithContent(treeNode.type, null, {
          url: treeNode.url,
          alt: treeNode.alt
        });
        parentNode.content.children.push(imageNode);
        return parentNode;
      }

      case "html": {
        const htmlNode = generateCustomtNodeWithContent("span", null, {
          dangerouslySetInnerHTML: `{{ __html: ${treeNode.value}}}`
        });
        parentNode.content.children.push(htmlNode);
        return parentNode;
      }

      default: {
        const defaultNode = generateHTMLTagNode(
          htmlTagNameMapper(treeNode.type)
        );
        if (treeNode.children) {
          generateUIDL(treeNode, defaultNode);
        }
        parentNode.content.children.push(defaultNode);
        return parentNode;
      }
    }
  });

  return parentNode;
};

export const generateHTMLTagNode = (tagName: string) => {
  const node: UIDLElementNode = {
    type: "element",
    content: {
      elementType: tagName,
      children: []
    }
  };
  return node;
};

const htmlTagNameMapper = (tagType: string) => {
  const elements: Record<string, string> = {
    heading: "h2",
    emphasis: "em",
    listItem: "li"
  };
  return elements[tagType] ? elements[tagType] : tagType;
};

const generateAnchorNode = (target: string) => {
  const node: UIDLElementNode = {
    type: "element",
    content: {
      elementType: "link",
      attrs: {
        url: {
          type: "static",
          content: `${target}`
        }
      },
      children: []
    }
  };
  return node;
};

const generateCustomtNodeWithContent = (
  tagName: string,
  content?: string,
  attrs?: any
) => {
  let node: UIDLElementNode = {
    type: "element",
    content: {
      elementType: `${tagName}`,
      attrs: {},
      children: []
    }
  };
  if (content) {
    node.content.children.push({
      type: "static",
      content: `${content}`
    });
  }
  if (attrs) {
    node = {
      ...node,
      content: {
        ...node.content,
        attrs
      }
    };
  }
  return node;
};

const generateStaticTextNode = (content: string) => {
  return {
    type: "static",
    content: `${content}`
  };
};
