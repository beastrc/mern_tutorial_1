# Legably Production

Legably production site

## Development Environment Setup

### Tools Required

- [Git](https://git-scm.com/)
- [React](https://reactjs.org) - version 15.02 is used
- [NodeJS](https://nodejs.org/en/) - version 8.x LTS (the latest 8.x LTS available known as `lts/carbon`)
  - It is recommended to use [`nvm`](https://github.com/creationix/nvm) to manage your NodeJS installation and versions. If you are not on a \*nix based environment, and are required to develop in a Windows environment [`nvm-windows`](https://github.com/coreybutler/nvm-windows) is a good alternative.
- [MongoDB](https://www.mongodb.com/download-center/community) - version 4.x is currently used by Legably
- UI
  - [Bootstrap](https://getbootstrap.com/docs/3.3/) - v3.3.7
  - [Fontawesome](https://fontawesome.io) - v4.7

### Setup with Homebrew

If you are developing on Mac OS X, we recommend installing the required tools with [Homebrew](https://brew.sh/) by running:

- `brew install git`
- `brew install nvm`
- `brew install mongodb`

Run `brew services start mongodb` to start mongodb after install.

### First Time Environment Setup

1. Clone repository:

   \$ git clone git@github.com:legably/production.git

1. Install node package dependencies:

   \$ npm ci

   - Note we prefer [`npm ci`](https://docs.npmjs.com/cli/ci.html) over `npm install` as it is more strict about following the `package-lock.json` file and also is quicker.

1. Configure dotenv file

   - Create the `.env` file using the template:
     - \$ `cp .env.template .env`
   - Edit the `.env` file with your appropriate ENV variable options:
     - \$ `vim .env`
   - Minimally required ENV keys that need to be defined to run locally include the following:
     - DB_HOST, DB_NAME, DB_PORT
     - SERVER_HOST, SERVER_PORT
   - In development, you can comment out the `DB_USER` and `DB_PASS` if your local MongoDB instance doesnt require user auth

### Daily Development Process

1. Start MongoDB locally if not already running:

   \$ mongod --config /path/to/your/mongo.conf

1) Start the server

   \$ npm run start

1) View the development environment website at [`http://localhost:3001`](http://localhost:3001)
