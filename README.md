# Vacancies

This project lets users create and maintain Vacancies

It allows users to set these properties:

* Title to identify the vacancy.
* Content to elaborate more on the description if the user feel like it can help on finding the appropriate worker. (optional field)
* Frequency to hire. It has predefined values that will allow to filter out results in the future. When creating or updating a vacancy, there is a list with most common frequency options to select.
* Fulfilled to be checked once someone is hired for the vacancy. Vacancies with this option marked doesn't appear to other people. Users can also reactivate a vacancy unchecking this option.

Permissions:

* Guests are allowed to visit, list and view existing vacancies.
* Users are allowed to create, update and delete their own vacancies, including the fulfilled ones. They can also view not fulfilled vacancies created by other users.
* Administrators are able to create vacancies and update/delete vacancies from anyone if necessary.

## Prerequisite Technologies

* [Git](https://git-scm.com/downloads)
* [MongoDB](https://www.mongodb.org/downloads)
* [Node 6.x](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/get-docker)
* npm 3.x ( or yarn)

## Getting Started

```
git clone https://github.com/danielcacheta/vacancies.git
cd vacancies
docker container run --rm -it -v $PWD:/usr/src/app -w /usr/src/app node npm install
npm install -g bower
```
Project running options:
```
npm start
```
```
docker-compose up
```

If all the packages and modules installed successfully, your default web browser will open and you can see the default Vacancies application at `http://localhost:3000`.

## Testing The Application
You can run the full test suite with the test task:

```bash
$ npm test
```
This will run both the server-side tests (located in the `app/tests/` directory) and the client-side tests (located in the `public/modules/*/tests/`).

To execute only the server tests, run the test:server task:

```bash
$ npm run test:server
```

To execute only the server tests and run again only changed tests, run the test:server:watch task:

```bash
$ npm run test:server:watch
```

And to run only the client tests, run the test:client task:

```bash
$ npm run test:client
```

## Built With

* [MEAN.JS](https://github.com/meanjs/mean) - The web framework used

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
