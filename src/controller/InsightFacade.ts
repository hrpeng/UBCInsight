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
            Helper.exist('./' + id).then(function(b:any){
                Helper.consoleLog(b)
                if(b){
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
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return null;
    }


}
