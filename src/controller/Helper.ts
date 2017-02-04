

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

    public static parseToJson(content: any, id: string, array : Object[]): any {
        if (typeof content === 'object'){
            if (isArray(content.result)){
                for (let i= 0; i < content.result.length; i++){
                    var jsonCourse: any = {};
                    var section = content.result[i];
                    if (typeof section === 'object' && section.Section !== "overall"){
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
                        var property = section.Subject + section.Course;
                        jsonCourse[property] = jsonSection;
                        array.push(jsonCourse);
                    }
                }
            } else {
                // throw some kind of error specifying invalid course?
            }
        } else {
            //throw some error Invalid JSON Object
        }
        return array;
    }

    public static onComplete(jsonCourses : any, id:string){
        const fs = require('fs');
        fs.writeFile(id, JSON.stringify(jsonCourses), (err : any) => {
            if (err) throw err;
        });
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
            var jsonCourses: any = {};
            for (var i = 1; i < keys.length; i++) {
                (function (i: any) {
                    zip.file(keys[i]).async("string").then(function (data: any) {
                        var json = JSON.parse(data);
                        //parse one course
                        Helper.parseToJson(json, id, jsonCoursesArray); //[{section},{section},{section}]
                        if (i == keys.length - 1) {
                            jsonCourses[id] = jsonCoursesArray
                            Helper.onComplete(jsonCourses, id);
                            fulfill(jsonCourses);
                        }
                    })
                })(i)
            }
        })
    }

    public static parseData(id:any,content:any){
        "use strict";
        var JSZip = require('jszip');
        var keys: any[] = [];
        return new Promise(function (fulfill, reject) {
            var promise = JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                var files = zip['files'];
                keys = Object.keys(files)
                Helper.forLoop(keys,id,zip).then(function(jsonCourses:any){
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
        if(typeof query !== 'object') {
            return 'query is not an object';
        }
        var where = query['WHERE'];
        var options = query['OPTIONS']
        var validWhere = Helper.validateWhere(where)
        var validOptions = Helper.validateOptions(options)
        if(validWhere != 'valid'){
            return validWhere
        }else if(validOptions != 'valid'){
            return validOptions
        }else {
            return 'valid'
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

            switch (whereKey) {
                case 'GT':
                case 'LT':
                case 'EQ':
                    if (!key.includes("_")) {
                        return 'invalid MCOMPARISON key'
                    } else {
                        var id = key.split("_")[0]
                        try {
                            Helper.readJSON('./' + id)
                        } catch (err) {
                            return 'dataset has not been PUT'
                        }
                        var keyvar = key.split("_")[1]
                        if (keyvar != 'avg' && keyvar != 'fail' && keyvar != 'pass' && keyvar != 'audit') {
                            return 'invalid MCOMPARISON key'
                        } else if (typeof value !== 'number') {
                            return 'invalid MCOMPARISON value'
                        }
                    }
                    return 'valid'
                case 'IS':
                    if (!key.includes("_")) {
                        return 'invalid SCOMPARISON key'
                    } else {
                        var id = key.split("_")[0]
                        try {
                            Helper.readJSON('./' + id)
                        } catch (err) {
                            return 'dataset has not been PUT'
                        }
                        var keyvar = key.split("_")[1]
                        if (keyvar != 'dept' && keyvar != 'id' && keyvar != 'instructor' && keyvar != 'title' && keyvar != 'uuid') {
                            return 'invalid MCOMPARISON key'
                        } else if (typeof value !== 'string') {
                            return 'invalid MCOMPARISON value'
                        }
                    }
                    return 'valid'
                case 'NOT':
                    return Helper.validateWhere(value)
                case 'AND':
                case 'OR':
                    if (!(whereValue instanceof Array)) {
                        return 'invalid LOGIC value'
                    } else {
                        if (whereValue.length == 0) {
                            return 'empty LOGIC value'
                        }
                        for (var i = 0; i < whereValue.length; i++) {
                            var validEach: string = Helper.validateWhere(whereValue[i])
                            if (validEach != 'valid') {
                                return validEach
                        }
                    }
                    return 'valid'
                }
            }
        return 'invalid WHERE'
    }
// value of ORDER should be one of element in COLOMNS!!! remember to fix that
    public static  validateOptions(options : any) {
        if(typeof options !== 'object') {
            return 'invalid object'
        }

        var optionsKeys = Object.keys(options)//[0] //OR AND GT IS NOT etc...
        //console.log(optionsKeys)
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
                        if(typeof element !== 'string' || !(element.includes('_'))){
                            return 'invalid key'
                        }
                    }
                }
            } else if(key == 'ORDER'){
                if(typeof options['ORDER'] !== 'string' || !(options['ORDER'].includes('_'))){
                    return 'invalid key'
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
    public static intersection(array1: any[], array2: any[]): any{
        var arrayret: any[] = [];
        //console.log("reached intersection()");
        //console.log(array1);
        //console.log(array2);

        for (let el of array1){
            var keys = Object.keys(el);

            //console.log(el);
            for (let el2 of array2) {
                var keys1 = Object.keys(el2);
                //console.log(el2);
                if (el[keys[0]].Courses_uuid=== el2[keys1[0]].Courses_uuid){ // change this to courses_uuid when ready!!
                    //console.log("it's equal");
                    arrayret.push(el);
                    break;
                }
            }
        }
        //console.log(arrayret);
        return arrayret;
    }

    public static union(array1: any[], array2: any[]): any {
        var returnArray = array1.concat(array2);
        for(var i=0; i<returnArray.length; ++i) {
            for(var j=i+1; j<returnArray.length; ++j) {
                if(returnArray[i] === returnArray[j])
                    returnArray.splice(j--, 1);
            }
        }
        return returnArray;
    }

    public static sort(input: any[], keyword: string){ //keyword: courses_avg, apple_uuid etc..
        var keyvar = keyword.split('_')[1]
        var spliced = input.splice(0)
        var ps = spliced.sort(function(a,b) {
            switch(keyvar){
                case "avg":
                case "pass":
                case "fail":
                case "audit":
                    var aobj = a[Object.keys(a)[0]]
                    var bobj = b[Object.keys(b)[0]]
                    //console.log(aobj[keyword])
                    return aobj[keyword] - bobj[keyword];
                case "dept":
                case "instructor":
                case "title":
                    var aobj = a[Object.keys(a)[0]]
                    var bobj = b[Object.keys(b)[0]]
                    var x = aobj[keyword].toLowerCase();
                    var y = bobj[keyword].toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                case "id":
                case "uuid":
                    var aobj = a[Object.keys(a)[0]]
                    var bobj = b[Object.keys(b)[0]]
                    var x: any = Number(aobj[keyword]);
                    var y: any = Number(bobj[keyword]);
                    return x < y ? -1 : x > y ? 1 : 0;
            }
        })
        //console.log(ps)
        return spliced;
    }
}