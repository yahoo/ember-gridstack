# How To Contribute

This repo is a yarn workspace with two packages:

- `ember-gridstack/` – the v2 addon (built with rollup)
- `test-app/` – the test suite and the demo published to gh-pages

## Installation

- `git clone https://github.com/yahoo/ember-gridstack.git`
- `cd ember-gridstack`
- `yarn install`

## Linting

- `yarn lint`
- `yarn lint:fix`

## Building the addon

- `yarn build`

## Running tests

- `yarn test` – Lints and runs the test suite on the current Ember version
- `yarn test:ember` – Runs the test suite on the current Ember version
- `yarn test:ember-compatibility` – Runs the test suite against multiple Ember versions

## Running the demo application

- `yarn start` – Watches the addon and serves the test-app
- Visit the demo at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
