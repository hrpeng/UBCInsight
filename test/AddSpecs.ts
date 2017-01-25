/**
 * Created by Peng on 2017/1/22.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Helper from "../src/controller/Helper";

describe("AddSpec", function () {
    var isf: InsightFacade = null;
    var content = Helper.encodeZip('/courses/CPSC310/D1/courses/cour.zip');

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

    it("add", function () {
        /*return isf.addDataset('cour',content).then(function (parsed: InsightResponse) {
            Helper.consoleLog(parsed)
            //Log.test('Value: ' + value);
           // expect(value).to.equal(6);
        }).catch(function (err) {
           // Log.test('Error: ' + err);
           // expect.fail();
        })*/
    });


}

