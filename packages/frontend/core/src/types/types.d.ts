/// <reference types="@webpack/env"" />

// not using import because it will break the declare module line below
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../../../electron/src/preload/preload.d.ts' />

declare module '*.md' {
  const text: string;
  export default text;
}

declare module '*.assets.svg' {
  const url: string;
  export default url;
}

declare module '*.zip' {
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.jpg' {
  const url: string;
  export default url;
}
