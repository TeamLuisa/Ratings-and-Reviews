# FEC

1. After created new repo, go to terminal git clone the repo, then open it in VSCODE

2. Create folders:
   1. client:
      1. dist:
          1. bundle.js (for babel webpack)
          2. index.html
          3. style.css
      2. src:
          1. index.js (import REACT and REACTDOM here)
          2. components
   2. server:
       1. index.js

3. Terminal:

		 1. Create package.json:
						$ npm init -y (set everything default)
										OR
						$ npm init (able to add details)
						>>> now see package.json

		 2. Install webpack

						1. In terminal run: $ npm install webpack webpack-cli --save-dev (locally)


						2. In package.json add:
										"scripts": {
											"build": "webpack --config webpack.config.js"
										}

						3. In terminal run:  $ npm run build
									 >>> should see webpack.config.js

 4. Hook babel using webpack:

		1. $ npm install -D babel-loader @babel/core @babel/preset-env webpack
					>>> should see @babel core env react under depencies in package.json

		2. in webpack.config.js, add the babel-loader to the list of modules
						module: {
							rules: [
								{
									test: /\.m?js$/,
									exclude: /(node_modules|bower_components)/,
									use: {
										loader: 'babel-loader',
										options: {
											presets: ['@babel/preset-env']
										}
									}
								}
							]
						}

                                             ---------------OR-----------------

						module: {
						rules: [
							{
								test: /\.(js|jsx)$/,
								exclude: /node_modules/,
								use: {
									loader: "babel-loader"
								}
							}
						]
					}

5. Enabling Babel to transpile React:

		 1. $ npm install --save-dev @babel/preset-react

		 2. add below to package.json:
						"babel": {
							"presets": [
								"@babel/preset-react",
								"@babel/preset-env"
							]
						}

 6. Now in webpack.config.json:

				const path = require('path');
				const SRC_DIR = path.join(__dirname, './client/src');
				const DIST_DIR = path.join(__dirname, './client/dist');

				module.exports = {
					mode: 'development',
					entry: `${SRC_DIR}/index.js`,
					devtool: 'eval-source-map',
					output: {
						filename: 'bundle.js',
						path: DIST_DIR
					},
					module: {
						rules: [
							{
								test: /\.(js|jsx)$/,
								exclude: /node_modules/,
								use: {
									loader: "babel-loader"
								}
							}
						]
					}
				};

7. Install React ReactDom:
       $ npm install react react-dom
			             OR
			 $ npm install --save react react-dom


			 In src/index.js:
							import React from 'react';
							import ReactDOM from 'react-dom';

							ReactDOM.render(
								<h1>Hello, world!</h1>,
								document.getElementById('root')
							);

8. Install nodemon:
          $ npm install --save-dev nodemon


9. Add scripts in package.json:
						"scripts": {
							"test": "echo \"Error: no test specified\" && exit 1",
							"watch": "webpack -w",
							"start": "nodemon server/index.js"
						}

10. Double check webpack.config.json with above example
    check package.json with correctscripts,
		add gitignore,
		and then download other tools (express, axios, etc) in terminal based on needs.


# SDC
1. $ npm init -y
2. - $ npm install --save-dev nodemon
   - in package.json add: "scripts": {
			    "start": "nodemon ./server/index.js"
			  }
3. - $ npm install eslint --save-dev
   - $ npx eslint --init
   - $ npx install-peerdeps --dev eslint-config-airbnb-base  // for airbnb library
   - in .eslintrc.json add:
			     "extends": [
				"airbnb-base/legacy"
			     ]
4. - $ touch ~/.gitignore
   -  $ git config --global core.excludesFile ~/.gitignore

5. - $ brew install postgres
   - $ npm install pg

6. To iniate API server that interacts with DB
   - $ npm install pq-promise
	 - $ npm install express