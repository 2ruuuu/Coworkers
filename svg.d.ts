/**
 * SVG는 항상 `?react`를 붙여 React 컴포넌트로 import한다.
 * (Next.js와 Storybook 모두 `?react`만 svgr로 변환하도록 맞춘다. 정적 이미지가 필요하면 public/ 경로를 사용)
 */
declare module '*.svg?react' {
  import type * as React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

  export default ReactComponent;
}

declare module '*.png' {
  const src: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };

  export default src;
}
