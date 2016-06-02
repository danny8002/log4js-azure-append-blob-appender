# log4js-azure-append-blob-appender

[![Build Status](https://travis-ci.org/danny8002/log4js-azure-append-blob-appender.svg?branch=master)](https://travis-ci.org/danny8002/log4js-azure-append-blob-appender)

Write log to Microsoft Azure Storage (append blob) 

# You should known when use this appender

- if Azure Storage blob container do not exist, create it
- if Azure Storage blob do not exist, create it
- Check blob properties when writing text to the blob for the first time
- This appender will append EOL symbol for every write operation, so you can view log file line by line 
- By default, this appender use basic log4js layout


# Getting Started
## installation

```javascript
npm install log4js --save
npm install log4js-azure-append-blob-appender --save
```

## usage:
This appender is compitable with log4js configuration file. for example, in your log4js configuration file (log4js.cfg.json)

```javascript
{
    "appenders": [
        {
            "type": "console"
        },
        {
            "type": "log4js-azure-append-blob-appender",
            "category": "YOUR_CATEGORY",
            "azureStorageConnectionString": "DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT;AccountKey=YOUR_KEY",
            "container": "log4test",
            "appendBlob": "my.log",
            "layout": {
              "type":"basic"
            }
        }
    ],
    "replaceConsole": true
}
```
```javascript
    var log4js = require('log4js');
    var cfg = require("./log4js.cfg.json");
    log4js.configure(cfg);
    
    var log = log4js.getLogger("YOUR_CATEGORY");
    
    lg.debug("my msg", "data1");
    
```
# About Configuration
### Required configuration item
- **type** <br/>
- **azureStorageConnectionString** <br/>
- **container** <br/>
- **appendBlob** <br/>

# Best Practice about this appender
Write json (instead of plain text) as every log line, so you can do more things (eg. use HDInsight to analyse log)
- [log4js-json-layout](https://www.npmjs.com/package/log4js-json-layout)

# Update log