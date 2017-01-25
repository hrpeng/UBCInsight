


export default class Helper {

    public static consoleLog(content:any) {
            console.log(content);
    }

    public static encodeZip(path : string) {
        "use strict";
        const fs = require('fs');
        var JSZip = require('jszip');

        var text = fs.readFileSync(path, 'base64')
        //console.log(text)
        return text;
    };
}