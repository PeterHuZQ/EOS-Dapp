const webpack = require('webpack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './app/index.jsx'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { test: /\.css$/,
        include: /node_modules/,
        loader: 'style-loader!css-loader' 
      },
      { test: /\.less$/, 
        exclude: /node_modules/, 
        loader: 'style-loader!css-loader!less-loader' 
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
