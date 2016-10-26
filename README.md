# MEANSTACK

Basic structure for develop web application with Angular 2, ExpressJS, Socket.io and Mongoose.

## Highlights

- Angular 2.0.0 final support (with `NgModule` -type of modules)
- Webpack 2 
- TypeScript 2
- Styles with [SCSS](http://sass-lang.com/)
- MongoDB

Note! The Webpack 2 and TypeScript 2 are on beta phase.

## Prequisities

The projects needs that you have the following things installed:

- [NodeJS](https://nodejs.org/) (version 6 or greater, tested with 6.3.1)
- [MongoDB](https://www.mongodb.com/) (tested with version 3.2.6)

### Installing prequisities on Mac OS X (With Homebrew)

You can install [Homebrew](http://brew.sh/) with this command:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

#### NodeJS

You can install NodeJS simply by giving command:
```
brew install node
```

#### MongoDB

You can install MongoDB simply by giving command:
```
brew install mongodb
```

You can start MongoDB service by gibing command:
```
brew services start mongodb
```


## Installation

### Install node modules and type definitions

```
npm install
```

## Local development

### Build

```
npm run build
```

### Start web server

```
npm start
```

### Open local app in browser

[http://localhost:5000/](http://localhost:5000/)

## Configuration

- `MONGODB_URI=mongodb://user:pass@hostname:port/database` MongoDB URI (you can leave empty if you use MongoDB on localhost)

For local development, you can save the environment to `.env` -file on project root:

```
MONGODB_URI=mongodb://user:pass@hostname:port/database
```
