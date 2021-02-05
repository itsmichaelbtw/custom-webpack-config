# Custom Webpack Config

A custom webpack configuration used without the CLI tool [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)

### `npm install`

Installs required dependencies used for a react environment

### `npm start`

Opens the app in development mode on localhost:3000. The browser will automatically open your app and reload if you make edits

The port can be changed in the `app.json` config

### `npm test`

Opens the app in a production mode on localhost 3000. This helps to identity production mode bugs that may not occur during development

### `npm build`

Bundles your app into a production ready folder. The default build location is `dist` which can be changed in the `app.json` config

The build is minified and is optimized for the best performance

### `app.json`

This config holds default values for your webpack configuration. Here you can change values to adjust accordingly to your desire

Name | Value | Description | Default
---- | ----- | ----------- | -------
name | String | The name of the website (this is also rendered inside the title tags) | "Custom Webpack Config"
publicPath | String | Specify the base path for all assets | "/"
buildDirectory | String | Output folder for the production build of your app | "dist"
entry | String | Default entry file for your app | "./index.js"
assetsFolder | String | Folder path for all assets once bundled | "assets"
scriptFolder | String | Folder path for JS, JSX, TS and TSX files | "js"
cssFolder | String | Folder path for all CSS files | "css"
mediaFolder | String | Folder path for JSON, PNG, JPEG, JPG and GIF files | "media"
manifest.generate | true or false | Whether or not to generate a manifest file | true
manifest.filename | String | Name of the manifest file | "manifest.json"
ignoreMoment | true or false | Whether to ignore the `moment.js` library commonly used by other dependencies | true
maxChunkSize | Number | A positive integer in bytes indicating when to split dependency chunks | 300000
devtool | eval or false [...more values](https://webpack.js.org/configuration/devtool/) | Control how devtools are used in your app | false
port | Number | Port used on localhost when in development | 3000

### `Caching`

Each and every file in your app uses a `contenthash` in order to optimize for browser caching, resulting in faster page loads on your website

### `Code Splitting`

The configuration will seperate main code from dependency code allowing for faster loads and caching of vendor files.

Vendor files are split every 200kb in order to optimize for chunk splitting and caching

### `Folder Structure`

You can use any folder structure you like. Your app isn't bound to a `src` directory. Just remember to update any values inside of `app.json` if you aren't using a `src` directory as HTML pages and other file types may not be found when bundled by Webpack

### `Extension Supports`

Supported file types which can be used in this config

**Note: These file types are only for files that are listed inside the `./src` directory. File types from external sources such as API's or CDN's can be anything**

* HTML
* CSS and MODULE.CSS
* LESS
* JSON
* JS and JSX
* TS and TSX
* PNG
* JPEG and JPG
* GIF

More file extensions will be added in the future

### `.babelrc`

Read babels guide on customizing its configuration file: [BabelRC Guide](https://babeljs.io/docs/en/config-files)

### `LESS Variables`

You can modify LESS variables inside the Webpack configuration. Remember to include the `.less` file somewhere in your app

```js
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
                        // insert less variables
                    },
                    javascriptEnabled: true
                }
            }
        }
    ]
```

The development server will need to be restarted
