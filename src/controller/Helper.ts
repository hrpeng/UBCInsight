

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

    public static parseToJson(content: any): any {
        // try {
        //     //var obj = JSON.parse(content);
        // } catch(e) {
        //     //throw error cannot parse
        // }
        if (typeof content === 'object'){
            if (isArray(content.result)){
                var jsonCourse: any = {};
                for (let i= 0; i < content.result.length; i++){
                    var section = content.result[i];
                    if (section === 'object' && section.Section !== "overall"){
                        var jsonSection = {"courses_dept": section.Subject, "courses_id": section.Course, "courses_avg":section.Avg,
                            "courses_instructor": section.Professor,"courses_title": section.Title, "courses_pass": section.Pass, "courses_fail" : section.Fail,
                            "courses_audit": section.Audit, "courses_year": section.Year};

                        jsonCourse.section.Section = jsonSection;
                    }
                }
            } else {
                // throw some kind of error specifying invalid course?
            }
        } else {
            //throw some error Invalid JSON Object
        }
        return jsonCourse;
    }
}