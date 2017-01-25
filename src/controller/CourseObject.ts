/**
 * Created by Peng on 2017/1/19.
 */

class CourseObject {
    courses_dept: string;
    courses_id: string;
    courses_avg: number;
    courses_instructor: string;
    courses_title: string;
    courses_pass: number;
    courses_fail: number;
    courses_audit: number;
    course_sec: string

    constructor(dept : string, id : string, avg : number, instructor : string, title : string, pass : number, fail : number, audit : number, sec : string) {
        this.courses_dept = dept;
        this.courses_id = id;
        this.courses_avg = avg;
        this.courses_instructor = instructor;
        this.courses_title = title;
        this.courses_pass = pass;
        this.courses_fail = fail;
        this.courses_audit = audit;
        this.course_sec = sec;
    }
}