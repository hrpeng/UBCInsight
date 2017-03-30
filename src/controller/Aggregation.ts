/**
 * Created by Peng on 2017/3/5.
 */

import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export default class Aggregation {

    public static groupBy2(arr:any[], grouping:any[], applying:any[]) {
        var newArray: any[] = [];
        var groups: any = {}; // grouping result [[],[],[]]
        var record: any[] = [];
        var applyVar: any[] = [];  // [maxseats]
        var Var;
        var applyToken: any[] = []; // [MAX]
        var Token;
        var applyKey: any[] = [];  // [rooms_seats]
        var Key;
        for (var item of applying) {
            Var = Object.keys(item)[0];
            applyVar.push(Var);
            Token = Object.keys(item[Var])[0];
            applyToken.push(Token);
            Key = item[Var][Token];
            applyKey.push(Key);
        }
        var array = Helper.columnsPick(arr,grouping.concat(applyKey))
        for(var o of array) {
            var groupValues = ""
            for (var key of grouping) {
                groupValues = groupValues + "#" + (o[key]) //[-94]
            }
            var b = true
            if(groups.hasOwnProperty(groupValues)){
                groups[groupValues].push(o)
                b = false
            }else{
                groups[groupValues] = [o]
            }
        }

        //console.log(count)
        for(var i = 0 ; i < applyToken.length; i++) {
            record.push([]);
            for (var k in groups) {
                if (groups.hasOwnProperty(k)) {
                    switch (applyToken[i]) {
                        case "MAX":
                            var max = -1000;
                            for(var item of groups[k]){
                                var ik = item[applyKey[i]]
                                if(ik > max){
                                    max = ik
                                }
                            }
                            record[i].push(max)
                            break;
                        case "MIN":
                            var min = 1000;
                            for(var item of groups[k]){
                                var ik = item[applyKey[i]]
                                if(ik < min){
                                    min = ik
                                }
                            }
                            record[i].push(min)
                            break;
                        case "AVG":
                            var total = 0;
                            for(var item of groups[k]) {
                                total += Number((item[applyKey[i]]*10).toFixed(0));
                            }
                            var avg = total / groups[k].length
                            avg = Number((avg / 10).toFixed(2))
                            record[i].push(avg)
                            break;
                        case "SUM":
                            var sum = 0;
                            for(var item of groups[k]) {
                                sum += item[applyKey[i]];
                            }
                            record[i].push(sum)
                            break;
                        case "COUNT":
                            var c:any[] = []
                            for(var item of groups[k]){
                                var ik = item[applyKey[i]]
                                if(!c.includes(ik)){
                                   c.push(ik)
                                }
                            }
                            record[i].push(c.length)
                            break;
                    }
                }
            }
        }

        var keys = Object.keys(groups)
        //console.log(keys.length)

        for (var j = 0; j < keys.length; j++) {
            //console.log("GIIIIIIIIIIIIIIIIIIIIIIII")

            var obj: any = {}
            for (var i = 0; i < grouping.length; i++) {
                obj[grouping[i]] = keys[j].split('#')[i+1]
            }
            for (var i = 0; i < applyVar.length; i++) {
                obj[applyVar[i]] = record[i][j]
            }
            newArray.push(obj);
        }
        //console.log(newArray)
        return newArray
    }

}