# winston-logger-elk
Integration of winston-logger and ELK for log management,analysis and for lot other purposes. For complete setup instructions follow [ELK stack](https://www.elastic.co/what-is/elk-stack).

Maximum configuration is already provided in the project but as per the requirements the configuration for logstash( codecs, input and output etc.) can be modified and as well as for winston formats and transports.

The ELK setup is done with the help of docker-compose which pulls the images and run the containers in docker-engine.

Getting set up :+1:
## Required software/tools
```
1. Node.js
2. Git
3. VS Code Editor
4. docker & docker-compose
```

## Run Project
```
1. git clone <git-repo-url>
2. cd <project-folder>
3. npm i
# start in local
4. npm start
# start conatiners in docker
5. npm run dc:up
# stop containers in docker
6. npm run dc:down
```
