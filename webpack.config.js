const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';
const isProd = mode === 'production';

const HTMLPluginOptions = {
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeScriptTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
};

const getHTMLPlugins = (templateDir) => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

  return templateFiles.map(item => {
    const [name, extension] = item.split('.');
    
    return new HtmlWebpackPlugin({
      filename: `${name}.${extension}`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      ...HTMLPluginOptions,
    });
  })
};

module.exports = {
  mode,
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js'
  },

  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    quiet: true
  },

  module: {
    rules: [
      // Babel
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },

      // CSS + SASS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isProd,
            },
          },
          {
            loader: 'css-loader',
            options: {importLoaders: 1}
          },
          {
            loader: 'sass-loader'
          }
        ]
      },

      // Image loader
      {
        test: /\.(jpe?g|png|webp|gif|svg|ico)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'images/',
              name: '[name].[ext]',
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-mozjpeg')({
                  progressive: true
                }),
                require('imagemin-pngquant')({
                  floyd: 0.5,
                  speed: 5
                }),
                require('imagemin-webp'),
                require('imagemin-svgo')
              ]
            }
          }
        ]
      },

      // Font loader
      {
        test: /\.(ttf|woff2|woff)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },

  plugins: [
    ...getHTMLPlugins('src/views'),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      fallback: 'style-loader',
      use: [{ loader: 'css-loader', options: { minimize: isProd } }],
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/images',
        to: 'images'
      }
    ])
  ],

};