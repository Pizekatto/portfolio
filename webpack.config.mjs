import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { fileURLToPath } from 'url'
import fs from 'fs'
import CopyPlugin from "copy-webpack-plugin"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const res = fs.readFileSync('./src/settings.json', 'utf-8')
const data = JSON.parse(res)

const config = {
  // context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./src/index.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      templateParameters: data
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets/images/work/full-res", to: "assets/images/work/full-res" }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        include: path.join(__dirname, 'src/styles/')
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: path.join(__dirname, 'src/styles/')
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        include: path.join(__dirname, 'src/assets/images'),
        generator: {
          filename: 'assets/images/[name][ext][query]'
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      },
      {
        test: /\.svg/,
        oneOf: [
          {
            resourceQuery: /inline/, // *.svg?inline
            type: 'asset/source',
            generator: {
              filename: 'images/[name][ext][query]'
            }
          },
          {
            type: 'asset/resource' // *.svg
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'simple-pug-loader'
      }
    ]
  }
}

export default (env, argv) => {
  const isProd = argv.mode === 'production'
  config.devtool = isProd ? false : 'eval-cheap-module-source-map'
  return config
}
