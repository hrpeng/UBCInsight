/**
 * Created by austinparkk on 3/28/17.
 */
import {InsightResponse, QueryRequest} from "./IInsightFacade";
import InsightFacade from "./InsightFacade";
import {isArray} from "util";
import {Course} from "./Course";
import Helper from "./Helper";

export default class Scheduler{

    public static scheduler(input:any){
        var courses = input['courses']
        var buildings = input['buildings']
        return new Promise(function(fulfill, reject){
            var MWF: any[] = []; // 9 courses between 8AM to 5PM
            var TTh: any[] = []; // 6 courses between 8AM to 5PM
            var overflow: any[] = [];
            var coursesList: any = [];
            var roomsList: any = [];
            var schedule: any ;
            var coursesPoorTime = 0;
            Scheduler.queryCourses(courses).then(function(res){
                coursesList = res;
                Scheduler.queryRooms(buildings).then(function(res){
                    roomsList = res;
                    //console.log(coursesList);
                    for (let course of coursesList){
                        for (let room of roomsList){
                            if (room['rooms_seats'] >= course.Size){  // can refine this
                                course.room = room['rooms_name'];
                                roomsList.splice(roomsList.indexOf(room), 1);
                                let i = course.numberOfSections;
                                while (i > 0) {
                                    var duplicate : Course = {"courseName":course.courseName, "Size": course.Size, "numberOfSections": course.numberOfSections, "room": course.room, "time": course.time, "day":course.day};
                                    if (MWF.length < 9) {
                                        MWF.push(duplicate);
                                    } else if (TTh.length < 6) {
                                        TTh.push(duplicate);
                                    } else if (MWF.length <= 15) {
                                        coursesPoorTime++;
                                        MWF.push(duplicate)
                                    } else if (TTh.length <= 10){
                                        coursesPoorTime++;
                                        TTh.push(duplicate);
                                    } else {
                                        overflow.push(duplicate);
                                    }
                                    i--;
                                }
                                break;
                            }
                        }
                    }
                    for (let i=0; i<MWF.length; i++){
                        var myDate = new Date();
                        myDate.setHours(8+i, 0, 0, 0);

                        var time = myDate.getHours() + ":" + myDate.getMinutes() + myDate.getMinutes();
                        MWF[i].time = time;
                        MWF[i].day = "MWF";

                    }
                    for (let i=0; i<TTh.length; i++){
                        var myDate = new Date();
                        myDate.setHours(8+i, 30*i, 0, 0);

                        var time: string;
                        if (myDate.getMinutes() === 0){
                            time = myDate.getHours() + ":" + "00";
                        }else {
                            time = myDate.getHours() + ":" + myDate.getMinutes();
                        }
                        TTh[i].time = time;
                        TTh[i].day = "TTh"
                    }
                    for(let i of overflow){
                        i.day = "overflow"
                    }
                    schedule = (MWF.concat(TTh)).concat(overflow);
                    var quality = coursesPoorTime/coursesList.length;
                    //console.log(schedule)
                    var is : InsightResponse = {
                        code: 200,
                        body: { 'render': 'TABLE', 'result': schedule, 'Quality': quality}
                    }
                    //console.log(is)
                    fulfill(is);
                }).catch(function (err:any){
                    var is : InsightResponse = {
                        code: 400,
                        body: {"error": err}
                    }
                    reject(is);
                })
            }).catch(function (err:any){
                var is : InsightResponse = {
                    code: 400,
                    body: {"error": err}
                }
                reject(is);
            })
        })
    }

    public static queryCourses(courses: any){
        return new Promise(function(fulfill, reject){
            var isf: InsightFacade = new InsightFacade();
            var and1: any[] = [];
            and1.push({ "EQ": {"courses_year": 2014}});
            var or: any[] = [];
            var orObject = {"OR": or};

            if (isArray(courses)){
                for (let course of courses){
                    if (course.includes("_")) {
                        var and2: any[] = [];
                        var andObject = {"AND": and2};
                        var dept = course.split("_")[0]
                        var id = course.split("_")[1]
                        var isDept = {
                            "IS": {
                                "courses_dept": dept
                            }
                        }
                        var isId = {
                            "IS": {
                                "courses_id": id
                            }
                        }
                        and2.push(isDept);
                        and2.push(isId);
                        andObject["AND"] = and2;
                        or.push(andObject);
                        //promisesArray.push(isf.performQuery(query))
                    } else {
                        var isDept = {
                            "IS": {
                                "courses_dept": course
                            }
                        }
                        or.push(isDept);
                    }
                }
                //console.log(or);
                orObject["OR"] = or;
                and1.push(orObject);
                //console.log(and1);
                var query: QueryRequest = {
                    "WHERE":{
                        "AND": and1
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_pass",
                            "courses_fail",
                            "courses_sec"
                        ],
                        "ORDER":"courses_id",
                        "FORM":"TABLE"
                    }
                }
            } else {
                return "courses and rooms are not lists";
            }
            return isf.performQuery(query).then(function(response:any){
                //console.log(response.body);
                var response1: any = Scheduler.courseHelper(response.body)
                //console.log("this is res" + response1)
                if (!isArray(response1)){
                    var is : InsightResponse = {
                        code: 400,
                        body: {"error": response1}
                    }
                    reject(is);
                }
                fulfill(response1);
            }).catch(function(err:any){
                reject("could not perform the Query");
            })
        })
    }

    public static queryRooms(buildings:any){
        return new Promise(function (fulfill, reject){
            if(typeof buildings === "string"){
                Scheduler.distanceHelper(buildings).then(function(result:any){
                    //console.log(result);
                    fulfill(result);
                }).catch(function(err:any){
                    reject(err);
                })
            }
            if (isArray(buildings)){
                var isf: InsightFacade = new InsightFacade();
                var or: any[] = [];

                for (let building of buildings) {
                    var isObject = {"IS": {"rooms_shortname": ""}};
                    isObject["IS"]["rooms_shortname"] = building;
                    or.push(isObject);
                }

                var query: QueryRequest = {
                    "WHERE": {
                        "OR": or
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_name",
                            "rooms_seats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["rooms_name", "rooms_seats"]
                        },
                        "FORM": "TABLE"
                    }
                }
                //console.log(query);
                isf.performQuery(query).then(function(response:any){
                    fulfill(response.body["result"]);
                }).catch(function(err:any){
                    reject("query for buildings failed");
                })
            }
        })
    }

    public static distanceHelper(building: string){
        return new Promise(function (fulfill, reject){
            if (typeof building == "string"){
                if(building.includes("_")){
                    var isf: InsightFacade = new InsightFacade();
                    var results: any[] = [];
                    var distance = Number(building.split("_")[0])
                    var buildingName = building.split("_")[1]
                    var allRooms = {
                        "WHERE": {
                        },
                        "OPTIONS": {
                            "COLUMNS": [
                                "rooms_name",
                                "rooms_seats",
                                "rooms_lat",
                                "rooms_lon"
                            ],
                            "ORDER": {
                                "dir": "DOWN",
                                "keys": ["rooms_name", "rooms_seats"]
                            },
                            "FORM": "TABLE"
                        }
                    }
                    var buildingQuery = {
                        "WHERE": {
                            "IS": {
                                "rooms_shortname": buildingName
                            }
                        },
                        "OPTIONS": {
                            "COLUMNS": [
                                "rooms_name",
                                "rooms_seats",
                                "rooms_lat",
                                "rooms_lon"
                            ],
                            "ORDER": {
                                "dir": "DOWN",
                                "keys": ["rooms_name", "rooms_seats"]
                            },
                            "FORM": "TABLE"
                        }
                    }

                    isf.performQuery(allRooms).then(function (allRooms: any){
                        isf.performQuery(buildingQuery).then(function(buildingRooms: any){
                            var lat2
                            var lon2
                            var R = 6371; // Radius of the earth in km
                            //console.log(buildingRooms.body['result'][0]);
                            var lat1 = buildingRooms.body['result'][0]["rooms_lat"]
                            var lon1 = buildingRooms.body['result'][0]["rooms_lon"]
                            for (let i = 0; i < allRooms.body['result'].length; i++) {
                                lat2 = allRooms.body['result'][i]["rooms_lat"]
                                lon2 = allRooms.body['result'][i]["rooms_lon"]
                                var dLat = Scheduler.deg2rad(lat2 - lat1);  // deg2rad below
                                var dLon = Scheduler.deg2rad(lon2 - lon1);
                                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(Scheduler.deg2rad(lat1)) * Math.cos(Scheduler.deg2rad(lat2)) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                var d = R * c * 1000; // Distance in km
                                if (d <= distance) {
                                    results.push(allRooms.body['result'][i])
                                }
                            }
                            fulfill(results);
                        }).catch(function (err){
                            reject(err);
                        })
                    }).catch(function (err){
                        reject(err);
                    })
                }
                else {
                    reject("no _");
                }
            } else{
                reject("Not String");
            }
        })
    }

    public static courseHelper(responseBody: any){
        if (responseBody['result'].length > 0) {
            var course_deptAcc: any = 0;
            var course_idAcc: any = 0;
            var courses: any[] = [];
            var deptAndId: any[] = [];
            //console.log(responseBody['result']);
            for (let object of responseBody['result']) {
                if (!(object["courses_dept"] === course_deptAcc && object["courses_id"] === course_idAcc)) {
                    course_deptAcc = object["courses_dept"];
                    course_idAcc = object["courses_id"];
                    deptAndId.push(course_deptAcc);
                    deptAndId.push(course_idAcc);
                }
            }
            //console.log(deptAndId);
            for (let i = 0; i < deptAndId.length; i = i + 2) {
                var numberOfSections = 0;
                var comparator: any = undefined;
                var size: number = 0;
                for (let object of responseBody['result']) {
                    if (object["courses_dept"] === deptAndId[i] && object["courses_id"] === deptAndId[i + 1]) {
                        if (object["courses_sec"] !== "overall") {
                            numberOfSections++;
                            if (comparator === undefined) {
                                comparator = object;
                                //console.log("hit here");
                            }
                            size = object["courses_fail"] + object["courses_pass"]
                            if (size > (comparator["courses_fail"] + comparator["courses_pass"])) {
                                comparator = object;
                            }
                        }
                    }
                }
                var course:Course = {"courseName": comparator["courses_dept"] + comparator["courses_id"],
                "Size": comparator["courses_fail"] + comparator["courses_pass"],
                "numberOfSections": Math.ceil(numberOfSections/3),
                "room": "",
                "time": 0,
                "day": ""}
                // var course = new Course(comparator["courses_dept"] + comparator["courses_id"], comparator["courses_fail"] + comparator["courses_pass"],
                //     Math.ceil(numberOfSections/3),"", 0, "");
                // var course = {"courseName":"", "Size": 0, "Number of Sections": 0, "Room": "", "Time": 0};
                // course["courseName"] = comparator["courses_dept"] + comparator["courses_id"];
                // course["Size"] = comparator["courses_fail"] + comparator["courses_pass"];
                // course["Number of Sections"] = Math.ceil(numberOfSections/3);
                //console.log(course);
                courses.push(course);
            }
            //console.log(courses);
            return courses;
        }
        return "result length is 0";
    }

    public static deg2rad(deg: any) {
        return deg * (Math.PI/180)
    }
}