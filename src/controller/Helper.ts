

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
        return Helper.validateWhere(where);
    }

    public static  validateWhere(where : any) {
        var whereKey = Object.keys(where)[0] //OR AND GT IS NOT etc...
        var whereValue = where[whereKey]    // value of OR NOT etc...
        var key = Object.keys(where[whereKey])[0]  //courses_avg, courses_pass etc...
        var value = whereValue[key]   //97 cpsc etc..

        if( whereKey != 'GT' && whereKey != 'LT'  && whereKey != 'EQ'  && whereKey != 'AND' && whereKey != 'OR' && whereKey != 'IS' && whereKey != 'NOT'){
            return 'invalid WHERE'
        }else if(whereKey == 'GT' || whereKey =='LT' || whereKey == 'EQ'){
            if (!key.includes("_")){
                return 'invalid MCOMPARISON key'
            } else {
                var id = key.split("_")[0]
                try {
                    Helper.readJSON('./' + id)
                } catch (err) {
                    return 'dataset has not been PUT'
                }
                var keyvar = key.split("_")[1]
                if(keyvar != 'avg' && keyvar != 'fail' && keyvar != 'pass' && keyvar != 'audit'){
                    return 'invalid MCOMPARISON key'
                } else if (typeof value !== 'number') {
                    return 'invalid MCOMPARISON value'
                }
            }
        }else if(whereKey == 'IS'){
            if (!key.includes("_")){
                return 'invalid SCOMPARISON key'
            } else {
                var id = key.split("_")[0]
                try {
                    Helper.readJSON('./' + id)
                } catch (err) {
                    return 'dataset has not been PUT'
                }
                var keyvar = key.split("_")[1]
                if(keyvar != 'dept' && keyvar != 'id' && keyvar != 'instructor' && keyvar != 'title'&& keyvar != 'uuid'){
                    return 'invalid MCOMPARISON key'
                } else if (typeof value !== 'string') {
                    return 'invalid MCOMPARISON value'
                }
            }
        } else if (whereKey == 'NOT'){
            Helper.validateWhere(value)
        } else if (whereKey == 'AND' || whereKey == 'OR'){
            if(!(whereValue instanceof Array)){
                return  'invalid LOGIC value'
            } else {
                for(var i = 0; i < whereValue.length; i++){
                    var validEach : string = Helper.validateWhere(whereValue[i])
                    if(validEach != 'valid'){
                        return validEach
                    }
                }
            }
        }


        return 'valid'
    }

}