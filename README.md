# DartScoreBoard

This project is a simple dart score board that allows you to keep track of your score while playing darts. It is a simple project that I created to learn more about Angular and Typescript.

## Features

- Add players
- Add scores
- Remove scores
- Sound when a player throws 180

## Build locally

To build this project locally, you need to have Node.js installed. You can download it from [here](https://nodejs.org/en/).

After you have installed Node.js, you can clone this repository and run the following commands:

```bash
npm install
```

Then build the project:

```bash
ng build
```

And finally run the project:

```bash
ng serve
```

The project will be available at `http://localhost:4200/`.

## Build with docker

You can also build this project with docker. To do so, you need to have docker installed. You can download it from [here](https://www.docker.com/).

After you have installed docker, you can clone this repository and run the following commands:

```bash
docker build -t dart-score-board .
```

Then run the docker image:

```bash
docker run -p 8080:80 dart-score-board
```
