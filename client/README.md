This is my Audio Hosting Application

# Tech Stack
Front-end: React.js
Back-end: Node.js and Express.js
Database: MongoDB

# Instructions on running the Audio Hosting application:
1. Load docker images into local docker environment, specifying the path to respective .tar files:
`docker load -i /path/to/audio-hosting-app-frontend.tar`
`docker load -i /path/to/audio-hosting-app-backend.tar`
`docker load -i /path/to/mongo.tar`

2. Check that images correspond to those specified in docker-compose.yml file:
`docker images`

3. Start containers and run application:
`docker-compose up`

4. Access the application at http://localhost:3000

5. Stop application:
`docker-compose down`
