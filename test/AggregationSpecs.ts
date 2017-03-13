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

    var aggQueryA:any = {
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
                "rooms_shortname"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": ["rooms_shortname"]
            },
            "FORM": "TABLE"
        }
    }

    var aggQueryB :any = {
        "WHERE":{
            "OR":[
                {
                    "AND":[
                        {
                            "GT":{
                                "courses_avg": 90
                            }
                        },
                        {
                            "IS": {
                                "courses_dept": "*psc"
                            }
                        },
                        {
                            "LT": {
                                "courses_avg": 95
                            }
                        }
                    ]
                }, {
                    "NOT": {
                        "EQ": {
                            "courses_avg": 4
                        }
                    }
                }
            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "mhyu"],
            "ORDER": {
                "dir": "UP",
                "keys": ["mhyu","courses_dept"]
            } ,
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "countYear": {
                    "MIN": "courses_fail"
                }
            },{
                "mhyu": {
                    "COUNT": "courses_instructor"
                }
            }]
        }
    }

    var aggQueryC :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var aggQueryD :any = {
        "WHERE":{
            "OR":[
                {
                    "AND":[
                        {
                            "GT":{
                                "courses_avg": 90
                            }
                        },
                        {
                            "IS": {
                                "courses_dept": "cps*"
                            }
                        },
                        {
                            "LT": {
                                "courses_avg": 95
                            }
                        }
                    ]
                }, {
                    "NOT": {
                        "EQ": {
                            "courses_avg": 4
                        }
                    }
                }
            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "AVG": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryA :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "coures_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryB :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SM": "courses_audit"
                }
            }]
        }
    }

    var badQueryC:any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "maxFail": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryD:any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "coures_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": ""
    }

    var badQueryF: any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryG:any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"]
        }
    }

    var badQueryH: any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": [],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryI:any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dep"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryJ:any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["coursesdept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryK :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": {
                "maxFail": {
                    "MAX": "courses_fail"
                }
            }
        }
    }

    var badQueryL :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "lol"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }
    var badQueryM :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": {
                "dir": "UP",
                "keys": ["courses_fail"]
            },
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }
    var badQueryN :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": {
                "dir": "UP",
                "keys": []
            },
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryO :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "SUM": "courses_instructor"
                }
            }]
        }
    }

    var badQueryP :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mhyu": {
                    "COUNT": "courses_adit"
                }
            }]
        }
    }

    var badQueryQ :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": [{
                "maxFail": {
                    "MAX": "courses_fail"
                }
            },{
                "mh_yu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryR :any = {
        "WHERE": {},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "maxFail"
            ],
            "ORDER": "courses_dept",
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept"],
            "APPLY": ["lol",
                {
                "mhyu": {
                    "SUM": "courses_audit"
                }
            }]
        }
    }

    var badQueryS :any = {
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
                "rooms_shortname"
            ],
            "ORDER": {
                "dir": "X",
                "keys": ["rooms_shortname"]
            },
            "FORM": "TABLE"
        }
    }

    var badQueryT :any = {
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
                "rooms_shortname"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": ["rooms_shotname"]
            },
            "FORM": "TALE"
        }
    }

    var badQueryU ={
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
                "rooms_shortname"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": "rooms_shortname"
            },
            "FORM": "TABLE"
        }
    }

    var badQueryV ={
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
                "rooms_shortname"
            ],
            "ORDER": {
                "keys": ["rooms_shortname"]
            },
            "FORM": "TABLE"
        }
    }

    var badQueryW ={
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
                "rooms_shortname"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": ["rms_shortname"]
            },
            "FORM": "TABLE"
        }
    }

    // var badQueryX = {
    //     "WHERE": {
    //     "AND": [{
    //         "IS": {
    //             "rooms_furniture": "*Tables*"
    //         }
    //     }, {
    //         "GT": {
    //             "rooms_seats": 300
    //         }
    //     }]
    // },
    //     "OPTIONS": {
    //     "COLUMNS": [
    //         "rooms_shortname"
    //     ],
    //         "ORDER": "roomsname",
    //     "FORM": "TABLE"
    // }
    // }
    //
    // var badQueryY = {
    //     "WHERE": {},
    //     "OPTIONS": {
    //         "COLUMNS": [
    //             "courses_dept",
    //             "maxFail"
    //         ],
    //         "ORDER": {
    //             "dir": "UP",
    //             "keys": ["mhyu","courses_dept"]
    //         },
    //         "FORM": "TABLE"
    //     },
    //     "TRANSFORMATIONS": {
    //         "GROUP": ["courses_dept"],
    //         "APPLY": [{
    //             "maxFail": {
    //                 "MAX": "courses_fail"
    //             }
    //         },{
    //             "mhyu": {
    //                 "SUM": "courses_audit"
    //             }
    //         }]
    //     }
    // }
    //
    // var badQueryZ ={
    //     "WHERE": {},
    //     "OPTIONS": {
    //         "COLUMNS": [
    //             "courses_dept",
    //             "maxFail"
    //         ],
    //         "ORDER": {
    //             "dir": "UP",
    //             "keys": ["mhyu","courses_dept"]
    //         },
    //         "FORM": "TABLE"
    //     },
    //     "TRANSFORMATIONS": {
    //         "GROUP": ["courses_dept"],
    //         "APPLY": [{
    //             "maxFail": {
    //                 "MAX": "courses_fail"
    //             }
    //         },{
    //             "mhyu": {
    //                 "SUM": "courses_audit"
    //             }
    //         }]
    //     }
    // }

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    })


    it("XXX", function () {
        return isf.performQuery(aggQueryA).then(function(res:any){
            //console.log(res)
        }).catch(function(err:any){
            expect.fail()
        })
    })

    it("YYY", function () {
        return isf.performQuery(aggQueryB).then(function(res:any){
            //console.log(res)
        }).catch(function(err:any){
            expect.fail()
        })
    })

    it("ZZZ", function () {
        return isf.performQuery(aggQueryC).then(function(res:any){
            //console.log(res)
        }).catch(function(err:any){
            expect.fail()
        })
    })

    it("ZZZ", function () {
        return isf.performQuery(aggQueryD).then(function(res:any){
            //console.log(res)
        }).catch(function(err:any){
            expect.fail()
        })
    })

    it("invalid option", function () {
        return isf.performQuery(badQueryA).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.body['error'],'invalid id, dataset has not been PUT')
        })
    })

    it("invalid transformation", function () {
        return isf.performQuery(badQueryB).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.body['error'],'invalid APPLYTOKEN')
        })
    })

    it("duplicate apply keys", function () {
        return isf.performQuery(badQueryC).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryD).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryF).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryG).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryH).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryI).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryJ).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryK).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryI).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryJ).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryK).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryI).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryJ).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryK).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryL).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryM).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryN).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryO).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryP).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryQ).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid ORDER", function () {
        return isf.performQuery(badQueryS).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid TRANSFORMATION", function () {
        return isf.performQuery(badQueryR).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid ORDER", function () {
        return isf.performQuery(badQueryT).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid ORDER", function () {
        return isf.performQuery(badQueryU).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid ORDER", function () {
        return isf.performQuery(badQueryV).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    it("invalid ORDER", function () {
        return isf.performQuery(badQueryW).then(function(res:any){
            expect.fail()
        }).catch(function(err:any){
            assert.equal(err.code,400)
        })
    })

    // it("invalid ORDER", function () {
    //     return isf.performQuery(badQueryX).then(function(res:any){
    //         expect.fail()
    //     }).catch(function(err:any){
    //         assert.equal(err.code,400)
    //     })
    // })

    // it("invalid ORDER", function () {
    //     return isf.performQuery(badQueryY).then(function(res:any){
    //         expect.fail()
    //     }).catch(function(err:any){
    //         assert.equal(err.code,400)
    //     })
    // })
    //
    // it("invalid ORDER", function () {
    //     return isf.performQuery(badQueryZ).then(function(res:any){
    //         expect.fail()
    //     }).catch(function(err:any){
    //         assert.equal(err.code,400)
    //     })
    // })

})