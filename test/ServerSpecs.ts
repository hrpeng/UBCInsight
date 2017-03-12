import Server from "../src/rest/Server";
import {expect} from 'chai';
import {assert} from 'chai';
import Log from "../src/Util";
import {Response} from 'restify';
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";
import {isArray} from "util";
let server = new Server(4321);
var chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);
var fs = require('fs');

var d3Query: QueryRequest =
    {
        "WHERE": {
            "AND": [{
                "IS": {
                    "rooms_shortname": "OSBO"
                }
            }, {
                "GT": {
                    "rooms_seats": 50
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
                "keys": ["rooms_shortname", "maxSeats"]
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

describe("ServerSpec", function () {
    var isf: InsightFacade = null;

    beforeEach(function () {
        isf = new InsightFacade();
        server.start();
    });

    afterEach(function () {
        isf = null;
        server.stop();
    })

    // it("PUT description", function () {
    //     this.timeout(10000);
    //     return chai.request('http://localhost:4321')
    //         .put('/dataset/rooms')
    //         .attach("body", fs.readFileSync("./rooms.zip"), "rooms")
    //         .then(function (res: Response) {
    //             Log.trace('then:');
    //             // some assertions
    //             expect(res.status).to.equal(201);
    //         })
    //         .catch(function (err: any) {
    //             Log.trace('catch:');
    //             // some assertions
    //             expect(err.status).to.equal(400);
    //             expect.fail();
    //         });
    // });
    //
    // it("POST description", function () {
    //     this.timeout(10000);
    //     return chai.request('http://localhost:4321')
    //         .post('/query')
    //         .send(d3Query)
    //         .then(function (res: Response) {
    //             Log.trace('then:');
    //             expect(res.status).to.equal(200);
    //         })
    //         .catch(function (err: any) {
    //             Log.trace('catch:');
    //             // some assertions
    //             expect(err.status).to.equal(400);
    //             expect.fail();
    //         });
    // });
})
