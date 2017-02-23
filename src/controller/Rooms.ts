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
    rooms_shortname: any
    rooms_fullname: any
    rooms_address :any
    rooms_lat :any
    rooms_lon:any

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
                            //console.log(tbody)
                            var buildings : any[] = [];
                            var allBuildings: any[] = []

                            for (var node of tbody['childNodes']) {
                                if (node['nodeName'] == 'tr') {
                                    buildings.push(node)
                                }
                            }
                             for (var i = 0; i < buildings.length; i++ ){
                                 //console.log(i)
                                Rooms.parseBuilding(buildings[i], zip).then(function(z:any){
                                    //console.log(i)
                                     allBuildings = allBuildings.concat(z)
                                    if(i = buildings.length - 1){
                                        //console.log(allBuildings)
                                        fulfill(allBuildings)
                                    }

                                })
                             }
                            //console.log(buildings)

                        }
                    }


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

    public static parseBuilding(tree: any, zip:any){
        return new Promise(function(fulfill,reject) {
            var rooms: any[] = []
            var room: any = {}
            for (var node of tree['childNodes']) {
                var attrs = node['attrs']
                if (typeof attrs === 'object' && attrs.length != 0) {
                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-building-code') {
                        var rooms_shortname = node['childNodes'][0]['value']
                        room['room_shortname'] = rooms_shortname.trim()

                    } else if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-building-address') {
                        var rooms_address = node['childNodes'][0]['value']
                        room['room_address'] = rooms_address.trim()
                        var encodedAds = encodeURI(rooms_address)
                        var request = 'http://skaha.cs.ubc.ca:11316/api/v1/team181/1933%20West%20Mall'//'http://skaha.cs.ubc.ca:11316/api/v1/team181/' + encodedAds
                        var http = require('http')
                        var rooms_lat = 49.26125;
                        room['room_lat'] = rooms_lat;
                        var rooms_lon = -123.24807;
                        room['room_lon'] = rooms_lon;
                        //dummy lat & lon <-------------------------------------
                    } else if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-title') {
                        for (var cNode of node['childNodes']) {
                            if (cNode['nodeName'] == 'a') {
                                var rooms_fullname = cNode['childNodes'][0]['value']
                                room['room_fullname'] = rooms_fullname
                                for (var attr of cNode['attrs']) {
                                    if (attr['name'] == 'href') {
                                        var path = attr['value']
                                        Rooms.footer(zip, path).then(function (roomInfo: any) { // roomInfo is an array of rooms in one building
                                            for (var rm of roomInfo) {
                                                rm['rooms_shortname'] = room.room_shortname
                                                rm['rooms_fullname'] = room.room_fullname
                                                rm['rooms_address'] = room.room_address
                                                rm['rooms_lat'] = room.room_lat
                                                rm['rooms_lon'] = room.room_lon
                                                rooms.push(rm)

                                            }
                                            //console.log(rooms)
                                            fulfill(rooms)
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    public static footer(zip:any, path:any){
         //Helper.consoleLog(rm[0])
        return new Promise(function(fulfill,reject) {
            zip.file(path.substring(2)).async("string").then(function (building: any) {
                var section = Rooms.getPageSection(building)
                for (var node of section['childNodes']) {
                    if (node['nodeName'] == 'div') {
                        var view = node;
                    }
                }
                for (var node of view['childNodes']) {
                    var attrs = node['attrs']
                    if (typeof attrs === 'object' && attrs.length != 0) {
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'view-footer') {
                            var footer = node
                        }
                    }
                }

                var rooms: roomObject[] = [];

                for (var node of footer['childNodes']) {
                    if (node['nodeName'] == 'div') {
                        var row = node;
                    }
                }
                for (var node of row['childNodes']) {
                    var attrs = node['attrs'];
                    if (typeof attrs === 'object' && attrs.length != 0) {
                        if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'view-content') {
                            var content = node;
                            //console.log(content)
                        }
                    }
                }
                if (typeof content === 'object') {
                    for (var node of content['childNodes']) {
                        //console.log(content['childNodes'])
                        if (node['nodeName'] == 'table') {
                            var table = node
                        }
                    }
                }
                if (typeof table === 'object') {
                    for (var node of table['childNodes']) {
                        if (node['nodeName'] == 'tbody') {
                            var tbody = node;
                        }
                    }
                }
                if (typeof tbody === 'object') {
                    for (var node of tbody['childNodes']) {
                        if (node['nodeName'] == 'tr') {
                            var room: roomObject = {
                                rooms_name: null,
                                rooms_number: null,
                                rooms_seats: null,
                                rooms_furniture: null,
                                rooms_type: null,
                                rooms_href: null,
                                rooms_shortname: null, //= rm['rooms_shortname'],
                                rooms_fullname: null,
                                rooms_address : null,
                                rooms_lat : null,
                                rooms_lon: null
                            };
                            for (var td of node['childNodes']) {
                                var attrs = td['attrs'];
                                if (typeof attrs === 'object' && attrs.length != 0) {
                                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-number') {
                                        var tagA = td['childNodes'][1];
                                        if (tagA['nodeName'] === "a") {
                                            room.rooms_number = tagA['childNodes'][0]['value'];
                                        }
                                    }
                                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-capacity') {
                                        if (td['childNodes'][0]['nodeName'] === "#text") {
                                            var capacity = td['childNodes'][0]['value'];
                                            var res = capacity.split(" ");
                                            room.rooms_seats = res[12];
                                        }
                                    }
                                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-furniture') {
                                        if (td['childNodes'][0]['nodeName'] === "#text") {
                                            var str = td['childNodes'][0]['value'];
                                            room.rooms_furniture = str.slice(13, str.length - 10);
                                        }
                                    }
                                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-field-room-type') {
                                        if (td['childNodes'][0]['nodeName'] === "#text") {
                                            var str = td['childNodes'][0]['value'];
                                            room.rooms_type = str.slice(13, str.length - 10);
                                        }
                                    }
                                    if (attrs[0]['name'] == 'class' && attrs[0]['value'] == 'views-field views-field-nothing') {
                                        if (td['childNodes'][1]['nodeName'] === "a") {
                                            var str = td['childNodes'][1]['attrs'][0]['value'];
                                            room.rooms_href = str;
                                            var res = str.slice(69).replace("-", "_");
                                            room.rooms_name = res;
                                        }
                                    }
                                }
                            }
                            rooms.push(room);
                        }
                    }
                    //console.log(rooms)
                    fulfill(rooms)
                }
            })
        })
    }
}