import { DetailedHTMLProps, HTMLAttributes } from 'react';

function style({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLStyleElement>, HTMLStyleElement>) {
  return <style {...props}>{children}</style>;
}

export default style;
