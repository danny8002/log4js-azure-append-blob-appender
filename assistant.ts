/// <reference path="typings/main.d.ts" />

import azure_ = require("azure-storage");
import os_ = require("os");

var eol = os_.EOL || '\n';

export class AzureAppendBlobAssistant {
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
            if (response.statusCode == 404) {
                self.blob.createAppendBlobFromText(self.container, self.blobName, text, cb);
            } else {
                self.blob.appendFromText(self.container, self.blobName, text, cb);
            }
            self._checked = true;
        });
    }
}

