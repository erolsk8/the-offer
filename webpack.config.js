const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    compress: true,
    port: 8001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          // In production, extract CSS into separate files using MiniCssExtractPlugin
          // In development, inject CSS to the DOM using style-loader
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader', /// allows importing CSS from JS
          'sass-loader', // compiles .scss to .css
          'postcss-loader', // post-processing of CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.css', '.scss'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin(),
    ...(isProduction
      ? [
          new CopyPlugin({
            patterns: [
              { from: 'src/assets/robots.txt', to: 'robots.txt' },
            ],
          }),
        ]
      : []),
  ],
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};
