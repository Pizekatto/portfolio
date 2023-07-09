import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const res = fs.readFileSync('./src/settings.json', 'utf-8')
const data = JSON.parse(res)

const config = {
  // context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./src/index.js']
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      templateParameters: data
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          sources: {
            list: [
              "...",
              {
                tag: "img",
                attribute: "data-src",
                type: "src",
              }
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // include: path.join(__dirname, 'src/styles/')
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: path.join(__dirname, 'src/styles/')
      },
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
      {
        test: /\.(ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        include: path.join(__dirname, 'src/assets/images'),
        generator: {
          filename: 'assets/images/[name]-[hash][ext][query]'
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
  config.output.clean = isProd
  return config
}
