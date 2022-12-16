const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}
console.log(mode + ' mode');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    open: true,
    static: {
      directory: './src',
      watch: true,
    },
    port: 5000,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new EslintPlugin({ extensions: 'ts' }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.ts$/i, use: 'ts-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(mp3|ogg|wav|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/sounds/[name][ext]',
        },
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
};
