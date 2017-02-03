/**
 * Created by Peng on 2017/2/2.
 */


import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";
import {isArray} from "util";

describe("AddSpec", function () {

    var isf: InsightFacade = null;
    var aQuery = {
        "WHERE":{
            "GT":{
                "courses_avg": 97
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_avg"
            ],
            "ORDER":"courses_avg",
            "FORM":"TABLE"
        }
    }
    var bQuery = {
        "WHERE":{
            "OR":[
                {
                    "AND":[
                        {
                            "GT":{
                                "courses_avg":90
                            }
                        },
                        {
                            "IS":{
                                "courses_dept":"adhe"
                            }
                        }
                   ]
                },
                {
                    "EQ":{
                        "courses_avg":95
                    }
                }
            ]
        },
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            "ORDER":"courses_avg",
            "FORM":"TABLE"
        }
    }

    var testobj : Object = {
        "courses_avg":97
    };

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    it("XXX", function () {
        return isf.performQuery(aQuery).then(function(response : any){
            Helper.consoleLog(response)
        }).catch(function(err){
            Helper.consoleLog(err)
        })
    })

    it("YYY", function () {
        return isf.performQuery(bQuery).then(function(response : any){
            Helper.consoleLog(response)
        }).catch(function(err){
            Helper.consoleLog(err)
        })
    })

    // it("YYY", function () {
    //     return isf.performQuery(bQuery).then(function(response : any){
    //         Helper.consoleLog(response)
    //     }).catch(function(err){
    //         Helper.consoleLog(err)
    //     })
    // })

})