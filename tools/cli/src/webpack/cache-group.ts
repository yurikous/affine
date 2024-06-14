function testPackageName(regexp: RegExp): (module: any) => boolean {
  return (module: any) =>
    module.nameForCondition && regexp.test(module.nameForCondition());
}

// https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
export const productionCacheGroups = {
  asyncVendor: {
    test: /[\\/]node_modules[\\/]/,
    name(module: any) {
      // monorepo linked in node_modules, so it's not a npm package
      if (!module.context.includes('node_modules')) {
        return `app-async`;
      }
      const name = module.context.match(
        /[\\/]node_modules[\\/](.*?)([\\/]|$)/
      )?.[1];
      return `npm-async-${name}`;
    },
    priority: Number.MAX_SAFE_INTEGER,
    chunks: 'async' as const,
  },
  blocksuite: {
    name: `npm-blocksuite`,
    test: testPackageName(/[\\/]node_modules[\\/](@blocksuite)[\\/]/),
    priority: 200,
    enforce: true,
  },
  react: {
    name: `npm-react`,
    test: testPackageName(
      /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/
    ),
    priority: 200,
    enforce: true,
  },
  jotai: {
    name: `npm-jotai`,
    test: testPackageName(/[\\/]node_modules[\\/](jotai)[\\/]/),
    priority: 200,
    enforce: true,
  },
  rxjs: {
    name: `npm-rxjs`,
    test: testPackageName(/[\\/]node_modules[\\/]rxjs[\\/]/),
    priority: 200,
    enforce: true,
  },
  lodash: {
    name: `npm-lodash`,
    test: testPackageName(/[\\/]node_modules[\\/]lodash[\\/]/),
    priority: 200,
    enforce: true,
  },
  emotion: {
    name: `npm-emotion`,
    test: testPackageName(/[\\/]node_modules[\\/](@emotion)[\\/]/),
    priority: 200,
    enforce: true,
  },
  vendor: {
    name: 'vendor',
    test: /[\\/]node_modules[\\/]/,
    priority: 190,
    enforce: true,
  },
  styles: {
    name: 'styles',
    test: (module: any) =>
      module.nameForCondition &&
      /\.css$/.test(module.nameForCondition()) &&
      !module.type.startsWith('javascript'),
    chunks: 'all' as const,
    minSize: 1,
    minChunks: 1,
    reuseExistingChunk: true,
    priority: 1000,
    enforce: true,
  },
};
