/**
 * Created by Peng on 2017/2/2.
 */


import Server from "../src/rest/Server";
import {expect} from 'chai';
import {assert} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";
import {isArray} from "util";

describe("AddSpec", function () {

    var isf: InsightFacade = null;
    var badQuery: QueryRequest = {
        "WHERE":{
            "BT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQuery1: QueryRequest = {
        "WHERE":"awef"
        ,
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQuery2: QueryRequest = {
        "WHERE":{
            "EQ":{
                "apple_wtf": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    //var badQuery3 = "qewf";
    var badQuery4: QueryRequest = {
        "WHERE":{
            "EQ":{
                "courseswtf": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }

    var badQuery5: QueryRequest = {
        "WHERE":{
            "EQ":{
                "wtf_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQuery6: QueryRequest = {
        "WHERE":{
            "EQ":{
                "apple_avg": "wow"
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryIS: QueryRequest = {
        "WHERE":{
            "IS":{
                "appleavg": 95
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryIS1: QueryRequest = {
        "WHERE":{
            "IS":{
                "poop_dept": 95
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryIS2: QueryRequest = {
        "WHERE":{
            "IS":{
                "apple_dept": 95
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryIS3: QueryRequest = {
        "WHERE":{
            "IS":{
                "apple_fail": 95
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryIS4: QueryRequest = {
        "WHERE":{
            "IS":{
                "apple_dept": "undefined"
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryIS5: QueryRequest = {
        "WHERE":{
            "AND": [
                {
                    "IS":{
                    "Courses_dept": "*ps*"
                     }
                },
                {
                    "GT":{
                        "Courses_avg": 90
                    }
                }

            ]

        },
        "OPTIONS":{
            "COLUMNS":[
                "Courses_dept",
                "Courses_audit"
            ],
            "ORDER":"Courses_audit",
            "FORM":"TABLE"
        }
    }

    var badQueryIS6: QueryRequest = {
        "WHERE":{
            "AND":[
                {
                    "GT":{
                        "Courses_avg": 85
                    }
                },
                {
                    "NOT": {
                        "IS": {
                            "Courses_instructor": "*e"
                        }
                    }
                },
                {
                    "LT": {
                        'Courses_avg': 90
                    }
                }
            ]
        },
        "OPTIONS":{
            "COLUMNS" : [
                "Courses_dept",
                "Courses_id",
                "Courses_instructor"
            ],
            "ORDER":"Courses_id",
            "FORM":"TABLE"
        }
    }
    var badQueryIS7: QueryRequest = {
        "WHERE":{
            "AND": [
                {
                    "IS":{
                        "Courses_dept": "cps*"
                    }
                },
                {
                    "GT":{
                        "Courses_avg": 90
                    }
                }

            ]

        },
        "OPTIONS":{
            "COLUMNS":[
                "Courses_dept",
                "Courses_audit"
            ],
            "ORDER":"Courses_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryor: QueryRequest = {
        "WHERE":{
            "OR":
                {
                    "GT":{
                        "Courses_avg": 90
                    }
                }

        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryor1: QueryRequest = {
        "WHERE":{
            "OR":
                []
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryor3: QueryRequest = {
        "WHERE":{
            "OR":
                [
                    {
                        "EQ":{
                            "Coursesavg": 90
                        }
                    }
                ]

        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryOP: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS": "lol"
    }
    var badQueryOP1: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryOP2: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
        }
    }
    var badQueryOP3: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":"",
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryOP4: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                1,2
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryOP5: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "crap_dept"
            ],
            "ORDER":"apple_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryOP6: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER": 1,
            "FORM":"TABLE"
        }
    }
    var badQueryOP7: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"crap_audit",
            "FORM":"TABLE"
        }
    }
    var badQueryOP8: QueryRequest = {
        "WHERE":{
            "GT":{
                "apple_audit": 10
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "apple_dept",
                "apple_audit"
            ],
            "ORDER":"apple_audit",
            "FORM":"SCREW THIS"
        }
    }

    var aQuery: QueryRequest = {
        "WHERE":{
            "IS":{
                "Courses_dept": "frst"
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "Courses_dept",
                "Courses_instructor",
                "Courses_id",
                "Courses_uuid"
            ],
          //  "ORDER":"Courses_uuid",
            "FORM":"TABLE"
        }
    }
    var NOTaQuery: QueryRequest = {
        "WHERE": {
            "AND": [
                {
                    "IS": {
                        "Courses_dept": "frst"
                    }
                },
                {
                    "NOT": {
                        "IS": {
                            "Courses_instructor": "*john*"
                        }
                    }
                }
            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "Courses_instructor",
                "Courses_avg"
            ],
            "ORDER": "Courses_avg",
            "FORM": "TABLE"
        }
    }
    var finalquery: QueryRequest = {
        "WHERE":{
            "GT":{
                "Courses_avg":97
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "Courses_id",
                "Courses_uuid"
            ],
            "ORDER":"Courses_id",
            "FORM":"TABLE"
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
                            "IS": {
                                'Courses_dept': "cpsc"
                            }
                        },
                        {
                            "LT": {
                                'Courses_avg': 95
                            }
                        },
                    ]
                },
                {
                    "EQ": {
                        'Courses_avg': 4
                    }
                }
            ]
        },
        "OPTIONS":{
            "COLUMNS":[
                "Courses_dept",
                "Courses_avg"
            ],
            "ORDER":"Courses_dept",
            "FORM":"TABLE"
        }
    }

    var roomQuery: QueryRequest = {
        "WHERE": {
            "AND": [
                {
                    "IS": {
                        "rooms_shortname": "*L*"
                    }
                },
                {
                    "IS": {
                        "rooms_type": "Small*"
                    }
                }
            ]
        },
        "OPTIONS": {
        "COLUMNS": [
            "rooms_name",
            "rooms_shortname",
            "rooms_type"
        ],
            "ORDER": "rooms_name",
            "FORM": "TABLE"
        }
    }

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    // it("XXX", function () {
    //     return isf.performQuery(roomQuery).then(function(response : any){
    //         Helper.consoleLog(response['body'])
    //     }).catch(function(err){
    //         Helper.consoleLog(err)
    //     })
    // })
//
//     it("XXX", function () {
//         return isf.performQuery(bQuery).then(function(response : any){
//             //Helper.consoleLog(response)
//         }).catch(function(err){
//             Helper.consoleLog(err)
//         })
//     })
//
//     it("YYY", function () {
//         return isf.performQuery(NOTaQuery).then(function(response : any){
//             //Helper.consoleLog(response)
//         }).catch(function(err){
//             Helper.consoleLog(err)
//         })
//     })
//
//     it("III", function () {
//         return isf.performQuery(aQuery).then(function(response : any){
//             //Helper.consoleLog(response)
//         }).catch(function(err){
//             Helper.consoleLog(err)
//         })
//     })
//     it("Coverage EQ", function () {
//         return isf.performQuery(badQuery).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.body['error'], 'invalid WHERE')
//         });
//     })
//     it("Coverage EQ", function () {
//         return isf.performQuery(badQuery1).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.body['error'], 'invalid object')
//         });
//     })
//     it("Coverage EQ", function () {
//         return isf.performQuery(badQuery2).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.code, 424, 'dataset not put')
//         });
//     })
//
//     it("Coverage EQ", function () {
//         return isf.performQuery(badQuery4).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.code, 400)
//         });
//     })
//     it("Coverage EQ", function () {
//         return isf.performQuery(badQuery5).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'][0],'wtf')
//         });
//     })
//     it("Coverage EQ", function () {
//         return isf.performQuery(badQuery6).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
//     })
//     it("Coverage OP", function () {
//
//         return isf.performQuery(badQueryOP).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
//     });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP1).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'][0],'apple')
//         });
//     });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP2).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
//     });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP3).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
// });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP4).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//         });
// });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP5).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.body['missing'][0],'apple')
//         });
// });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP6).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
//     });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP7).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
//     });
//     it("Coverage OP", function () {
//         return isf.performQuery(badQueryOP8).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//             assert.equal(err.body['missing'].length,1)
//         });
//     })
//
//     it("Coverage IS", function () {
//         return isf.performQuery(badQueryIS).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 400)
//         });
//     });
//     it("Coverage IS", function () {
//         return isf.performQuery(badQueryIS1)
//             .then(function(response : any){
//                 expect.fail()
//             }).catch(function(err){
//             assert.equal(err.body['missing'][0], 'poop')
//         });
//     });
//     it("Coverage IS", function () {
//         return isf.performQuery(badQueryIS2).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.code, 424)
//         });
// });
//     it("Coverage IS", function () {
//         return isf.performQuery(badQueryIS3).then(function(response : any){
//             expect.fail()
//         }).catch(function(err){
//             assert.equal(err.body['missing'].length, 1)
//         });
// });
//     it("Coverage IS", function () {
//         return isf.performQuery(badQueryIS4).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.body['missing'][0], 'apple')
//         });
//     })
//         // isf.performQuery(badQueryIS5);
//         // isf.performQuery(badQueryIS6)
//         // isf.performQuery(badQueryIS7);
//
//     it("Coverage OR", function () {
//         return isf.performQuery(badQueryor).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//              assert.equal(err.code,400)
//         });
//     })
//     it("Coverage OR", function () {
//         return isf.performQuery(badQueryor1).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.body['error'],'invalid LOGIC value')
//         });
//     })
//     it("Coverage OR", function () {
//         return isf.performQuery(badQueryor3).then(function (response: any) {
//             expect.fail()
//         }).catch(function (err) {
//             assert.equal(err.body['error'],'invalid MCOMPARISON key')
//         });
//     })
//     it("Coverage OR", function () {
//         return isf.performQuery(finalquery).then(function(response : any){
//             assert.equal(response.body['result'].length,49)
//         }).catch(function(err){
//              expect.fail()
//         });
//     })
//     //
//     it("NON-SENSE Coverage", function () {
//         Log.info("asdf");
//         Log.warn("asdf");
//         Log.error("cool");
//         var server = new Server(300);
//         server.start();
//         //Server.echo();
//         server.stop();
//
//         //Helper.consoleLog("asdf");
//     })
})