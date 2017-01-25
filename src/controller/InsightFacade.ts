/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";

import Log from "../Util";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            "use strict";
            var JSZip = require('jszip');
            var keys : any[] = [];
            JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                var files = zip['files']

                for (var key of Object.keys(files)) {
                    var k = key.substring(5);
                    if (k.length > 0) {
                        zip.file(key).async("string").then(function (data: any) {
                            //parse one course
                            var jsonAllData: any = {};
                            var parsedData = Helper.parseToJson(data);
                            jsonAllData.k = parsedData;

                        }, function error (err:any) {
                            //handle error


                        });
                        keys.push(k)
                    }
                }
            });
        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return null;
    }


}
