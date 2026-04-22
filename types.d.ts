import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        speed?: string;
        loop?: boolean;
        autoplay?: boolean;
        direction?: string;
        mode?: string;
        style?: React.CSSProperties;
      };
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'lottie-player': any;
      }
    }
  }
}

export {};
