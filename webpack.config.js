"use strict"

const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const ManifestPlugin = require("webpack-manifest-plugin")
const PackageJson = require("./app.json")

module.exports = function (env) {
    const nodeEnv = env.NODE_ENV
    const isEnvProduction = nodeEnv === "production" ? true : false

    return {
        mode: nodeEnv,
        bail: isEnvProduction,
        devtool: PackageJson.devtool,
        entry: PackageJson.entry,
        output: {
            path: path.resolve(__dirname, PackageJson.buildDirectory),
            filename: `${PackageJson.assetsFolder}/${PackageJson.scriptFolder}/[name]~${PackageJson.version}.js`,
            chunkFilename: `${PackageJson.assetsFolder}/${PackageJson.scriptFolder}/[name]~${PackageJson.version}.chunk.js`,
            publicPath: PackageJson.publicPath,
            chunkLoadingGlobal: `jsonp${PackageJson.name.replace(" ", "")}`,
            globalObject: "this"
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        },
                        sourceMap: false
                    }
                }),

                new OptimizeCssAssetsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false,
                    minimizerOptions: {
                        preset: [
                            "default", {
                                discardComments: {
                                    removeAll: true
                                }
                            }
                        ]
                    }
                })
            ],
            splitChunks: {
                chunks: "initial",
                name: "commons",
                maxSize: PackageJson.maxChunkSize,
                minChunks: 1,
                hidePathInfo: true
            },
            runtimeChunk: {
                name: entryPoint => `runtime-${entryPoint.name}`
            }
        },
        resolve: {
            modules: [__dirname, "src", "node_modules"],
            extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: require.resolve("babel-loader"),
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: isEnvProduction
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        }, {
                            loader: "css-loader"
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: require.resolve("style-loader")
                        }, {
                            loader: require.resolve("css-loader")
                        },
                        {
                            loader: require.resolve("less-loader"),
                            options: {
                                lessOptions: {
                                    modifyVars: {
                                        "primary-color": "#6A70B8"
                                    },
                                    javascriptEnabled: true
                                }
                            }
                        }
                    ]
                },
                {
                    loader: require.resolve("file-loader"),
                    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.css$/, /\.less$/],
                    options: {
                        name: `${PackageJson.assetsFolder}/${PackageJson.mediaFolder}/[name]~${PackageJson.version}.[ext]`
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin(Object.assign({}, {
                template: PackageJson.htmlLocation,
                title: `${PackageJson.name} - v${PackageJson.version}`,
            }, isEnvProduction && {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            })),
            !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin({
                filename: `${PackageJson.assetsFolder}/${PackageJson.cssFolder}/[name]~${PackageJson.version}.css`
            }),
            PackageJson.manifest.generate && new ManifestPlugin.WebpackManifestPlugin({
                fileName: PackageJson.manifest.filename,
                publicPath: PackageJson.publicPath,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce((manifest, file) => {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);
                    const entrypointFiles = entrypoints.main.filter(
                        fileName => !fileName.endsWith('.map')
                    );

                    return {
                        files: manifestFiles,
                        entrypoints: entrypointFiles,
                    };
                }
            }),
            PackageJson.ignoreMoment && new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ].filter(Boolean),
        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        devServer: {
            port: PackageJson.port,
            open: true,
            historyApiFallback: true
        }
    }
}
