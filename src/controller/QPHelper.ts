/**
 * Created by austinparkk on 2/3/17.
 */

import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";

export default class QPHelper{

    public static QRHelper(query: QueryRequest){
        var keys = Object.keys(query.WHERE);
        if (keys.length === 1){
            var filterName: string = keys[0].toString();
            var whereFinal: any = QPHelper.whichCase(filterName, query.WHERE[filterName]);
        } else {
            // throw some type of error, query.WHERE can only consist of 1 filter
        }

        var columnKeywords = query.OPTIONS['COLUMNS']
        //console.log(whereFinal)
        //console.log(columnKeywords)
        var columnOutput = Helper.columnsPick(whereFinal,columnKeywords)
        var orderKeyword = query.OPTIONS['ORDER']
        //console.log(columnOutput);
        var final = Helper.sort(columnOutput,orderKeyword)
        //console.log(final);

        return final;
    }

    public static whichCase(typeOfFilter: string, object: any): any[] {
        //console.log(object);
        var arrayMeetsCondition: any[] = []; // array to return
        switch(typeOfFilter) {  // keys[0] is the key. Can be "AND", "OR", "LT" etc..
            case "AND":
                //console.log("hit AND");
                arrayMeetsCondition = QPHelper.ANDfunction(object);
                break;
            case "OR":
                //console.log("hit OR in whichCase");
                arrayMeetsCondition = QPHelper.ORfunction(object);
                break;
            case "LT":
                arrayMeetsCondition = QPHelper.MCFunction(object, "LT");
                break;
            case "GT":
                //console.log("hit GT");
                arrayMeetsCondition = QPHelper.MCFunction(object, "GT");
                break;
            case "EQ":
                //console.log("hit this line");
                arrayMeetsCondition = QPHelper.MCFunction(object, "EQ");
                break;
            case "IS":
                //console.log("hit IS");
                arrayMeetsCondition = QPHelper.isFunction(object);
                break;
            case "NOT":
                arrayMeetsCondition = QPHelper.NOTfunction(object);
                break;
        }
        //console.log(arrayMeetsCondition);
        return arrayMeetsCondition;
    }

    public static NOTfunction(object: any): any{
        var returnArray: any = [];
        var keys = Object.keys(object);
        if (keys[0].toString() === "AND"){


        }
        if (keys[0].toString() === "OR"){

        }
        if (keys[0].toString() === "GT"){
            var amcArray1 = QPHelper.whichCase("LT", object[keys[0].toString()]);
            var amcArray2 = QPHelper.whichCase("EQ", object[keys[0].toString()]);
            returnArray = Helper.union(amcArray1, amcArray2);
        }
        if (keys[0].toString() === "LT"){

            var amcArray1 = QPHelper.whichCase("GT", object[keys[0].toString()]);
            var amcArray2 = QPHelper.whichCase("EQ", object[keys[0].toString()]);
            returnArray = Helper.union(amcArray1, amcArray2);
        }
        if (keys[0].toString() === "IS"){
            var key = Object.keys(object[keys[0].toString()]);
            var obj = Helper.readJSON("./Courses");
            var sectionsArray = obj.Courses;  // array of all sections /// CHANGE TO COURSES TO ID!!!!!!
            //var check1Element = Object.keys(object);
            //console.log(check1Element);
            var courses_key = key[0].toString();   // key refers to something like courses_avg !!!FIGURE THIS OUT
            //console.log(courses_key);
            //console.log(object[keys[0].toString()]);
            var value = object[keys[0].toString()][courses_key];  // the value at that key so for "courses_avg" : 90, value is 90.
            //console.log(value);

            for (let section of sectionsArray) {      // Iterate through all the course sections using for loop
                var courseCode = Object.keys(section);  // course code is aanb504
                var ccString = courseCode[0].toString()
                if (section[ccString][courses_key] !== value) {  //and if the value in the section that corresponds to courses_key is < value
                    returnArray.push(section);                   // add that course into the list of return courses
                }
            }
        }
        if (keys[0].toString() === "EQ") {
            var key = Object.keys(object[keys[0].toString()]);
            //console.log(key);
            if  (typeof key[0] === 'number'){
                var amcArray1 = QPHelper.whichCase("LT", object[keys[0].toString()]);
                var amcArray2 = QPHelper.whichCase("GT", object[keys[0].toString()]);
                returnArray = Helper.union(amcArray1,amcArray2);
            }
            else {
                //console.log("hit line");
                var obj = Helper.readJSON("./Courses");
                var sectionsArray = obj.Courses;  // array of all sections /// CHANGE TO COURSES TO ID!!!!!!
                //var check1Element = Object.keys(object);
                //console.log(check1Element);
                var courses_key = key[0].toString();   // key refers to something like courses_avg !!!FIGURE THIS OUT
                //console.log(courses_key);
                //console.log(object[keys[0].toString()]);
                var value = object[keys[0].toString()][courses_key];  // the value at that key so for "courses_avg" : 90, value is 90.
                //console.log(value);

                for (let section of sectionsArray) {      // Iterate through all the course sections using for loop
                    var courseCode = Object.keys(section);  // course code is aanb504
                    var ccString = courseCode[0].toString()
                    if (section[ccString][courses_key] !== value) {  //and if the value in the section that corresponds to courses_key is < value
                        returnArray.push(section);                   // add that course into the list of return courses
                    }
                }
            }
        }
        return returnArray;
    }

    public static MCFunction(object: any, comp: string): any{
        var obj = Helper.readJSON("./Courses");
        var sectionsArray = obj.Courses;  // array of all sections /// CHANGE TO COURSES TO ID!!!!!!
        //console.log(sectionsArray);
        var arrayMeetsCondition: any[] = []; // array to return

        var check1Element = Object.keys(object);
        var courses_key = check1Element[0].toString();   // key refers to something like courses_avg !!!FIGURE THIS OUT
        //var keyvar = courses_key.split("_")[1];

        //console.log(keyvar);

        var value = object[courses_key];  // the value at that key so for "courses_avg" : 90, value is 90.

        for (let section of sectionsArray){      // Iterate through all the course sections using for loop
            var courseCode = Object.keys(section);  // course code is aanb504
            var ccString = courseCode[0].toString()
            //console.log(ccString);
            //console.log(courses_key);
            //console.log(section.ccString[courses_key]);
            if (comp === "LT"){
                if (section[ccString][courses_key] < value){  //and if the value in the section that corresponds to courses_key is < value
                    arrayMeetsCondition.push(section);        // add that course into the list of return courses
                }
            }
            if (comp === "GT") {
                if (section[ccString][courses_key] > value) {  //and if the value in the section that corresponds to courses_key is < value
                    //console.log("hit this");
                    arrayMeetsCondition.push(section);        // add that course into the list of return courses
                }
            }
            if (comp === "EQ") {
                if (section[ccString][courses_key] === value) {  //and if the value in the section that corresponds to courses_key is < value
                    arrayMeetsCondition.push(section);        // add that course into the list of return courses
                }
            }
        }

        //console.log(arrayMeetsCondition);
        return arrayMeetsCondition;
    }

    public static isFunction(object: any): any{
        var obj = Helper.readJSON("./Courses");
        var sectionsArray = obj.Courses;  // array of all sections CHANGE COURSES TO ID
        var arrayMeetsCondition: any[] = []; // array to return

        var keys3 = Object.keys(object);  // keys3 is array of courses_avg etc..
        //console.log(keys3);
        for (let k of keys3){
            k = k.toString();
            //console.log(k);  //k = courses_dept
            var value = object[k].toString();
            //console.log(value);  //value = aanb
            for (let sec of sectionsArray){
                var keysec = Object.keys(sec);
                //console.log(keysec[0]);

                //console.log(sec[keysec[0]][k]);
                if (sec[keysec[0]][k] === value) {
                    arrayMeetsCondition.push(sec);
                }
            }
        }
        //console.log(arrayMeetsCondition);
        return arrayMeetsCondition;
    }
    public static ANDfunction(object: any[]): any{
       // console.log(object)
        var arrayMeetsCondition: any[] = [];
        //if (isArray(object)) {
            var keyq = Object.keys(object[0]);
           // console.log(object[0][keyq[0]])
            arrayMeetsCondition = QPHelper.whichCase(keyq[0].toString(), object[0][keyq[0].toString()]);
            for (let i = 1; i < object.length; i++) {
                var condKey = Object.keys(object[i]);
                arrayMeetsCondition = Helper.intersection(arrayMeetsCondition, QPHelper.whichCase(condKey[0], object[i][condKey[0]]));
            }
        //}
        return arrayMeetsCondition;
    }

    public static ORfunction(object: any[]): any{
        var arrayMeetsCondition: any[] = [];
        //if (isArray(object)) {
            for (let i = 0; i < object.length; i++) {
                var condKey = Object.keys(object[i]);
                //console.log(QPHelper.whichCase(condKey[0], object[i][condKey]));
                //console.log("first");
                // console.log(arrayMeetsCondition);
                arrayMeetsCondition = Helper.union(arrayMeetsCondition, QPHelper.whichCase(condKey[0], object[i][condKey[0]]));
                // console.log("second");
                //console.log(arrayMeetsCondition);
            }
       // }
        return arrayMeetsCondition;
    }
}