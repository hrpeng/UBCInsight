/**
 * Created by Peng on 2017/2/13.
 */
import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export interface roomObject {
    rooms_name: any;
    rooms_number: any;
    rooms_seats: any;
    rooms_furniture: any;
    rooms_type: any;
    rooms_href: any;
};

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
                            trees.push(node);
                        }
                    }
                    //console.log("trees");
                    //console.log(trees)
                    fulfill (trees);
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

    public static getPaths(trees: any){
        var array :any[] = [];
        for(var tree of trees) {
            var child = tree['childNodes']  // childNodes of ALRD
            for (var node of child) {
                var attrs = node['attrs']
                if (typeof attrs === 'object' && attrs.length != 0) {
                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-title') {
                        var td = node;
                    }
                }
            }
            for (var node of td['childNodes']) {
                if (node['nodeName'] == 'a') {
                    var a = node;
                }
            }
            for (var attr of a['attrs']) {
                if (attr['name'] == 'href') {
                    var path = attr['value']
                }
            }
            array.push(path)
        }
        return array
    }
    public static footer(footer: any) : roomObject[]{
        var rooms: roomObject[] = [];

        for (var node of footer['childNodes']) {
            if(node['nodeName'] == 'div'){
                var row = node;
            }
        }
        for (var node of row['childNodes']){
            var attrs = node['attrs'];
            if (typeof attrs === 'object' && attrs.length != 0) {
                if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'view-content') {
                    var content = node;
                }
            }
        }
        for (var node of content['childNodes']) {
            if (node['nodeName'] == 'table') {
                var table = node
            }
        }
        for (var node of table['childNodes']){
            if (node['nodeName'] == 'tbody'){
                var tbody = node;
            }
        }
        for (var node of tbody['childNodes']){
            if (node['nodeName'] == 'tr'){
                var room: roomObject = {
                    rooms_name: null,
                    rooms_number: null,
                    rooms_seats: null,
                    rooms_furniture: null,
                    rooms_type: null,
                    rooms_href: null
                };
                for (var td of node['childNodes']){
                    var attrs = td['attrs'];
                    if (typeof attrs === 'object' && attrs.length != 0) {
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-number') {
                            var tagA = td['childNodes'][1];
                            if (tagA['nodeName'] === "a"){
                                room.rooms_number = tagA['childNodes'][0]['value'];
                            }
                        }
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-capacity') {
                            if (td['childNodes'][0]['nodeName'] === "#text"){
                                var capacity = td['childNodes'][0]['value'];
                                var res = capacity.split(" ");
                                room.rooms_seats = res[12];
                            }
                        }
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-furniture') {
                            if (td['childNodes'][0]['nodeName'] === "#text"){
                                var str = td['childNodes'][0]['value'];
                                room.rooms_furniture = str.slice(13, str.length - 10);
                            }
                        }
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-type') {
                            if (td['childNodes'][0]['nodeName'] === "#text"){
                                var str = td['childNodes'][0]['value'];
                                room.rooms_type = str.slice(13, str.length - 10);
                            }
                        }
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-nothing') {
                            if (td['childNodes'][1]['nodeName'] === "a"){
                                var str = td['childNodes'][1]['attrs'][0]['value'];
                                room.rooms_href = str;
                                var res = str.slice(69).replace("-", "_");
                                room.rooms_name = res;
                            }
                        }
                    }
                }
                console.log(room);
                rooms.push(room);
            }
        }
        return rooms;
    }
}