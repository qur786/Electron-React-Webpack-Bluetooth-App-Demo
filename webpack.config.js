/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function RendererProcessConfigGenerator(env) {
  return {
    entry: "./src/renderer/index.tsx",
    target: Boolean(process.env.WEBPACK_SERVE) == true ? undefined : "electron-renderer",
    mode: env.production === true ? "production" : "development",
    devtool: "eval", // Ref: https://webpack.js.org/configuration/devtool/#devtool | Other options are not working in "production" mode
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                onlyCompileBundledFiles: true, // https://github.com/TypeStrong/ts-loader#onlycompilebundledfiles
                compilerOptions: { outDir: "dist/tsc/renderer" },
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
      static: path.resolve(__dirname, "public"),
      hot: true,
      open: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    output: {
      path: path.resolve(__dirname, "dist/renderer"),
      filename: "bundle.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "React Bluetooth Webpack Electron App",
        template: path.join(process.cwd(), "./src/renderer/index.ejs"),
      }),
    ],
  };
}

function MainProcessConfigGenerator(env) {
  return {
    entry: "./src/main/index.ts",
    target: "electron-main",
    mode: env.production === true ? "production" : "development",
    devtool: env.production === true ? undefined : "eval",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                onlyCompileBundledFiles: true, // https://github.com/TypeStrong/ts-loader#onlycompilebundledfiles
                compilerOptions: { outDir: "dist/tsc/main" },
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    output: {
      path: path.resolve(__dirname, "dist/main"),
      filename: "bundle.js",
    },
  };
}

const ConfigGenerator = (env) => {
  let output = [RendererProcessConfigGenerator(env)];
  if (Boolean(process.env.WEBPACK_SERVE) !== true) {
    output = [...output, MainProcessConfigGenerator(env)];
  }
  return output;
};

module.exports = ConfigGenerator;
