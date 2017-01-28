

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
                        var jsonSection = {"courses_dept": section.Subject, "courses_id": section.Course, "courses_sec": section.Section, "courses_avg":section.Avg,
                            "courses_instructor": section.Professor,"courses_title": section.Title, "courses_pass": section.Pass, "courses_fail" : section.Fail,
                            "courses_audit": section.Audit, "courses_year": section.Year};
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
}