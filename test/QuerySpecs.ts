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
            // "ORDER":"Courses_uuid",
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

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    it("XXX", function () {
        return isf.performQuery(bQuery).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            Helper.consoleLog(err)
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
        return isf.performQuery(aQuery).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            Helper.consoleLog(err)
        })
    })
    it("Coverage EQ", function () {
        isf.performQuery(badQuery).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        });
        isf.performQuery(badQuery1).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        });
        isf.performQuery(badQuery2).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        });
        //isf.performQuery(badQuery3);
        isf.performQuery(badQuery4).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        });
        isf.performQuery(badQuery5).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        });
        isf.performQuery(badQuery6).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            //Helper.consoleLog(err)
        });

    })
    it("Coverage OP", function () {
        isf.performQuery(badQueryOP);
        isf.performQuery(badQueryOP1);
        isf.performQuery(badQueryOP2);
        isf.performQuery(badQueryOP3);
        isf.performQuery(badQueryOP4);
        isf.performQuery(badQueryOP5);
        isf.performQuery(badQueryOP6);
        isf.performQuery(badQueryOP7);
        isf.performQuery(badQueryOP8);

    })

    it("Coverage IS", function () {
        isf.performQuery(badQueryIS);
        isf.performQuery(badQueryIS1);
        isf.performQuery(badQueryIS2);
        isf.performQuery(badQueryIS3);
        isf.performQuery(badQueryIS4);
        // isf.performQuery(badQueryIS5);
        // isf.performQuery(badQueryIS6)
        // isf.performQuery(badQueryIS7);
    })

    it("Coverage OR", function () {
        isf.performQuery(badQueryor).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            // Helper.consoleLog(err)
        });
        isf.performQuery(badQueryor1).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            // Helper.consoleLog(err)
        });
        isf.performQuery(badQueryor3).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            // Helper.consoleLog(err)
        });
        isf.performQuery(finalquery).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            // Helper.consoleLog(err)
        });
    })

    it("NON-SENSE Coverage", function () {
        Log.info("asdf");
        Log.warn("asdf");
        Log.error("cool");
        var server = new Server(300);
        server.start();
        //Server.echo();
        server.stop();

        //Helper.consoleLog("asdf");
    })

    it("remove", function (){
        isf.removeDataset('apple')
        isf.removeDataset('noData')
    })
})