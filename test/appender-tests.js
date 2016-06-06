var log4js = require('log4js');
var assert = require('assert');
var util = require("util");

var getCfg = require("./config").getCfg;

var NAME = require("./config").NAME;

var reloadModule = require("./config").reloadModule;

describe("normal-configure-test", function () {
    var cfg = null;
    var appender = null;
    var log = null;
    var appenderModule = null;
    before(function (done) {
        cfg = getCfg();
        appenderModule = reloadModule();

        appender = appenderModule.configure(cfg);

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


describe("validation-test", function () {
    var appenderModule = null;
    var cfg = null;
    var ctor = null;
    var appender = null;
    var log = null;
    var usedLayout = log4js.layouts.basicLayout;

    before(function (done) {
        cfg = getCfg();

        appenderModule = reloadModule();

        log4js.loadAppender(NAME, appenderModule);

        ctor = log4js.appenders[NAME];

        done();
    })

    it("invalid-config-object", function () {
        assert.throws(function () {
            appenderModule.configure(null);
        }, function (e) {
            return e instanceof Error;
        }, "Unexcepted error");
    })

    it("invalid-azure-storage-connection-string", function () {

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

    it("invalid-container-string", function () {
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

    it("invalid-blob-string", function () {
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
    var appenderModule = null;
    var cfg = null;
    var appender = null;
    var log = null;

    var ERROR_FROM_LAYOUT = "Error from customLayout";
    function customLayout(evt) {
        throw new TypeError(ERROR_FROM_LAYOUT);
    }

    before(function (done) {
        cfg = getCfg();
        appenderModule = reloadModule();
        log4js.loadAppender(NAME, appenderModule);

        var ctor = log4js.appenders[NAME];

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





