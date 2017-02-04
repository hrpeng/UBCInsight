/**
 * Created by Peng on 2017/2/2.
 */


import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";
import {isArray} from "util";
import QPHelper from "../src/controller/QPHelper";

describe("AddSpec", function () {

    var isf: InsightFacade = null;
    var aQuery: QueryRequest = {
        "WHERE":{
            "GT":{
                "Courses_avg": 97
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
    var NOTaQuery: QueryRequest = {
        "WHERE": {
            "NOT" : {
                "LT": {
                    "Courses_avg": 95
                }
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg",
            "FORM": "TABLE"
        }
    }
    var bQuery: QueryRequest = {
        "WHERE":{
            "OR":[
                {
                     "AND":[
                         {
                             "GT":{
                                 "Courses_avg":90
                             }
                         },
                         {
                             "IS":{
                                 "Courses_dept":"adhe"
                             }
                         }
                    ]
                },
                 {
                     "EQ":{
                         "Courses_avg":95
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

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    // it("XXX", function () {
    //     return isf.performQuery(aQuery).then(function(response : any){
    //         Helper.consoleLog(response)
    //     }).catch(function(err){
    //         Helper.consoleLog(err)
    //     })
    // })

    // it("YYY", function () {
    //     return isf.performQuery(bQuery).then(function(response : any){
    //         Helper.consoleLog(response)
    //     }).catch(function(err){
    //         Helper.consoleLog(err)
    //     })
    // })

    it("III", function () {
        QPHelper.QRHelper(bQuery);
    })

    // it("YYY", function () {
    //     return isf.performQuery(bQuery).then(function(response : any){
    //         Helper.consoleLog(response)
    //     }).catch(function(err){
    //         Helper.consoleLog(err)
    //     })
    // })

})