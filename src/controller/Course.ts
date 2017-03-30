/**
 * Created by austinparkk on 3/28/17.
 */
// export default class Course{
//     courseName: string;
//     Size: number;
//     numberOfSections: number;
//     room: string;
//     time: number;
//     day: string;
//
//     constructor(name:string, size: number, sections: number, room: string, t: number, day: string){
//         this.courseName = name
//         this.Size = size
//         this.numberOfSections = sections
//         this.room = room;
//         this.time = t
//         this.day = day
//     }
// }

export interface Course {
    courseName: string;
    Size: number;
    numberOfSections: number;
    room: string;
    time: number;
    day: string;
}