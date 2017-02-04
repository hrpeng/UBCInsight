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
                "Courses_dept",
                "Courses_avg"
            ],
            "ORDER":"Courses_avg",
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
                "Courses_dept",
                "Courses_avg"
            ],
            "ORDER": "Courses_avg",
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
                                 "Courses_avg": 90
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
                "Courses_dept",
                "Courses_id",
                "Courses_avg"
            ],
            "ORDER":"Courses_avg",
            "FORM":"TABLE"
        }
    }

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    it("XXX", function () {
        return isf.performQuery(aQuery).then(function(response : any){
           //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        })
    })

    it("YYY", function () {
        return isf.performQuery(NOTaQuery).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            Helper.consoleLog(err)
        })
    })

    it("III", function () {
        //QPHelper.QRHelper(aQuery);
    })


    it("YYY", function () {
        // var a : any[] = [ { aanb504:
        //     { Courses_dept: 'aanb',
        //         Courses_id: '504',
        //         Courses_sec: '002',
        //         Courses_avg: 94.44,
        //         Courses_instructor: '',
        //         Courses_title: 'rsrch methdlgy',
        //         Courses_pass: 9,
        //         Courses_fail: 0,
        //         Courses_audit: 9,
        //         Courses_year: '2015',
        //         Courses_uuid: '31379' } },
        //     { aanb551:
        //         { Courses_dept: 'aanb',
        //             Courses_id: '551',
        //             Courses_sec: '003',
        //             Courses_avg: 87.83,
        //             Courses_instructor: '',
        //             Courses_title: 'anml welf rsrch',
        //             Courses_pass: 6,
        //             Courses_fail: 0,
        //             Courses_audit: 0,
        //             Courses_year: '2015',
        //             Courses_uuid: '31381' } },
        //     { adhe327:
        //         { Courses_dept: 'adhe',
        //             Courses_id: '327',
        //             Courses_sec: '63a',
        //             Courses_avg: 85.64,
        //             Courses_instructor: '',
        //             Courses_title: 'teach adult',
        //             Courses_pass: 22,
        //             Courses_fail: 0,
        //             Courses_audit: 0,
        //             Courses_year: '2008',
        //             Courses_uuid: '8672' } },
        //     { adhe327:
        //         { Courses_dept: 'adhe',
        //             Courses_id: '327',
        //             Courses_sec: '63c',
        //             Courses_avg: 85.6,
        //             Courses_instructor: 'smulders, dave',
        //             Courses_title: 'teach adult',
        //             Courses_pass: 20,
        //             Courses_fail: 0,
        //             Courses_audit: 0,
        //             Courses_year: '2010',
        //             Courses_uuid: '17256' } }]
        // var o = QPHelper.QRHelper(aQuery)
        // console.log(o)
    })


})