# task-management-mern-app

MERN Application for Task Management

<a name="readme-top"></a>

<!--
*** READ ME for Task Management
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Task Management with MERN</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

A Task Management app build in MERN (MySQL, Express, React, Node). App have Dasboard and Kanban board for taks overview. Using Kanban user can manager their tasks by using Drag and Drop.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This is a MERN project. Used <a href="https://sequelize.org/">Sequelize</a> ORM for MySQL.

- [![Mongo][MySQL]][MySQL-url]
- [![Express][Express.js]][Express-url]
- [![React][React.js]][React-url]
- [![Node.js][Node.js]][Node-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

You should have <a href="https://nodejs.org/en/download">nodejs</a> installed in your system. Nodejs version should be at least 20 or greater.

Install NPM with the following command (-g to set is globally - preferrable)

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

Follow below steps to get the project up and running in your local system.

#### Repo Setup

1. Clone the repo

   ```sh
   git clone https://github.com/kalyanb-iprogrammer/task-management-mern-app.git
   cd task-management-mern-app
   ```

2. Create your feature branch from develop
   ```sh
   git checkout -b <your_feature_branch_name>
   ```

##### Backend Setup

    Technologies used
        . Node
        . Express
        . JWT with Passport
        . Sequelize as MySQL ORM
        . Winston as logger

1. Change your directory
   ```sh
   cd backend
   ```
2. Create `.env` file
   ```sh
   touch .env
   ```
3. Edit `.env` file

   ```js
    PORT=8888
    CLIENT_BASE_URL='http://localhost:8081'
    LOG_RETENTION_TIME='30d'
    JWT_SECRET='your_hwt_secret'
    MYSQL_HOST= "your_mysql_host"
    MYSQL_USER= "your_mysql_user"
    MYSQL_PASSWORD= "your_mysql_password"
    MYSQL_DBNAME= "your_database_name"
   ```

4. Install all packages
   ```sh
   npm i
   ```
5. Run backend server
   ```sh
   npm start
   ```
   Server will start on port 8888 if process.env.PORT is not provided.

##### Frontend Setup

    Technologies used
        . React
        . Redux
        . ChartJS

1. Install nvm and install node version 20 with this command

   ```sh
   nvm install 20
   nvm use 20
   ```

2. Open another tab in terminal . Switch back to project root directory and execute below command
   ```sh
   cd frontend
   ```
3. Install all packages

   ```sh
   npm i
   ```
3. Create `.env` file
   ```sh
   touch .env
   ```
4. Edit `.env` file

   ```js
    VITE_SERVER_URL=http://localhost:8888

5. Run client
   ```sh
   npm run dev
   ```
   Client will start on port 8081.

# SonarQube Code Quality Summary
If you are interested in generating a summary for code quality, please follow these instructions:

## Setup Local SonarQube
Download and setup SonarQube from [here](https://www.sonarsource.com/products/sonarqube/downloads/).

## Start Local SonarQube Server
First, navigate to the SonarQube installation directory, and then run the start script in the `bin` folder for your operating system.


## Using The SonarQube UI:
Open your browser and go to http://localhost:8081, log in with the default credentials ("admin" and "admin"). You'll be prompted to change the password on first login.

Create a new project in SonarQube:

- Go to "Projects" -> "Create a local project".
- Create a project with the name "Task Management", and key "task-management".
- In the "Analyze your project" step, select "main" branch.
- Use the "global setting" for "Choose the baseline for new code for this project".

## Generate The SonarQube Token
Go to your user account (top-right corner) -> "My Account" -> "Security" and generate a new Project Analysis Token for the project that was just created, and save it securely. This will be used to run SonarQube.

Open `/sonar-project.properties` in the project, and replace `<SONAR_TOKEN>` with the token that was generated, and save the file.

## Run SonarQube
In order to run the analysis, first generate the coverage reports:
```bash
yarn coverage
```

Then, run SonarQube with the following:

```bash
yarn sonar
```

This in-built command will generate the coverage report first automatically, and the results will be visible in the SonarQube UI at http://localhost:8081/dashboard?id=task-management. Note that this can URL change based on any custom configurations you have made, please refer to the terminal for the final URL.

<!-- Screenshots -->
<div align="center">
  <h4 align="center">
   Here are some screenshots of the project:
  </h4>
    <img src="frontend/public/screenshot/Screenshot from 2024-08-26 13-12-22.png" alt="Logo" width="250" height="200">
    <img src="frontend/public/screenshot/Screenshot from 2024-08-26 13-12-46.png" alt="Logo" width="250" height="200">
    <img src="frontend/public/screenshot/Screenshot from 2024-08-26 13-14-05.png" alt="Logo" width="250" height="200">
    <img src="frontend/public/screenshot/Screenshot from 2024-08-26 13-14-27.png" alt="Logo" width="250" height="200">
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MySQL]: https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/
