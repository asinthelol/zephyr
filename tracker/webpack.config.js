const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'zephyr-tracker.min.js' : 'zephyr-tracker.js',
      library: {
        name: 'ZephyrTracker',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimize: isProduction,
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
  };
};
