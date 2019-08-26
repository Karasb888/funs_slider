/* eslint-disable global-require */
const path = require('path');
const glob = require('glob');
const { argv } = require('yargs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const distPath = path.join(__dirname, '/public');

const config = {
    entry: {
        main: './src/js/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: distPath,
        publicPath: ''
    },
    module: {
        rules: [{
            test: /\.html$/,
            use: 'html-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader'
            }]
        }, {
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            loader: 'eslint-loader'
        }, {
            test: /\.css$/,
            include: /node_modules/,
            loaders: ['style-loader', 'css-loader']
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            isProduction ? require('cssnano') : () => {},
                            require('autoprefixer')({
                                browserlist: ['last 2 versions']
                            })
                        ]
                    }
                },
                'sass-loader'
            ]
        }, {
            test: /fonts[\\/].+\.(eot|svg|ttf|woff|woff2|otf)$/i,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name][hash].[ext]'
                }
            }
        }, {
            test: /images[\\/].+\.(gif|png|jpe?g|svg)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'images/[name][hash].[ext]'
                }
            }, {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                        quality: 70
                    }
                }
            }
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        ...glob.sync('./*.html')
            .map((htmlFile) => new HtmlWebpackPlugin({
                filename: path.basename(htmlFile),
                template: htmlFile
            }))
    ],
    optimization: isProduction ? {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        inline: false,
                        drop_console: true
                    }
                }
            })
        ]
    } : {},
    devServer: {
        contentBase: distPath,
        port: 9000,
        compress: true,
        open: true
    }
};

module.exports = config;
