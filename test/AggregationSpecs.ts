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
    var anArray = [{
        rooms_name: 'BIOL_1503',
        rooms_shortname: 'BIOL',
        rooms_type: 'Small Group',
        rooms_seats: 39,
        rooms_lon: 122
        },
        {
            rooms_name: 'BIOL_2519',
            rooms_shortname: 'BIOL',
            rooms_type: 'large Group',
            rooms_seats: 100,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_156',
            rooms_shortname: 'IBLC',
            rooms_type: 'large Group',
            rooms_seats: 99,
            rooms_lon: 177
        },
        {
            rooms_name: 'IBLC_157',
            rooms_shortname: 'IBLC',
            rooms_type: 'large Group',
            rooms_seats: 200,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_158',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 20,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_185',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 39,
            rooms_lon: 100
        },
        {
            rooms_name: 'IBLC_191',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 22,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_192',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 10,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_193',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_194',
            rooms_shortname: 'IBLC',
            rooms_type: 'large Group',
            rooms_seats: 98,
            rooms_lon: 120
        },
        {
            rooms_name: 'IBLC_195',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_263',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_264',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 109
        },
        {
            rooms_name: 'IBLC_265',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 32,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_266',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 14,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_460',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'IBLC_461',
            rooms_shortname: 'IBLC',
            rooms_type: 'Small Group',
            rooms_seats: 15,
            rooms_lon: 101
        },
        {
            rooms_name: 'LASR_211',
            rooms_shortname: 'LASR',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'LASR_5C',
            rooms_shortname: 'LASR',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCLD_220',
            rooms_shortname: 'MCLD',
            rooms_type: 'Small Group',
            rooms_seats: 10,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_256',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 27,
            rooms_lon: 131
        },
        {
            rooms_name: 'MCML_260',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_358',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 33,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360A',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360B',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 25,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360C',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360D',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 14,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360E',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360F',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 22,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360G',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360H',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 14,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360J',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360K',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360L',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'MCML_360M',
            rooms_shortname: 'MCML',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        },
        {
            rooms_name: 'UCLL_101',
            rooms_shortname: 'UCLL',
            rooms_type: 'Small Group',
            rooms_seats: 30,
            rooms_lon: 122
        }];

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
                "rooms_furniture"
            ],
            "ORDER": "rooms_furniture",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["rooms_furniture"],
            "APPLY": []
        }
    }

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    })


    // it("XXX", function () {
    //     isf.performQuery(aggQueryA).then(function(res:any){
    //         //console.log(res)
    //     })
    // })

    it("YYY", function () {
        isf.performQuery(aggQueryB).then(function(res:any){
            //console.log(res)
        })
    })
})