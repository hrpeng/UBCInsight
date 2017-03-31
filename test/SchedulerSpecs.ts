
/**
 * Created by austinparkk on 3/28/17.
 */
import {expect} from 'chai';
import {assert} from 'chai';
import Log from "../src/Util";
import Scheduler from "../src/controller/Scheduler";

describe("SchedulerSpec", function () {
    var courseList = ["cpsc_310", "aanb_504", "cpsc_110", "adhe_327", "scie_113"];
    var courseList2 = ["aanb_504", "adhe_327", "scie_113"];
    var buildingList = ["WOOD", "BUCH"];
    var input1 = {"courses": courseList2, "buildings": "0_WOOD"}
    var input2 = {"courses": ["frst"], "buildings": "10000_FSC"}



    it("DISTANCE TEST", function () {
        return Scheduler.queryRooms("0_WOOD").then(function(response : any){
            //console.log(response);
        }).catch(function(err){
            console.log("error123");
        });
    });

    it("REAL TEST", function () {
        return Scheduler.scheduler(input1).then(function(response : any){
            //console.log(response.body.result);
        }).catch(function(err){
            console.log(err);
        });
    });

    it("REAL TEST", function () {
        return Scheduler.scheduler(input2).then(function(response : any){
            //console.log(response.body.result);
        }).catch(function(err){
            console.log(err);
        });
    });
})
