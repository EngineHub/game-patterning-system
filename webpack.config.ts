import path from "path";
import {Configuration, ProgressPlugin} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import merge from "webpack-merge";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

interface KnownEnv {
    WEBPACK_SERVE: boolean
}

const options: (env: KnownEnv) => Configuration = (env) => {
    const format = env.WEBPACK_SERVE ? '[name]' : '[name]-[contenthash]';
    const common: Configuration = {
        entry: './src/main.tsx',
        output: {
            filename: `${format}.js`,
            path: path.resolve(__dirname, 'dist'),
            assetModuleFilename: `${format}[ext][query]`,
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Game Patterning System | EngineHub",
            }),
            new FaviconsWebpackPlugin({
                logo: "./src/img/logo.svg",
                mode: "webapp",
                favicons: {
                    pixel_art: true,
                    icons: {
                        android: false,
                        appleIcon: false,
                        appleStartup: false,
                        coast: false,
                        yandex: false,
                        windows: false,
                        firefox: false,
                    },
                },
            }),
            new MiniCssExtractPlugin({
                filename: `${format}.css`,
            }),
            new ForkTsCheckerWebpackPlugin(),
            new ESLintWebpackPlugin(),
            new ProgressPlugin(),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.s[ca]ss$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        transpileOnly: true,
                    },
                },
            ],
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
            },
        },
        performance: {
            maxEntrypointSize: 512000,
        },
    };
    if (env.WEBPACK_SERVE) {
        return merge(common, {
            mode: 'development',
            devtool: 'eval-source-map',
            devServer: {
                static: './dist',
            },
        });
    } else {
        return merge(common, {
            devtool: 'source-map',
            mode: 'production',
        });
    }
};

export default options;
