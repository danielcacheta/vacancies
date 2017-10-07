# Vacancies

This project lets users create and maintain Vacancies

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
npm start
```
If all the packages and modules installed successfully, your default web browser will open and you can see the default Vacancies application at `http://localhost:3000`.

## Built With

* [MEAN.IO](https://github.com/linnovate/mean) - The web framework used

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
