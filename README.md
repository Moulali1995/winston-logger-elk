# winston-logger-logstash
Combination of winston-logger and logstash for log management,analysis and for lot other purposes. For complete setup follow [ELK stack](https://www.elastic.co/what-is/elk-stack).

The project doesn't use logstah custom transport rather it uses a independent module [logstash-client](https://www.npmjs.com/package/logstash-client) to send the log messages to logstash.

you can ignore the above method and can add your ow custom transport to send the logs to logstash using the winston transports.

Getting set up :+1:
## Required software/tools
```
1. Node.js
2. Git
3. VS Code Editor
4. elk stack (Logstash)
```

## Run Project
```
1. git clone <git-repo-url>
2. cd <project-folder>
3. npm i
4. npm start
```
