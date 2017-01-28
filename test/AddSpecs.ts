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
    var content0 = Helper.encodeZip('./cour.zip');

    var id = "courses";

    beforeEach(function () {
        isf = new InsightFacade();
    });

    afterEach(function () {
        isf = null;
    });

   function addData(id:any,content:any) {
       return new Promise(function (fulfill, reject) {
           Helper.exist('/courses/CPSC310/D1/addData2.0/1').then(function(b:any){
               if(b){
                   Helper.parseData(id, content).then(function(jsc:any){
                       var is: InsightResponse = {
                           code: 201,
                           body: {jsc}
                       }
                       Helper.consoleLog(is)
                       fulfill(is);
                   })
               } else {
                   Helper.parseData(id, content).then(function(jsc:any){
                       var is : InsightResponse = {
                           code: 204,
                           body:{jsc}
                       }
                       Helper.consoleLog(is)
                       fulfill(is);
                   })
               }
           }).catch(function(e:any){
               var is : InsightResponse = {
                   code: 204,
                   body:{"error": e}
               }
               reject(is);
           })
       })
   }

       /*return isf.addDataset('cour',content).then(function (parsed: InsightResponse) {
        Helper.consoleLog(parsed)
        //Log.test('Value: ' + value);
        // expect(value).to.equal(6);
        }).catch(function (err) {
        // Log.test('Error: ' + err);
        // expect.fail();
        })*/
    it("add", function () {
        isf.addDataset('Courses',content0)
        //Helper.consoleLog(addData('1',content0))
    })
})
