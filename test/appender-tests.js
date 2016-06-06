var log4js = require('log4js');
var assert = require('assert');


function getCfg() {
    var cstrKey = "TEST_AZURE_STORAGE_CS";
    var containerKey = "TEST_AZURE_CONTAINER";
    var blobKey = "TEST_AZURE_APPEND_BLOB";

    var v = {
        "type": "log4js-azure-append-blob-appender",
        "category": "RunService2",
        "azureStorageConnectionString": "DefaultEndpointsProtocol=https;AccountName=satoriportal;AccountKey=grK05JBcKN9ucKR7XCPjyMv7GqWsdR3hhnE2DSyUbWmL5lsAF6F7KGTY7a0PaL/4ZieQRVm6076Uw7p3E6XcCQ==",
        "container": "log4test",
        "appendBlob": "my.log"
    }

    var env = process.env;

    if (env[cstrKey]) v.azureStorageConnectionString = env[cstrKey];
    if (env[containerKey]) v.container = env[containerKey];
    if (env[blobKey]) v.appendBlob = env[blobKey];

    return v;
}


var name = "log4js-azure-append-blob-appender";

var appenderModule = require("../../" + name);

describe("test-azure-append-blob-appender", function () {
    var cfg = null;
    var appender = null;

    before(function (done) {
        cfg = getCfg();

        log4js.loadAppender(name, appenderModule);

        var ctor = log4js.appenders[name];

        appender = ctor(cfg.azureStorageConnectionString, cfg.container, cfg.appendBlob, log4js.layouts.basicLayout);

        log4js.addAppender(appender);
        
        done();
    })

    it("write log to azure", function (done) {
        assert.notEqual(appender, null);

        appender.callback = function (e, r, res) {
            if (e) {
                assert.equal(e, null);
                done();
            } else {
                assert.notEqual(r, null);
                done();
            }
        };

        var log = log4js.getLogger();
        log.debug("test data2", "data1");

        done();
    })
});







