/**
 * Created by Peng on 2017/1/22.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import {assert} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";
import {isArray} from "util";
import Rooms from "../src/controller/Rooms";
import {roomObject} from "../src/controller/Rooms";


describe("AddSpec", function () {
    var isf: InsightFacade = null;
    var content = Helper.encodeZip('./courses.zip');
    var content0 = Helper.encodeZip('./cour.zip');
    var contentND = Helper.encodeZip('./noData.zip');
    var contentFND = Helper.encodeZip('./fileNoData.zip');
    var room = Helper.encodeZip('./rooms.zip')

    var id = "courses";

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    /*return isf.addDataset('cour',content).then(function (parsed: InsightResponse) {
     Helper.consoleLog(parsed)
     //Log.test('Value: ' + value);
     // expect(value).to.equal(6);
     }).catch(function (err) {
     // Log.test('Error: ' + err);
     // expect.fail();
     //     })*/

    it("invalid zip file", function () {
        return isf.addDataset('null', null).then(function(response : any){
            expect.fail()
        }).catch(function(err){
            expect(err.body['error']).to.equal('invalid zip file')
        });
    })
    it("add Courses", function () {
        this.timeout(10000)
        return isf.addDataset('Courses',content).then(function(response : any){
            assert.equal(response.body['jsc']['Courses'].length,64612,'there are 64612 sections in the dataset')
        }).catch(function(err){
             expect.fail()
        })
    })
    it("file no data", function () {
        return isf.addDataset('fileNoData',contentFND).then(function(response : any){
            expect.fail()
        }).catch(function(err){
            expect(err.body['error']).to.equal('zip file with no real data')
        })
    })


    it("empty zip", function () {
        return isf.addDataset('noData',contentND).then(function(response : any){
            expect.fail()
        }).catch(function(err){
             assert.equal(err.body['error'],'empty zip','adding an empty zip file')
        })
    })


    it("add cour", function () {
        return isf.addDataset('cour',content0).then(function(response : any){
            assert.isArray(response.body['jsc']['cour'])
        }).catch(function(err){
            expect.fail()
        })
    })

    it("remove", function () {
        return isf.removeDataset('cour').then(function(response : any){
            assert.equal(response.code,204)
        }).catch(function(err){
            expect.fail()
        })
    })

    it("remove", function () {
        return isf.removeDataset('shit').then(function(response : any){
            expect.fail()
        }).catch(function(err){
            assert.equal(err.code,404)
        })
    })

    it("add rooms", function () {
        this.timeout(10000);
        return isf.addDataset('rooms',room).then(function(response : any){
            assert.isArray(response.body['jsc']['rooms'],'dataset has an array')
        }).catch(function(err){
            expect.fail()
        })
    })
})
