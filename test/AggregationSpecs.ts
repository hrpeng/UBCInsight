/**
 * Created by Peng on 2017/3/4.
 */


import Server from "../src/rest/Server";
import {expect} from 'chai';
import {assert} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";
import {isArray} from "util";
import Aggregation from "../src/controller/Aggregation";

describe("AggregationSpec", function () {
    var isf: InsightFacade = null;

    var aggQueryA = {
        "WHERE": {
            "AND": [{
                "IS": {
                    "rooms_furniture": "*Tables*"
                }
            }, {
                "GT": {
                    "rooms_seats": 300
                }
            }]
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_shortname",
                "maxSeats"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": ["maxSeats"]
            },
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["rooms_shortname"],
            "APPLY": [{
                "maxSeats": {
                    "MAX": "rooms_seats"
                }
            }]
        }
    }

    var aggQueryB :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_avg",
                "countFail"
            ],
            "ORDER": "courses_avg",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_avg"],
            "APPLY": [{
                "countFail": {
                    "COUNT": "courses_dept"
                }
            }]
        }
    }

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    })


    it("XXX", function () {
        isf.performQuery(aggQueryA).then(function(res:any){
            //console.log(res)
        }).catch(function(err:any){
            console.log(err)
        })
    })

    it("YYY", function () {
        isf.performQuery(aggQueryB).then(function(res:any){
            //console.log(res)
        }).catch(function(err:any){
            console.log(err)
        })
    })
})