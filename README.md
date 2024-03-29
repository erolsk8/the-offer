# The Offer

Demo: https://offer.erl.pw

Tiny demo/example showcasing:
* Simple web app built using TypeScript and SCSS consisting of:
  - Header and Footer with random/dummy links
  - Section with search field making requests and showing results 
    + with basic address field validation
    + there is simulated 1-3 seconds delay
    + backend API returns random results (0, 1, or 2). 
* A few tests: 
  - unit (Jest) 
  - e2e (Playwright)
* Development environment 
  - dev server (Webpack)
  - basic server to host distributed version (Node.js) 
  - linting and pre-commit validation (ESLint, Stylelint, Prettier...)
  - deployment to GitHub Pages

### Requirements

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

* `npm run test`
  - Runs Jest unit tests.

* `npm run e2e`
  - Runs e2e tests in background (headless).
  - Requires running `build` and `serve` commands first.

* `npm run e2e:ui`
  - Starts e2e UI where tests can be executed manually, watched, debugged, etc.
  - Requires running `build` and `serve` commands first.
  
* `npm run lint`
  - Runs ESLint and Stylelint to check for any linting errors in JS/TS and CSS/SCSS files. 
  - This script helps maintain code quality and consistency.

* `npm run prepare`
  - Runs automatically on `npm install`, so manual calls are needed when making Husky changes.
  - Installs Husky, setting up Git hooks (pre-commit) to automate tasks like linting before commits. 
  - This ensures that only quality code is committed to the repository.
  - Currently configured to run `npm run lint` before Git commit.
