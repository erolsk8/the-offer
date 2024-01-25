# Coding Challenge: Drei Austria - Erol

This is a solution to the Coding Challenge, made as part of the recruitment process for the Web Front End Developer position.

### Requirements

#### API Server

Use https://github.com/danielgtaylor/apisprout docker image to quickly setup the API server:

1. install Docker from https://www.docker.com/
2. pull the image: `docker pull danielgtaylor/apisprout`
3. start the API server: `docker run -p 8000:8000 -v /Users/andr/Desktop/api.yaml:/api.yaml danielgtaylor/apisprout /api.yaml`, replacing `/Users/andr/Desktop/api.yaml` with the according full path to api.yaml on your machine. 
4. Call the API from your frontend app: "http://localhost:8000/offers"

#### Node.js

Ensure that [Node.js](https://nodejs.org/) is installed. The required Node.js version is specified in the `.nvmrc` file. Using nvm ([Node Version Manager](https://github.com/nvm-sh/nvm)) allows running `nvm use` to switch to the correct version.

#### Dependencies

Run `npm install` in the project root directory to install all necessary dependencies.

### Available Scripts

Following scripts are available:

* `npm run dev`
  - Launches the webpack development server with hot reloading enabled.
  - Use this command for development purposes.
  - Served at http://localhost:8001.

* `npm run start`
  - Handy shortcut to run `build` and `serve` scripts (described below).

* `npm run build`
  - Builds the website for production to the `dist` folder. 
  - It uses production mode and optimizes the build for the best performance. The build is minified, and the filenames include the hashes.

* `npm run serve`
  - Starts a Node.js server to serve the production build from the `dist` folder. 
  - Useful for testing the production build locally.
  - Served at http://localhost:8002.

* `npm run lint`
  - Runs ESLint and Stylelint to check for any linting errors in JS/TS and CSS/SCSS files. 
  - This script helps maintain code quality and consistency.

* `npm run prepare`
  - Runs automatically on `npm install`, so manual calls are needed when making Husky changes.
  - Installs Husky, setting up Git hooks (pre-commit) to automate tasks like linting before commits. 
  - This ensures that only quality code is committed to the repository.
  - Currently configured to run `npm run lint` before Git commit.
