const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/umd'),
      filename: 'teleport-markdown-uidl-generator.js',
      library: 'teleportMarkdownUidlGenerator',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    mode: 'production',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                declaration: false
              } 
            },
          }],
          exclude: /node_modules/
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js' ],
    }
  }