

import {isArray} from "util";
import Rooms from "./Rooms";
import {type} from "os";

export default class Helper {

    public static consoleLog(content:any) {
            console.log(content);
    }

    public static encodeZip(path : string) {
        "use strict";
        const fs = require('fs');
        var JSZip = require('jszip');

        var text = fs.readFileSync(path, 'base64')
        //console.log(text)
        return text;
    };

    public static parseToJson(content: any, id: string): any {
        var array : any[] = []
        if (typeof content === 'object'){
            if (isArray(content.result)){
                for (let i= 0; i < content.result.length; i++){
                    var section = content.result[i];
                    //console.log(section);
                    //has 112 so far
                    if (typeof section === 'object'){
                        var dept = id + "_dept"
                        var cid = id + "_id"
                        var sec = id + "_sec"
                        var avg = id + "_avg"
                        var instructor = id + "_instructor"
                        var title = id + "_title"
                        var pass = id + "_pass"
                        var fail = id + "_fail"
                        var audit = id + "_audit"
                        var year = id + "_year"
                        var uuid = id + "_uuid"
                        if (section.Section === "overall"){
                            section.Year = 1900;
                        }
                        var jsonSection = {[dept]: section.Subject, [cid]: section.Course, [sec]: section.Section, [avg]:section.Avg,
                            [instructor]: section.Professor,[title]: section.Title, [pass]: section.Pass, [fail] : section.Fail,
                            [audit]: section.Audit, [year]: Number(section.Year), [uuid]: section['id'].toString()};

                        array.push(jsonSection);
                    }
                }
            }
        }
        return array;
    }

    public static exist(path:string) : Promise<boolean>{
        return new Promise(function(resolve, reject) {
            var fs = require('fs');
            fs.exists(path, (exists:any) => {
                //Helper.consoleLog(exists)
                resolve(exists)
            })
        });
    }

    public static forLoop(keys: any, id: any, zip:any){
        return new Promise(function(fulfill,reject) {
            var jsonCoursesArray: any[] = [];
            var promiseList: any[] = [];
            if(zip.file(keys[keys.length-1]).name == 'index.htm'){
                reject('wrong id')
            }
            for (var i = 1; i < keys.length; i++) { //length = 5945
                var aPromise = zip.file(keys[i]).async("string")
                //console.log(zip.file(keys[i]))
                promiseList.push(aPromise)
                //Helper.consoleLog(promiseList)
            }

            Promise.all(promiseList).then(function (data: any) {
                //Helper.consoleLog(data)
                for(var d of data) {
                    var json = JSON.parse(d);
                    jsonCoursesArray = jsonCoursesArray.concat(Helper.parseToJson(json, id)); //[{section},{section},{section}]
                }
                if(jsonCoursesArray.length == 0){
                    reject('zip file with no real data')
                }
                fulfill(jsonCoursesArray);
            }).catch(function(err:any){
                reject(err)
            })
        })
    }


    public static parseData(id:any,content:any) : Promise<Object>{
        if(id == 'rooms'){
            return new Promise(function (fulfill, reject) {
                Rooms.readIndex(content).then(function (res: any) {
                    //console.log(res)
                    fulfill(res)
                }).catch(function(err:any){
                    //console.log(err)
                    reject(err)
                })
            })
        }else {
            "use strict";
            var JSZip = require('jszip');
            var keys: any[] = [];

            return new Promise(function (fulfill, reject) {
                JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                    var files = zip['files'];
                    keys = Object.keys(files)
                    //console.log(keys)
                    var jsonCourses: any = {};
                    if (keys.length == 1) {
                        reject('empty zip')
                    }
                    Helper.forLoop(keys, id, zip).then(function (jsonArray: any) {
                        jsonCourses[id] = jsonArray
                        const fs = require('fs');
                        fs.writeFile(id, JSON.stringify(jsonCourses), (err: any) => {
                            if (err) throw err;
                        });
                        fulfill(jsonCourses)
                    }).catch(function (e: any) {
                        reject(e)
                    })
                }).catch(function (e: any) {
                    reject('invalid zip file')
                })
            })
        }
    }

    public static readJSON(path : string) {
        var fs = require('fs');
        var o = fs.readFileSync(path,'utf8')
        var obj = JSON.parse(o)
        return obj;
    }

    public static validate(query : any) {
        // if(typeof query !== 'object') {
        //     return 'invalid query';
        // }
        var where = query['WHERE'];
        var options = query['OPTIONS']
        var validWhere
        if(Object.keys(where).length === 0){
            validWhere = "return all"
        }else {
            validWhere = Helper.validateWhere(where)
        }
        var validOptions = Helper.validateOptions(options, query);
        if (query['TRANSFORMATIONS']){
            var transformations = query['TRANSFORMATIONS']
            var validTransformations = Helper.validateTransformations(transformations, options);
        }

        if(validWhere instanceof Array){
            return validWhere
        }else if(validWhere.includes('invalid')){
            return validWhere
        }else if(validOptions.includes('invalid')){
            return validOptions
        }else if(query['TRANSFORMATIONS'] && validTransformations !== 'valid'){
            return validTransformations
        } else if(validWhere == 'return all'){
            return validOptions
        }
        else {
            return validWhere
        }
    }

    // validateTransformations also checks that everything in OPTIONS->COLUMNS exists in either GROUP OR APPLY
    public static validateTransformations(transformations: any, options: any) : any {
        if (typeof transformations !== 'object'){
            return 'invalid object'
        }
        var transKeys = Object.keys(transformations); // GROUP/APPLY
        if(transKeys[0] !== 'GROUP'){
            return 'invalid OPTIONS: absence of GROUP in TRANSFORMATIONS'
        }
        if(transKeys[1] !== 'APPLY'){
            return 'invalid OPTIONS: absence of APPLY in TRANSFORMATIONS'
        }
        var group = transformations[transKeys[0]];
        var apply = transformations[transKeys[1]];
        if (!isArray(group) || !(group.length > 0)){
            return 'invalid group: group is not an array or does not have at least 1 element'
        } else{
            for (let g of group){
                if (g.includes("_")){
                    var keyVar = g.split("_")[1]
                    if (keyVar !== 'shortname' && keyVar !== 'name' && keyVar !== 'number' && keyVar !== 'seats' && keyVar !== 'furniture' && keyVar !== 'type'
                        && keyVar !== 'fullname' &&keyVar !==  'address' && keyVar !== 'lat' && keyVar !== 'lon' && keyVar !== 'dept' && keyVar !== 'id' && keyVar !== 'avg' && keyVar !== 'instructor'
                        && keyVar !== 'title' && keyVar !== 'pass' && keyVar !== 'fail' && keyVar !== 'year' && keyVar !== 'uuid' && keyVar !== 'audit'){
                        return 'invalid GROUP elements'
                    }
                } else {
                    return 'invalid group element: no "_"';
                }
            }
        }
        if (!isArray(apply)){
            return 'invalid, apply is not an array'
        }
        var termsInApply: any[] = [];
        for (let i of apply){          // create an array of the keys in apply to check with COLUMNS
            var applyKeys = Object.keys(i)[0]; //maxSeats
            termsInApply.push(applyKeys);
        }
        var allTerms = termsInApply.concat(group);  // keys in both group and apply, used for verifying columns
        for (let column of options['COLUMNS']){        // check if everything in columns is either in GROUP or is defined in APPLY
            // if (allTerms.some(x =>  column !== x)){
            //     return 'invalid, key defined in column does no exist in GROUP or APPLY'
            // }
            var flag: boolean = false
            for (let term of allTerms){
                if (column === term){
                    flag = true;
                }
            }
            if (flag === false){
                return 'invalid, key defined in column does no exist in GROUP or APPLY'
            }
        }

        var validateApp = Helper.validateApply(apply);
        //console.log(validateApp)
        if (validateApp.includes('invalid')){
            return validateApp;
        }
        // checking if ORDER->KEYS contains elements defined in APPLY because it is easier to do here
        if (typeof options['ORDER'] == 'object'){
            var keysFromOrder = options['ORDER']['keys'];
            if(keysFromOrder != undefined && keysFromOrder.length != 0) {
                for (let k of keysFromOrder) {
                    var f: boolean = false
                    for (let term of options['COLUMNS']) {
                        if (k === term) {
                            f = true;
                        }
                    }
                    // if k is not defined in apply then return error message
                    if (f === false) {
                        return 'invalid ORDER: Order key needs to be included in columns'
                    }
                }
            }else{
                return 'invalid ORDER: keys cannot be empty'
            }
        }
        return 'valid';
    }

    public static validateApply(apply: any): any{
        var appKeys :any = []
        for (let a of apply){
            if (typeof a == 'object'){
                var applyKey = Object.keys(a);
                //console.log(applyKey);
                if(appKeys.includes(applyKey[0])){
                    return 'invalid: no two apply keys should have the same name'
                }
                appKeys.push(applyKey[0])
                if (!applyKey[0].includes("_") && typeof a[applyKey[0]] == 'object'){
                    var applyToken = Object.keys(a[applyKey[0]])[0];
                    if (applyToken === 'MAX' || applyToken ==='MIN' || applyToken ==='AVG' ||applyToken === 'COUNT' || applyToken ==='SUM' ) {
                        var applyVar = a[applyKey[0]][applyToken].split("_")[1]
                        if (applyToken == 'COUNT'){
                            if( applyVar !== 'shortname' && applyVar !== 'name' && applyVar !== 'number' && applyVar !== 'seats' && applyVar !== 'furniture' && applyVar !== 'type'
                            && applyVar !== 'fullname' && applyVar !==  'address' && applyVar !== 'lat' && applyVar !== 'lon' && applyVar !== 'dept' && applyVar !== 'id' && applyVar !== 'avg' && applyVar !== 'instructor'
                            && applyVar !== 'title' && applyVar !== 'pass' && applyVar !== 'fail' && applyVar !== 'year' && applyVar !== 'uuid' && applyVar !== 'audit') {
                                return 'invalid item in ApplyToken';
                            }
                        }else {
                            if (applyVar !== 'avg' && applyVar !== 'fail' && applyVar !== 'pass' && applyVar !== 'audit'
                                && applyVar !=='lat' && applyVar !== 'lon' && applyVar !== 'seats' && applyVar !== 'year') {
                                return 'invalid item in ApplyToken';
                            }
                        }
                    }else {
                        return 'invalid APPLYTOKEN';
                    }
                }else{
                    return 'invalid APPLY definition'
                }
            } else {
                return 'invalid APPLY Element'
            }
        }
        return 'valid'
    }

    public static  validateWhere(where : any) : any {
        if(typeof where !== 'object') {
            return 'invalid object'
        }

        var whereKey = Object.keys(where)[0] //OR AND GT IS NOT etc...
        var whereValue = where[whereKey]    // value of OR NOT etc...
        //console.log(whereValue);
        var key = Object.keys(where[whereKey])[0]  //courses_avg, courses_pass etc...
        var value = whereValue[key]   //97 cpsc etc..

        var fs = require('fs');
        switch (whereKey) {
            case 'GT':
            case 'LT':
            case 'EQ':
                if (!key.includes("_")) {
                    return 'invalid MCOMPARISON key'
                } else {
                    var idName = key.split("_")[0]  //courses
                    try {
                        fs.accessSync('./' + idName);
                    } catch (e) {
                        var arr :any[] = []
                        arr.push(idName)
                        return arr
                        //return 'invalid id, dataset has not been PUT'
                    }
                    var keyvar = key.split("_")[1]
                    if (keyvar != 'avg' && keyvar != 'fail' && keyvar != 'pass' && keyvar != 'audit' && keyvar != 'lat'
                        && keyvar != 'lon' && keyvar != 'seats' && keyvar != 'year') {
                        return 'invalid MCOMPARISON key'
                    } else if (typeof value !== 'number') {
                        return 'invalid MCOMPARISON value'
                    }
                    return idName
                }

            case 'IS':
                if (!key.includes("_")) {
                    return 'invalid SCOMPARISON key'
                } else {
                    var id = key.split("_")[0]
                    try {
                        fs.accessSync('./' + id);
                    } catch (e) {
                        var arr :any[] = []
                        //return 'invalid id, dataset has not been PUT'
                        arr.push(id)
                        return arr
                    }
                    var keyvar = key.split("_")[1]
                    if (keyvar != 'dept' && keyvar != 'id' && keyvar != 'instructor' && keyvar != 'title' && keyvar != 'uuid' && keyvar != 'fullname' && keyvar != 'shortname' && keyvar != 'number' && keyvar != 'name' && keyvar != 'address'
                        && keyvar != 'type' && keyvar != 'furniture' && keyvar != 'href') {
                        return 'invalid MCOMPARISON key'
                    } else if (typeof value !== 'string') {
                        return 'invalid MCOMPARISON value'
                    }
                    return id
                }

            case 'NOT':
                return Helper.validateWhere(whereValue)
            case 'AND':
            case 'OR':
                if (!(whereValue instanceof Array)) {
                    //console.log("asdf");
                    return 'invalid LOGIC value'
                } else {
                    if (whereValue.length == 0) {
                        return 'invalid LOGIC value'
                    }
                    var totalArray:any[] = []
                    var idName:string = '!'
                    for (var i = 0; i < whereValue.length; i++) {
                        var validEach: any = Helper.validateWhere(whereValue[i])
                        if(validEach instanceof Array){
                            totalArray = totalArray.concat(validEach)
                        }
                        if(totalArray.length == 0){
                            if (validEach.includes('invalid')) {
                                return validEach
                            } else {
                                if(idName != '!' && idName != validEach){
                                    return 'invalid set of id names'
                                }
                                idName = validEach
                            }
                        }
                    }
                    if(totalArray.length != 0){
                        return totalArray
                    }
                    return idName
                }
        }
        return 'invalid WHERE'
    }

    public static  validateOptions(options : any, query: any) {
        if(typeof options !== 'object') {
            return 'invalid object'
        }

        var idName;
        var optionsKeys = Object.keys(options)//[0] //OR AND GT IS NOT etc...
        //console.log(optionsKeys)
        var fs = require('fs');
        if(!('COLUMNS' in options)){
            return 'invalid OPTIONS: absence of COLUMNS in OPTIONS'
        }
        if(!('FORM' in options)){
            return 'invalid OPTIONS: absence of FORM in OPTIONS'
        }
        for(var key of optionsKeys){
            if(key == 'COLUMNS'){
                if(!(options['COLUMNS'] instanceof Array)){
                    return 'invalid COLUMNS value'
                } else {
                    for(var element of options['COLUMNS']){
                        //console.log(element)
                        // if(typeof element !== 'string' || !(element.includes('_'))){
                        //     return 'invalid COLUMNS key'
                        // }else{
                        //     var id = element.split("_")[0]
                        //     try {
                        //         fs.accessSync('./' + id);
                        //     } catch (e) {
                        //         return 'invalid COLUMNS key'
                        //     }
                        // }
                        if(typeof element == 'string'){
                            if (element.includes('_')){
                                idName = element.split("_")[0]
                                try {
                                    fs.accessSync('./' + idName);
                                } catch (e) {
                                    return 'invalid COLUMNS key'
                                }
                            } else if(!query['TRANSFORMATIONS']){
                                return 'invalid COLUMNS key'
                            }
                        } else{
                            return 'invalid COLUMNS key'
                        }
                    }
                }
            } else if(key == 'ORDER') {
                if (typeof options['ORDER'] == 'object'){
                    // implement object case here
                    // WTFF!!!????
                    var keys1 = Object.keys(options['ORDER']);
                    //console.log(keys1);
                    if (keys1.length === 2 && keys1[0] === 'dir' && keys1[1] === 'keys'){
                        if (options['ORDER']['dir'] !== 'UP' && options['ORDER']['dir'] !== 'DOWN'){
                            //console.log(options['ORDER']['dir']);
                            return 'invalid ORDER: dir key'
                        }
                        if (isArray(options['ORDER']['keys'])){
                            var keysArray = options['ORDER']['keys'];
                            for (let i of keysArray){
                                if (i.includes("_")){
                                    if (!(i.split("_")[1] === 'shortname' || 'name' || 'number' || 'seats' || 'furniture' || 'type'
                                        || 'fullname' || 'address' || 'lat' || 'lon' || 'dept' || 'id' || 'sec' || 'avg' || 'instructor'
                                        || 'title' || 'pass' || 'fail' || 'year' || 'uuid' || 'audit')){
                                        return 'invalid ORDER: bad key elements'
                                    }
                                }
                            }
                        } else {
                            return 'invalid ORDER: keys is not an array'
                        }
                    } else {
                        return 'invalid ORDER'
                    }
                    for (let k of options['ORDER']['keys']){
                        // if (!(options['COLUMNS'].includes(k))){
                        //     return 'invalid ORDER key: not included in COLUMNS'
                        // }
                        if (k.includes('_')) {
                            var orderId = k.split("_")[0]
                            try {
                                fs.accessSync('./' + orderId);
                            } catch (e) {
                                return 'invalid id, dataset has not been PUT'
                            }
                        }
                    }
                }else if (typeof options['ORDER'] === 'string' && (options['ORDER'].includes('_'))) {
                    //console.log("hit here");
                    var orderId = options['ORDER'].split("_")[0]
                    try {
                        fs.accessSync('./' + orderId);
                    } catch (e) {
                        return 'invalid id, dataset has not been PUT'
                    }
                    if(!(options['COLUMNS'].includes(options['ORDER']))){
                        return 'invalid ORDER key: not included in COLUMNS'
                    }
                } else if(typeof options['ORDER'] === 'string' && !(options['ORDER'].includes('_'))) {
                    if(!query['TRANSFORMATIONS']){
                        return "invalid ORDER key"
                    }
                    var applies = query['TRANSFORMATIONS']['APPLY']
                    var inApply = false
                    for(var item of applies) {
                        if(Object.keys(item)[0] == options['ORDER']){
                            inApply = true
                        }
                    }
                    // if k is not defined in columns then return error message
                    if (f === false) {
                        return 'invalid ORDER: Order key needs to be defined in Columns'
                    }
                }
            } else if(key == 'FORM'){
                if(options['FORM'] != 'TABLE'){
                    return 'invalid FORM value'
                }
            }
        }
        //console.log('returns valid');
        return idName
    }

    public static sort(input: any[], keyword: any){ //keyword: courses_avg, apple_uuid etc..
        //console.log(keyword);
        var spliced = input.splice(0)
        let that = this;
        //console.log(spliced);
        var inp = keyword;
        spliced.sort(function(a,b) {
            var order = 1;
            //console.log("hit")
            if (typeof inp == 'object') {
                //console.log("hit object");
                if (keyword['dir'] === "DOWN") {
                    //console.log("hit here");
                    order = -1;
                }
                inp = keyword['keys']
            }
            var i = 0;
            return order*(that.sortHelper(a,b, inp, i));
        })
        return spliced;
    }

    public static sortHelper(a: any, b:any, keyword: any, i : any) : number{
        var keyVar: any;
        if (typeof keyword == 'string') {
            if (keyword.includes('_')){
                keyVar = keyword.split('_')[1]
            }else{
                keyVar = keyword;
            }
        }else if (isArray(keyword)) {
            keyVar = keyword[i].split('_')[1]
        }
        //i++;
        switch(keyVar){
            case "avg":
            case "pass":
            case "fail":
            case "audit":
            case "lat":
            case "lon":
            case "seats":
            case "year":
                //console.log("hit seats");
                if (isArray(keyword)){
                    var returnValue = a[keyword[i]] - b[keyword[i]];
                }else{
                    var returnValue = a[keyword] - b[keyword];
                }
                if (returnValue === 0){
                    if (isArray(keyword) && typeof keyword[i+1] !== 'undefined' ){
                        //console.log("hit");
                        returnValue = Helper.sortHelper(a, b, keyword, i+1);
                    }
                }
                return returnValue;
            case "dept":
            case "instructor":
            case "title":
            case "fullname":
            case "shortname":
            case "name":
            case "type":
            case "furniture":
            case "href":
            case "address":
                var x:any;
                var y:any;
                if (isArray(keyword)){
                    x = a[keyword[i]].toLowerCase();
                    y = b[keyword[i]].toLowerCase();
                }else{
                    x = a[keyword].toLowerCase();
                    y = b[keyword].toLowerCase();
                }
                var returnValue1 = x < y ? -1 : x > y ? 1 : 0;
                if (returnValue1 === 0 && typeof keyword[i+1] !== 'undefined' && isArray(keyword)){
                    //keyword.splice(0,1);
                    //console.log(keyword);
                    returnValue1 = Helper.sortHelper(a, b, keyword, i+1);
                }
                return returnValue1;
            case "id":
            case "uuid":
            case "number":
            default:
                var c: any;
                var d: any;
                if (isArray(keyword)){
                    c = Number(a[keyword[i]]);
                    d = Number(b[keyword[i]]);
                }else{
                    c = Number(a[keyword]);
                    d = Number(b[keyword]);
                }
                var returnValue2 = c < d ? -1 : c > d ? 1 : 0;
                if (returnValue2 === 0 && typeof keyword[i+1] !== 'undefined' && isArray(keyword)){
                    returnValue2 = Helper.sortHelper(a, b, keyword, i+1);
                }
                return returnValue2
        }
    }

    public static columnsPick(input: any[], keywords: any[]){
        var newArray : any[] = [];
        for(var section of input){
            var newColumns : any = {}
            for(var key of keywords){
                newColumns[key] = section[key]
            }
            newArray.push(newColumns)
        }
        return newArray
    }
}