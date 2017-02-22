/**
 * Created by Peng on 2017/2/13.
 */
import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export default class Rooms {

    public static readIndex(content: string){
        return new Promise(function (fulfill, reject) {
            "use strict";
            var JSZip = require('jszip');
            var keys: any[] = [];
            JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                var files = zip['files'];
                keys = Object.keys(files)
                zip.file(keys[keys.length - 1]).async("string").then(function (data: any) {
                    var bsm : any = Rooms.getPageSection(data)
                    for (var node of bsm['childNodes']) {
                        var attrs = node['attrs']
                        if (typeof attrs === 'object' && attrs.length != 0) {
                            if (attrs[0]['name'] == 'class') {
                                var view = node
                            }
                        }
                    }
                    for (var node of view['childNodes']) {
                        var attrs = node['attrs']
                        if (typeof attrs === 'object' && attrs.length != 0) {
                            if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'view-content') {
                                var vContent = node
                            }
                        }
                    }
                    for (var node of vContent['childNodes']) {
                        if (node['nodeName'] == 'table') {
                            var table = node
                        }
                    }
                    for (var node of table['childNodes']) {
                        if (node['nodeName'] == 'tbody') {
                            var tbody = node
                        }
                    }
                    var trees: any[] = [];
                    for (var node of tbody['childNodes']) {
                        if (node['nodeName'] == 'tr') {
                            // var path = Rooms.getPath(node)
                            // trees.push(path)
                            var building = Rooms.parseBuilding(node)

                        }
                    }
                    //console.log(trees)
                    fulfill (trees);
                    //fulfill(path)
                }).catch(function (err: any) {
                    //error handling
                })
            }).catch(function (e: any) {
                //not a zip file
            })
        })
    }

    public static getPageSection(data: any){
        const parse5 = require('parse5');
        const document = parse5.parse(data);
        var childnodes = document['childNodes']
        for (var node of childnodes) {
            if (node['nodeName'] == 'html') {
                var html = node
            }
        }
        for (var node of html['childNodes']) {
            if (node['nodeName'] == 'body') {
                var body = node
            }
        }
        for (var node of body['childNodes']) {
            var attrs = node['attrs']
            if (typeof attrs === 'object' && attrs.length != 0) {
                if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'full-width-container') {
                    var fwc = node
                }
            }
        }
        for (var node of fwc['childNodes']) {
            var attrs = node['attrs']
            if (typeof attrs === 'object' && attrs.length != 0) {
                if (attrs[0]['name'] == 'id' && attrs[0]['value'] == 'main') {
                    var main = node
                }
            }
        }
        for (var node of main['childNodes']) {
            var attrs = node['attrs']
            if (typeof attrs === 'object' && attrs.length != 0) {
                if (attrs[0]['name'] == 'id' && attrs[0]['value'] == 'content') {
                    var content = node
                }
            }
        }
        for (var node of content['childNodes']) {
            if (node['nodeName'] == 'section') {
                var bsm = node
            }
        }
        return bsm
    }

    // not used anymore
    public static getPath(tree: any){
        //var array :any[] = [];
        //for(var tree of trees) {
            var child = tree['childNodes']  // childNodes of ALRD
            for (var node of child) {
                var attrs = node['attrs']
                if (typeof attrs === 'object' && attrs.length != 0) {
                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-title') {
                        var td = node
                    }
                }
            }
            for (var node of td['childNodes']) {
                if (node['nodeName'] == 'a') {
                    var a = node
                }
            }
            for (var attr of a['attrs']) {
                if (attr['name'] == 'href') {
                    var path = attr['value']
                }
            }
            //array.push(path)
        //}
        //return array
        return path
    }

    public static parseBuilding(tree: any){
        var room:any = {}
        for (var node of tree['childNodes']) {
            var attrs = node['attrs']
            if (typeof attrs === 'object' && attrs.length != 0) {

                if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-building-code') {
                    var rooms_shortname = node['childNodes'][0]['value']
                    room['room_shortname'] = rooms_shortname.trim()
                }else if(attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-title'){
                    for(var cNode of node['childNodes']){
                        if (cNode['nodeName'] == 'a'){
                            for (var attr of cNode['attrs']) {
                                if (attr['name'] == 'href') {
                                    var path = attr['value'] //  path is here <-----------------
                                }
                            }
                            var rooms_fullname = cNode['childNodes'][0]['value']
                            room['room_fullname'] = rooms_fullname
                        }
                    }
                }else if(attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-building-address'){
                    var rooms_address = node['childNodes'][0]['value']
                    room['room_address'] = rooms_address.trim()
                    var encodedAds = encodeURI(rooms_address)
                    var request = 'http://skaha.cs.ubc.ca:11316/api/v1/team181/1933%20West%20Mall'//'http://skaha.cs.ubc.ca:11316/api/v1/team181/' + encodedAds
                    var http = require('http')
                    // geocoding that does not work
                    // return new Promise(function (fulfill, reject) {
                    //
                    //     var aPromise = new Promise(function (resolve, reject) {
                    //         http.get(request, function (res: any) {
                    //             Helper.consoleLog('Hi!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                    //             resolve(res)
                    //         })
                    //     })
                    //     var a = aPromise.then(function (r: any) {
                    //         Helper.consoleLog('Hi!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                    //
                    //         return r
                    //     })
                    //     //Helper.consoleLog(a)
                    //     fulfill(a)
                    //
                    // })

                }
            }
        }
        //Helper.consoleLog(room)
        //console.log(bCode)
    }
}