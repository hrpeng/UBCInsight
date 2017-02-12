/**
 * Created by Peng on 2017/1/22.
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
    var content = Helper.encodeZip('./courses.zip');
    var content0 = Helper.encodeZip('./cour.zip');
    var contentND = Helper.encodeZip('./noData.zip');
    var contentFND = Helper.encodeZip('./fileNoData.zip');

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

    it("add", function () {
        isf.addDataset('apple',content)
        //Helper.consoleLog(addData('1',content0))
    })
    it("add", function () {
        isf.addDataset('null', null);
        //Helper.consoleLog(addData('1',content0))
    })
    it("add", function () {
        isf.addDataset('Courses',content).then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
            // Helper.consoleLog(err)
        })
        //Helper.consoleLog(addData('1',content0))
    })
    it("add", function () {
        isf.addDataset('fileNoData',contentFND)
    })

    it("add", function () {
        isf.addDataset('noData',contentND)
    })
    it("remove", function () {
        return isf.removeDataset('shit').then(function(response : any){
            //Helper.consoleLog(response)
        }).catch(function(err){
           // Helper.consoleLog(err)
        })
    })

})
