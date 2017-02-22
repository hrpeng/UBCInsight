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
import Rooms from "../src/controller/Rooms";
import roomObject from "../src/controller/Rooms";

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

    // it("add1", function () {
    //     isf.addDataset('apple',content)
    //     //Helper.consoleLog(addData('1',content0))
    // })
    // it("add2", function () {
    //     isf.addDataset('null', null).then(function(response : any){
    //         //Helper.consoleLog(response)
    //     }).catch(function(err){
    //         // Helper.consoleLog(err)
    //     });
    //     //Helper.consoleLog(addData('1',content0))
    // })
    // it("add3", function () {
    //     isf.addDataset('Courses',content).then(function(response : any){
    //         //Helper.consoleLog(response)
    //     }).catch(function(err){
    //         // Helper.consoleLog(err)
    //     })
    //     //Helper.consoleLog(addData('1',content0))
    // })
    // it("add4", function () {
    //     isf.addDataset('fileNoData',contentFND).then(function(response : any){
    //         //Helper.consoleLog(response)
    //     }).catch(function(err){
    //         // Helper.consoleLog(err)
    //     })
    // })
    //
    // it("add5", function () {
    //     isf.addDataset('noData',contentND).then(function(response : any){
    //         //Helper.consoleLog(response)
    //     }).catch(function(err){
    //         // Helper.consoleLog(err)
    //     })
    // })
    // it("remove", function () {
    //     return isf.removeDataset('shit').then(function(response : any){
    //         //Helper.consoleLog(response)
    //     }).catch(function(err){
    //        // Helper.consoleLog(err)
    //     })
    // })

    it("rooms", function () {
        Rooms.readIndex(room).then(function(trees:any){
            var roomsArray:roomObject[];
            var paths = Rooms.getPaths(trees)
            "use strict";
            var JSZip = require('jszip');
            JSZip.loadAsync(room, {base64: true}).then(function (zip: any) {
                var files = zip['files'];
                //Helper.consoleLog(zip.file(paths[1].substring(2)))
                var aPromise = zip.file(paths[1].substring(2)).async("string").then(function(building:any){
                    //parse a building
                    var section = Rooms.getPageSection(building);
                    //console.log(section);
                    for(var node of section['childNodes']){
                        if(node['nodeName'] == 'div'){
                            var view = node;
                        }
                    }
                    for (var node of view['childNodes']) {
                        var attrs = node['attrs']
                        if (typeof attrs === 'object' && attrs.length != 0) {
                            if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'view-content') {
                                var content = node
                            }
                            if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'view-footer') {
                                var roomsInfo = node
                                Rooms.footer(roomsInfo);
                            }
                        }
                    }
                    for (var node of content['childNodes']) {
                        if(node['nodeName'] == 'div'){
                            var row = node;
                        }
                    }
                    for (var node of row['childNodes']) {
                        var attrs = node['attrs']
                        if (typeof attrs === 'object' && attrs.length != 0) {
                            if (attrs[0]['name'] == 'id' && attrs[0]['value'] == 'buildings-wrapper') {
                                var bwrapper = node
                            }
                        }
                    }
                    for (var node of bwrapper['childNodes']) {
                        var attrs = node['attrs']
                        if (typeof attrs === 'object' && attrs.length != 0) {
                            if (attrs[0]['name'] == 'id' && attrs[0]['value'] == 'building-info') {
                                var buildingInfo = node
                            }
                        }
                    }
                    for (var node of buildingInfo['childNodes']) {
                        if(node['nodeName'] == 'h2'){
                            var h2 = node;
                            var span = h2['childNodes'][0]
                            var text = span['childNodes'][0]
                        }
                    }
                    var buildingName = text['value']
                    //Helper.consoleLog(buildingName)
                })


                //promiseList.push(aPromise)

            })
        })

    })
})
