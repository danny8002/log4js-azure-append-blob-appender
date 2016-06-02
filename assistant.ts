/// <reference path="typings/main.d.ts" />

import azure_ = require("azure-storage");
import os_ = require("os");
import util_ = require("util");

var eol = os_.EOL || '\n';

export class AzureAppendBlobAssistant {
    // check blob properties for the first time access
    private _checked: boolean;
    constructor(private blob: azure_.BlobService, private container: string, private blobName: string) {
        this._checked = false;
    }

    /**
     * 
     */
    public writeText(
        text: string,
        cb: azure_.ErrorOrResult<azure_.BlobService.BlobResult>): void {
        var self = this;

        text = text + eol;
        if (self._checked) return self.blob.appendFromText(self.container, self.blobName, text, cb);

        // create or write
        self.blob.getBlobProperties(self.container, self.blobName, function (error, result, response) {
            self._checked = true;

            if (error != null) {

                // blob not exist, create it
                if (response != null && response.statusCode == 404) {
                    return self.blob.createAppendBlobFromText(self.container, self.blobName, text, cb);
                }

                // other error
                return cb(error, result, response);

            } else {
                // check whether it is an append-blob
                if (result != null && result.blobType !== "AppendBlob") {
                    var msg = util_.format(
                        "Azure Storage {container=%s, blob=%s} is not an append blob but [%s]"
                        , self.container
                        , self.blobName);
                    return cb(new TypeError(msg), null, null);
                }

                return self.blob.appendFromText(self.container, self.blobName, text, cb);
            }
        });
    }
}

