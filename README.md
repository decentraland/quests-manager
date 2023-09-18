<p align="center">
  <a href="https://decentraland.org">
    <img alt="Decentraland" src="https://decentraland.org/images/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  Quests Manager
</h1>

A Decentraland dApp to handle all your Quest that you build for [Quests Service](https://github.com/decentraland/quests).

You can create, edit, update, deactivate and activate all your Quests using this Application through the [Decentraland SDK7 Commands](https://github.com/decentraland/js-sdk-toolchain).

## Setup

To start contributing, you should run:

```bash
$ npm i
```

And if you may want to have a local version of the Quests Service, you can go to [Quests Service](https://github.com/decentraland/quests) and follow the steps to have a one running locally.

Or if you want to use the deployed versions of the Quests Service, you can choose the environment through the URL, adding a search parameter: `?env=dev` or `?env=prod`.

To start the dApp, you should run;

```bash
$ npm start
```

And it'll run the application on localhost:8000.

## Usage

As it's mentioned, you can use the Quests Manager through the [sdk-commands pakcage](https://www.npmjs.com/package/@dcl/sdk-commands) by running:

```bash
$ npx @dcl/sdk-commands quests -m
```

or 

```bash
$ npx @dcl/sdk-commands quests --manager
```

This will open up a browser window with the Quests Manager.