/**
 * Created by Peng on 2017/2/13.
 */
import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export interface roomObject {
    rooms_name: string
    rooms_number: string
    rooms_seats: number
    rooms_furniture: string
    rooms_type: string
    rooms_href: string
    rooms_shortname: string
    rooms_fullname: string
    rooms_address :string
    rooms_lat :number
    rooms_lon:number

}

interface GeoResponse {
    lat?: number;
    lon?: number;
    error?: string;
}

export default class Rooms {

    public static readIndex(content: string) : Promise<any> {
        "use strict";
        const JSZip = require('jszip');
        var keys: any[] = [];

        return new Promise(function (fulfill, reject) {
            JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                var files = zip['files'];
                keys = Object.keys(files)
                Rooms.parseIndex(zip,keys[keys.length - 1]).then(function(result:any){
                    //console.log(result)
                    fulfill(result)
                }).catch(function(e:any){
                    //console.log(e)
                    reject(e)
                })
            }).catch(function (e: any) {
                console.log(e)
                reject(e);
                //not a zip file
            })
        })
    }

    public static parseIndex(zip: any, iKey:any) : Promise<any>{
        return new Promise(function(fulfill,reject) {
            var buildings: any[] = [];
            var allBuildings: any[] = []
            var json:any = {}
            zip.file(iKey).async("string").then(function (data: any) {
                //console.log(JSON.parse(data))
                var bsm: any = Rooms.getPageSection(data)
                if(bsm === undefined){
                    reject('wrong id')
                }
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
                        var tbody = node;
                        //console.log(tbody)
                    }
                }
                for (var node of tbody['childNodes']) {
                    if (node['nodeName'] == 'tr') {
                        buildings.push(node)
                    }
                }
                for(var i = 1; i < buildings.length; i++) {
                    (function(e) {
                        Rooms.parseBuilding(buildings[e], zip).then(function (b: any) {
                            allBuildings = allBuildings.concat(b);
                            if (e == buildings.length - 1) {
                                //console.log(allBuildings)
                                json['rooms'] = allBuildings
                                const fs = require('fs');
                                fs.writeFile('rooms', JSON.stringify(json), (err : any) => {
                                    if (err) throw err;
                                });
                                fulfill(json)
                            }
                        }).catch(function(e:any){
                            console.log(e)
                            reject(e)
                        })
                    })(i)
                }
            }).catch(function (err: any) {
                reject(err);
                //error handling
            })
        })
    }

    public static requestURL(request: string): Promise<GeoResponse> {
        return new Promise(function (fulfill, reject) {
            var http = require('http');
            //console.log(encodedAds);
            http.get(request, (res: any) => {
                const statusCode = res.statusCode;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error(`Invalid content-type.\n` +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.log(error.message);
                    // consume response data to free up memory
                    res.resume();
                    var gp: GeoResponse = {
                        error: error.message
                    }
                    reject(gp);
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk:any) => rawData += chunk);
                res.on('end', () => {
                    try {
                        let parsedData = JSON.parse(rawData);
                        //console.log(parsedData);
                        //parsedData['lat']
                        var gp1: GeoResponse = {
                            lat: parsedData['lat'],
                            lon: parsedData['lon']
                        };
                        fulfill(gp1);
                    } catch (e) {
                        console.log(e.message);
                        var gp2: GeoResponse = {
                            error: e.message
                        };
                        reject(gp2);
                    }
                });
            }).on('error', (e:any) => {
                console.log(`Got error: ${e.message}`);
            });
        })
    }

    public static getPageSection(data: any){
        const parse5 = require('parse5');
        const document = parse5.parse(data);
        //console.log(document)
        var childnodes = document['childNodes']
        for (var node of childnodes) {
            if (node['nodeName'] == 'html') {
                var html = node
            }
        }
        //console.log(html)
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
        if(fwc === undefined){
            return fwc
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

    public static parseBuilding(tree: any, zip:any) : Promise<any>{
        return new Promise(function(fulfill,reject) {
            var rooms: any[] = []
            var room: any = {}
            var nodes : any = []
            for (var node of tree['childNodes']) {
                var attrs = node['attrs']
                if (typeof attrs === 'object' && attrs.length != 0) {
                    nodes.push(node)
                }
            }
            var rooms_shortname = nodes[1]['childNodes'][0]['value']
            room['room_shortname'] = rooms_shortname.trim()
            var rooms_address = nodes[3]['childNodes'][0]['value']
            room['room_address'] = rooms_address.trim()
            var encodedAds = encodeURI(rooms_address.trim())
            Rooms.requestURL('http://skaha.cs.ubc.ca:11316/api/v1/team181/' + encodedAds).then(function(response:any) {
                //console.log(response)
                room['room_lat'] = response.lat
                room['room_lon'] = response.lon

                for (var cNode of nodes[2]['childNodes']) {
                    if (cNode['nodeName'] == 'a') {
                        var rooms_fullname = cNode['childNodes'][0]['value']
                        room['room_fullname'] = rooms_fullname
                        for (var attr of cNode['attrs']) {
                            if (attr['name'] == 'href') {
                                var path = attr['value']
                            }
                        }
                    }
                }
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
                }).catch(function(e:any){
                    reject(e)
                })
            }).catch(function(e:any){
                console.log(e)
                reject(e)
            })
        })
    }

    public static footer(zip:any, path:any):Promise<any>{
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
                                rooms_name: undefined,
                                rooms_number: undefined,
                                rooms_seats: undefined,
                                rooms_furniture: undefined,
                                rooms_type: undefined,
                                rooms_href: undefined,
                                rooms_shortname: undefined, //= rm['rooms_shortname'],
                                rooms_fullname: undefined,
                                rooms_address : undefined,
                                rooms_lat : undefined,
                                rooms_lon: undefined
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
                                            room.rooms_seats = Number(res[12]);
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
            }).catch(function(e:any) {
                reject(e)
            })
        })
    }
}