var log4js = require('log4js');
var assert = require('assert');
var util = require("util");

function getCfg() {
    var ACCOUNT = "TEST_AZURE_STORAGE_ACCOUNT";
    var ACCESS_KEY = "TEST_AZURE_STORAGE_KEY";
    var CONTAINER_KEY = "TEST_AZURE_CONTAINER";
    var BLOB_KEY = "TEST_AZURE_APPEND_BLOB";

    var v = {
        "type": "log4js-azure-append-blob-appender",
        "category": "RunService2",
        "azureStorageConnectionString": "",
        "container": "log4jsappenderpackage",
        "appendBlob": "log4jsappenderpackage.log",
        "layout": {
            "type": "basic"
        }
    }

    var env = process.env;
    var account = env[ACCOUNT];
    if (account == null || typeof account !== 'string' || account.length <= 0) {
        throw new Error("Cannot get Azure Storage Account from process.env with Key=" + ACCOUNT);
    }

    var key = env[ACCESS_KEY];
    if (key == null || typeof key !== 'string' || key.length <= 0) {
        throw new Error("Cannot get Azure Storage Account from process.env with Key=" + ACCESS_KEY);
    }

    var container = env[CONTAINER_KEY];
    if (container == null || typeof container !== 'string' || container.length <= 0) {
        throw new Error("Cannot get Azure Storage Account from process.env with Key=" + CONTAINER_KEY);
    }

    var blobName = env[BLOB_KEY];
    if (blobName == null || typeof blobName !== 'string' || blobName.length <= 0) {
        throw new Error("Cannot get Azure Storage Account from process.env with Key=" + BLOB_KEY);
    }

    v.azureStorageConnectionString = util.format("DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s", account, key);

    v.container = container;
    v.appendBlob = blobName;

    return v;
}

module.exports.getCfg = getCfg;

module.exports.NAME = "log4js-azure-append-blob-appender";

module.exports.reloadModule = function () {
    var u = "../../" + module.exports.NAME;
    var name = require.resolve(u);
    delete require.cache[name];

    var appenderModule = require(u);
    return appenderModule;
}