/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";

import Log from "../Util";
import QPHelper from "./QPHelper";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            Helper.exist('./' + id).then(function(b:any){
                Helper.consoleLog(b)
                if(b){
                    console.log(b)
                    Helper.parseData(id, content).then(function(jsc:any){
                        var is: InsightResponse = {
                            code: 201,
                            body: {jsc}
                        }
                        Helper.consoleLog(is)
                        fulfill(is);
                    })
                } else {
                    Helper.parseData(id, content).then(function(jsc:any){
                        var is : InsightResponse = {
                            code: 204,
                            body:{jsc}
                        }
                        Helper.consoleLog(is)
                        fulfill(is);
                    })
                }
            }).catch(function(e:any){
                var is : InsightResponse = {
                    code: 204,
                    body:{"error": e}
                }
                reject(is);
            })
        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            "use strict";
            var fs = require('fs');
            fs.exists('./'+id, function(exists: any) {
                if (exists) {
                    fs.unlink('./'+id);
                    var ir : InsightResponse = {
                        code: 204,
                        body: exists
                    };
                    fulfill(ir);
                }else {
                    var ir: InsightResponse = {
                        code: 404,
                        body: exists
                    };
                    reject(ir);
                }
            });
        })
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return new Promise(function (fulfill, reject) {
            var valid = Helper.validate(query);
            if (valid == 'dataset has not been PUT'){
                var is : InsightResponse = {
                    code: 424,
                    body:{'error': valid}
                }
                reject(is);
            }
            if (valid == 'valid'){
                var final = QPHelper.QRHelper(query);
                //console.log(final)
                var is: InsightResponse = {
                    code: 200,
                    body: { 'render': 'TABLE', 'result': final}
                }
                fulfill(is)
            } else {
                var is : InsightResponse = {
                    code: 400,
                    body:{'error': valid}
                }
                reject(is);
            }
        })
    }
}
