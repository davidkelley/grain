# Node-CLI Bolierplate
> A simple bolierplate for Node CLI applications.

## Features
- ES6/7 support via ``babel``
- Mocha/Chai setup with support for ES6/7 in test code.
- Code coverage via ``nyc``
- Uses ``eslint`` and ``babel-eslint``
- Watches/restarts project using ``nodemon`` on file changes.

## Project Structure
```js
.
|-- dist/                 // Transpiled production code (npm run compile)
|   |-- index.js          // package.json main points here
|-- src/                  // Application source files
|   |-- index.js          // Application entry point
|-- test/                 // Test files
    |-- data/             // A directory for test data
    |-- regression-tests/ // Regression tests
    |-- smoke-tests/      // Smoke tests
    |-- unit-tests/       // Unit tests
    |-- mocha.init.js     // Setups up test globals and mocha testing
```

## NPM Commands

| Command                     | Description |
| :-------------------------- | :---------- |
| **npm run start**           | Runs *dist/* with ``NODE_ENV`` set to ``production`` |
| **npm run dev**             | Runs *src/* with ``NODE_ENV`` set to ``development`` |
| **npm run watch**           | Starts and watches *src/index* with ``NODE_ENV`` set to ``development`` with *nodemon* |
| **npm run test**            | Runs all tests (unit, smoke, and regression) |
| **npm run test:unit**       | Runs only unit tests |
| **npm run test:regression** | Runs only regression tests |
| **npm run test:smoke**      | Runs only smoke tests |
| **npm run lint**            | Runs ``eslint`` against the *src/* directory |
