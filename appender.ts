/// <reference path="typings/main.d.ts" />

import log4js_ = require("log4js");
import azure_ = require("azure-storage");

import assistant_ = require("./assistant");

export interface AzureAppendBlobAppenderOptions extends log4js_.AppenderConfigBase {
  /**
   * Azure Storage connection string. for example:
   * DefaultEndpointsProtocol=https;AccountName=xxx;AccountKey=yyy
   */
  azureStorageConnectionString: string;

  /**
   * Azure Storage - Blob container name. if not exist, create it.
   */
  container: string;
  /**
   * append blob name. if not exist, create it.
   */
  appendBlob: string;
}



/**
 * Azure append-blob Appender writing the logs to a Azure Storage append-blob file. 
 * // TODO: auto rolling if https://azure.microsoft.com/en-us/documentation/articles/storage-scalability-targets/
 * 
 * @param file file log messages will be written to
 * @param layout a function that takes a logevent and returns a string
 *   (defaults to basicLayout).
 * @param logSize - the maximum size (in bytes) for a log file,
 *   if not provided then logs won't be rotated.
 * @param numBackups - the number of log files to keep after logSize
 *   has been reached (default 5)
 * @param compress - flag that controls log file compression
 * @param timezoneOffset - optional timezone offset in minutes (default system local)
 */
export function appender(
  cstr: string,
  container: string,
  blobName: string,
  layout: log4js_.Layout): log4js_.Appender {

  var blob = azure_.createBlobService(cstr);

  blob.createContainerIfNotExists(container, function (error, result, response) {
    if (error) throw error;
  });

  var writer = new assistant_.AzureAppendBlobAssistant(blob, container, blobName);

  return function azureAppendBlobWriter(evt: log4js_.LogEvent): void {
    if (evt == null) return;

    var text: string;
    try {
      text = layout(evt);
    } catch (e) {
      throw (e instanceof Error) ? e : new Error(e);
    }

    writer.writeText(text, function (e, result, response) {
      if (e) throw e;
    });
  }
}

export var name = "azure-append-blob-appender";

export function configure(config: AzureAppendBlobAppenderOptions): log4js_.Appender {

  if (config == null || typeof config !== 'object') {
    throw new Error('Missing required configuration');
  }

  function validateField(name: string, value: string) {
    var _v = value;
    if (_v == null
      || typeof _v !== 'string'
      || _v.length <= 0) {
      throw new TypeError("[" + _v + "] must be a valid string but get " + config.azureStorageConnectionString);
    }
  }

  validateField("azureStorageConnectionString", config.azureStorageConnectionString);
  validateField("container", config.container);
  validateField("appendBlob", config.appendBlob);

  var layout: log4js_.Layout;

  if (config.layout) {
    layout = log4js_.layouts.layout(config.layout.type, config.layout);
  }

  if (layout == null) layout = log4js_.layouts.basicLayout;

  return appender(
    config.azureStorageConnectionString,
    config.container,
    config.appendBlob,
    layout);
}

export function shutdown(cb: (error: Error) => void): void {
  return cb(null);
}

function loadSelfModule(): any {
  var file = __filename;
  return require(file);
}

(function overwriteLog4jsConfigure() {

  var oldLoader = log4js_.loadAppender;

  log4js_.loadAppender = function (
    appenderType: string,
    appenderModule: log4js_.AppenderModule): void {
    if (appenderModule == undefined && appenderType === module.exports.name) {
      appenderModule = loadSelfModule();
    }
    return oldLoader(appenderType, appenderModule);
  }
})();