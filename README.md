# Webpack 5 SSR Plugin

## Key Features

- **Perform SSR Process During Development:** This Webpack 5 plugin facilitates Server-Side Rendering (SSR) during development, enabling efficient server-side rendering of your web applications.
  
- **Static Page Generation with React SSR:** Easily create static pages using React SSR (Server-Side Rendering) with the help of this plugin.

- **Versatile SSR Support:** This plugin is suitable for various SSR use cases, including SSR in Express with React Hydration on the frontend, making it adaptable to a wide range of applications.

## Usage

### Install
```
npm install webpackssrplugin
```

### Update webpack config
```
const WebpackSSRPlugin = require('webpackssrplugin');
...
plugins: [
    ...
    new WebpackSSRPlugin(),
    ...
]
...
```

### Use

In your HTML file, add the following tag to incorporate SSR into your application:

```html
<SSR src="./path/to/app/ssr.jsx" args="./path/to/ssr.args.js" wrapperClass="app" wrapperTag="div" />
```

This will:
* compile ```ssr.jsx``` using esbuild 
* pass the output from ```ssr.args.js``` to the default export function of ```ssr.jsx``` bundle as a parameter
* replace the ```<SSR />``` tag with the markup build this way

### Example
#### Basic Vanilla JS example.
* tag placed in the html file
```html
<SSR src="./src/components/component.ssr.js" args="./src/components/component.args.js" wrapperClass="mb-2 p-4 app" wrapperTag="aside" />
```
* source of ```component.ssr.js```
```js
const serverCall = async (args) => {
    return `<p>Hi ${args?.name ?? 'user'}!</p>`;
};

export default serverCall;
```
* source of ```component.args.js```
```js
exports.default = () => {
    return {
        name: `JOHN`,
    };
};
```
* html output that replaces the ```<SSR />```
```html
<aside class="mb-2 p-4 app" ><p>Hi JOHN!</p></aside>
```

#### React example with hydration
A bit more complex example that uses fetch to get data from an API and pass it to the component as props.

* tag placed in the html file
```html
<SSR src="./src/components/Page/page.ssr.jsx" args="./src/pages/index.args.js" wrapperClass="app" wrapperTag="div" />
```
* source of ```page.ssr.jsx```
```js
import React from 'react';
import {Page} from './components/Page';
import ReactDOMServer from 'react-dom/server';
import fetch from 'node-fetch';

const serverCall = async (args) => {
    const requestData = await fetch(args.dataAPI);
    const data = await requestData.json();

    return ReactDOMServer.renderToString(<Page {...args} data={data} />);
};

export default serverCall;

```
* source of ```component.args.js```
```js
exports.default = (envFile) => {
    require('dotenv').config({
        path: envFile,
    });

    return {
        dataAPI: `http://${process.env.APIHOST}${process.env.DATAAPI}`
    };
};
```
* html output that replaces the ```<SSR />```
```html
<div class="app">{<Page /> component SSR markup}</div>
```

### Plugin options
* ```ssrTagRegex``` - regex used to grab the tag to be replaced by the plugin. Default: 
```regex
/<SSR (.+?) \/>/g
```
* ```createDataProps``` - if set to true will add an additional atribute ```data-props``` to the output wrapper that will containt serilized arguments. Can be usefull for hydration. This can be overwritten by ```data-printdataprops="{true|false}"```. Defualt: ```false```
* ```verbose``` print additional debug output. Default: ```false```
* ```metaDisplay``` print esBuild metadata output. Default: ```false```
* ```metaFile``` store esBuild metadata output to file. Default: ```false```
* ```envFile``` this value will be passed as an argument to the default export from the file passed in args parameter. Can be used to require a different .env file depending on the type of build - development or production. Default: ```.env```

### &lt;SSR /&gt; tag attributes
* ```src``` - path to the input js file to bundle and SSR
* ```args``` - path to js file responsible for building the arguments
* ```spreadArgs``` - if true it will spread the output of args object to separate attributes
* ```esmFunction``` - when provided a function with that name will be called - this must me an async function from the export default. It also changes the bundle type from commonjs to esm if provided
* ```wrapperClass``` - class of the wrapper tag
* ```wrapperTag``` - tag type for the wrapper
* ```data-printdataprops``` - if true will print the data-props - it can overwrite createDataProps setting 

## Versions:
* 0.3.0 - major changes:
    * add option to pick output bundle format: ES or CommonJS
    * make it possible to not specify a wrapper around output html
    * make it possible to pass multiple arguments to the SSR functions via arguments
* 0.2.[5,6] - minor fixes
* 0.2.4 - add envFile setting
* 0.2.3 - minor fixes
* 0.2.2 - add metafile display and/or file generation for bundle
* 0.2.0 - add data-printdataprops attribute to override createDataProps for individual items 
* 0.1.2 - add args["_"], add verbose configuration option
* 0.1.1 - update docs
* 0.1.0 - fix naming conventionc, change chalk version
* 0.0.1 - initial version

## Donate 
If you find this piece of code to be useful, please consider a donation :)

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate?hosted_button_id=ZPSPDRNU99V4Y)