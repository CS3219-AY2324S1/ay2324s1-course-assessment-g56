import { Code, useColorModeValue } from '@chakra-ui/react';
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Light as SyntaxHighlighter } from '@fengkx/react-syntax-highlighter';
import js from '@fengkx/react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import {
  a11yLight,
  a11yDark,
} from '@fengkx/react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);

function code({ children, className, node, ...props }) {
  const codeStr = String(children)?.replace(/\n$/, '');
  const style = useColorModeValue(a11yLight, a11yDark);
  const startLine = node?.position?.start?.line;
  const endLine = node?.position?.end?.line;

  if (endLine - startLine > 0) {
    return (
      <SyntaxHighlighter
        wrapLongLines
        language="javascript"
        style={style}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    );
  }
  return <Code {...props}>{codeStr}</Code>;
}

export default code;
