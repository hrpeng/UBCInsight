

import {isArray} from "util";

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
                //Helper.consoleLog(content)
                //has 112
                for (let i= 0; i < content.result.length; i++){
                    //var jsonCourse: any = {};
                    var section = content.result[i];
                    //has 112 so far
                    if (typeof section === 'object'){
                        //Helper.consoleLog(content.result.length)
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
                        var jsonSection = {[dept]: section.Subject, [cid]: section.Course, [sec]: section.Section, [avg]:section.Avg,
                            [instructor]: section.Professor,[title]: section.Title, [pass]: section.Pass, [fail] : section.Fail,
                            [audit]: section.Audit, [year]: section.Year, [uuid]: section['id'].toString()};
                        array.push(jsonSection);
                    }
                }
            }
        }
        return array;
    }

    // public static onComplete(jsonCourses : any, id:string){
    //
    // }

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
            for (var i = 1; i < keys.length; i++) { //length = 5945
                var aPromise = zip.file(keys[i]).async("string")
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


    public static parseData(id:any,content:any){
        "use strict";
        var JSZip = require('jszip');
        var keys: any[] = [];

        return new Promise(function (fulfill, reject) {
            JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                var files = zip['files'];
                keys = Object.keys(files)
                var jsonCourses: any = {};
                if(keys.length == 1){
                    reject('empty zip')
                }
                Helper.forLoop(keys,id,zip).then(function(jsonArray:any){
                    jsonCourses[id] = jsonArray
                    const fs = require('fs');
                    fs.writeFile(id, JSON.stringify(jsonCourses), (err : any) => {
                        if (err) throw err;
                    });
                    fulfill(jsonCourses)
                }).catch(function(e:any) {
                    reject(e)
                })
            })
        })
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
        var validWhere = Helper.validateWhere(where)
        var validOptions = Helper.validateOptions(options)
        if(validWhere.includes('invalid')){
            return validWhere
        }else if(validOptions != 'valid'){
            return validOptions
        }else {
            return validWhere
        }
    }
// NOT value should be a filter!! remember to fix that
    public static  validateWhere(where : any) : string {
        if(typeof where !== 'object') {
            return 'invalid object'
        }

        var whereKey = Object.keys(where)[0] //OR AND GT IS NOT etc...
        var whereValue = where[whereKey]    // value of OR NOT etc...
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
                            return 'invalid id, dataset has not been PUT'
                        }
                            var keyvar = key.split("_")[1]
                            if (keyvar != 'avg' && keyvar != 'fail' && keyvar != 'pass' && keyvar != 'audit') {
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
                            return 'invalid id, dataset has not been PUT'
                        }
                        var keyvar = key.split("_")[1]
                        if (keyvar != 'dept' && keyvar != 'id' && keyvar != 'instructor' && keyvar != 'title' && keyvar != 'uuid') {
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
                        return 'invalid LOGIC value'
                    } else {
                        if (whereValue.length == 0) {
                            return 'invalid LOGIC value'
                        }
                        var idName:string = ''
                        for (var i = 0; i < whereValue.length; i++) {
                            var validEach: string = Helper.validateWhere(whereValue[i])
                            if (validEach.includes('invalid')) {
                                return validEach
                            }else{
                                idName = validEach
                            }
                        }
                        return idName
                    }
            }
        return 'invalid WHERE'
    }

    public static  validateOptions(options : any) {
        if(typeof options !== 'object') {
            return 'invalid object'
        }

        var optionsKeys = Object.keys(options)//[0] //OR AND GT IS NOT etc...
        //console.log(optionsKeys)
        var fs = require('fs');
        if(!('COLUMNS' in options)){
            return 'absence of COLUMNS in OPTIONS'
        }
        if(!('FORM' in options)){
            return 'absence of FORM in OPTIONS'
        }
        for(var key of optionsKeys){
            if(key == 'COLUMNS'){
                if(!(options['COLUMNS'] instanceof Array)){
                    return 'invalid COLUMNS value'
                } else {
                    for(var element of options['COLUMNS']){
                        //console.log(element)
                        if(typeof element !== 'string' || !(element.includes('_'))){
                            return 'invalid COLUMNS key'
                        }else{
                            var id = element.split("_")[0]
                            try {
                                fs.accessSync('./' + id);
                            } catch (e) {
                                return 'invalid COLUMNS key'
                            }
                        }
                    }
                }
            } else if(key == 'ORDER') {
                if (typeof options['ORDER'] !== 'string' || !(options['ORDER'].includes('_'))) {
                    return 'invalid ORDER key'
                } else {
                    var orderId = options['ORDER'].split("_")[0]
                    var orderVar = options['ORDER'].split("_")[1] //uuid
                    try {
                        fs.accessSync('./' + orderId);
                    } catch (e) {
                        return 'invalid ORDER key'
                    }
                    if(!(options['COLUMNS'].includes(options['ORDER']))){
                        return 'invalid ORDER key'
                    }
                }
            } else if(key == 'FORM'){
                if(options['FORM'] != 'TABLE'){
                    return 'invalid FORM value'
                }
            }
        }
        // var whereValue = where[whereKey]    // value of OR NOT etc...
        // var key = Object.keys(where[whereKey])[0]  //courses_avg, courses_pass etc...
        // var value = whereValue[key]   //97 cpsc etc..
        return 'valid'
    }

    public static sort(input: any[], keyword: string){ //keyword: courses_avg, apple_uuid etc..
        var keyvar = keyword.split('_')[1]
        var spliced = input.splice(0)
        spliced.sort(function(a,b) {
            switch(keyvar){
                case "avg":
                case "pass":
                case "fail":
                case "audit":
                    return a[keyword] - b[keyword];
                case "dept":
                case "instructor":
                case "title":
                    var aobj = a[Object.keys(a)[0]]
                    var bobj = b[Object.keys(b)[0]]
                    var x = a[keyword].toLowerCase();
                    var y = b[keyword].toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                case "id":
                case "uuid":
                    var x: any = Number(a[keyword]);
                    var y: any = Number(b[keyword]);
                    return x < y ? -1 : x > y ? 1 : 0;
            }
        })
       // console.log(spliced)
        return spliced;
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