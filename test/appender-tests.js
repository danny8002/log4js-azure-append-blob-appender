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


var NAME = "log4js-azure-append-blob-appender";

var appenderModule = require("../../" + NAME);

describe("normal-appender-ctor-test", function () {
    var cfg = null;
    var appender = null;
    var log = null;

    before(function (done) {
        cfg = getCfg();

        log4js.loadAppender(NAME, appenderModule);

        var ctor = log4js.appenders[NAME];

        appender = ctor(cfg.azureStorageConnectionString, cfg.container, cfg.appendBlob, log4js.layouts.basicLayout);

        log4js.addAppender(appender);

        log = log4js.getLogger();

        done();
    })

    it("write log to azure", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                console.log(util.inspect(e));
                assert.equal(e, null);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };


        log.debug("test data1", "data1");
    })

    it("write log to azure the second time", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                assert.equal(e, null);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };

        log.info("test data2", "data2");
    })

});

describe("normal-configure-test", function () {
    var cfg = null;
    var appender = null;
    var log = null;

    before(function (done) {
        cfg = getCfg();

        var appender = appenderModule.configure(cfg);

        log4js.addAppender(appender);

        appender = log4js[NAME];

        log = log4js.getLogger();

        done();
    })

    it("write log to azure", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                console.log(util.inspect(e));
                assert.equal(e, null);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };

        log.debug("test data1", "data1");
    })

    it("write log to azure the second time", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                assert.equal(e, null);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };

        log.info("test data2", "data2");
    })

});

describe("normal-log4js-configure-test", function () {
    var cfg = null;
    var appender = null;
    var log = null;

    before(function (done) {
        cfg = getCfg();

        log4js.configure({ "appenders:": [cfg] });

        // var appender = appenderModule.configure(cfg);

        // log4js.addAppender(appender);

        log = log4js.getLogger();

        done();
    })

    it("write log to azure", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                console.log(util.inspect(e));
                assert.equal(e, null);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };


        log.debug("test data1", "data1");
    })

    it("write log to azure the second time", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                assert.equal(e, null);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };

        log.info("test data2", "data2");
    })

});

describe("validation-test", function () {
    var cfg = null;
    var ctor = null;
    var appender = null;
    var log = null;
    var usedLayout = log4js.layouts.basicLayout;

    before(function (done) {
        cfg = getCfg();

        log4js.loadAppender(NAME, appenderModule);

        ctor = log4js.appenders[NAME];

        done();
    })

    it("invalid-config-object", function (done) {
        assert.throws(function () {
            appenderModule.configure(null);
        }, function (e) {
            return e instanceof Error;
        }, "Unexcepted error");
    })

    it("invalid-azure-storage-connection-string", function (done) {

        assert.throws(function () {
            appender = ctor("", cfg.container, cfg.appendBlob, usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");

        assert.throws(function () {
            appender = ctor(555, cfg.container, cfg.appendBlob, usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");

        assert.throws(function () {
            appender = ctor("bad connection string", cfg.container, cfg.appendBlob, usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");
    })

    it("invalid-container-string", function (done) {
        assert.throws(function () {
            appender = ctor(cfg.azureStorageConnectionString, "", cfg.appendBlob, usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");

        assert.throws(function () {
            appender = ctor(cfg.azureStorageConnectionString, 555, cfg.appendBlob, usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");
    })

    it("invalid-blob-string", function (done) {
        assert.throws(function () {
            appender = ctor(cfg.azureStorageConnectionString, cfg.container, 555, usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");

        assert.throws(function () {
            appender = ctor(cfg.azureStorageConnectionString, cfg.container, "", usedLayout);
        }, function (e) {
            return e instanceof Error;
        }, "unexpected error");
    })
});

describe("layout-test", function () {
    var cfg = null;
    var appender = null;
    var log = null;

    var ERROR_FROM_LAYOUT = "Error from customLayout";
    function customLayout(evt) {
        throw new TypeError(ERROR_FROM_LAYOUT);
    }

    before(function (done) {
        cfg = getCfg();

        log4js.loadAppender(name, appenderModule);

        var ctor = log4js.appenders[name];

        appender = ctor(cfg.azureStorageConnectionString, cfg.container, cfg.appendBlob, customLayout);

        log4js.addAppender(appender);

        log = log4js.getLogger();

        done();
    })

    it("layout-throw-exception", function (done) {
        assert.notEqual(appender, null);
        assert.notEqual(log, null);

        appender.callback = function (e, r, res) {
            if (e) {
                console.log(util.inspect(e));
                assert.equal(e.message, ERROR_FROM_LAYOUT);
                done();
            } else {
                console.log("======= sucessfull back information from azure =========");
                console.log(r);
                console.log("=========================================================");
                assert.notEqual(r, null);
                done();
            }
        };


        log.debug("test data1", "data1");
    })


});





