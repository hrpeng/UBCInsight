/**
 * Created by Peng on 2017/3/5.
 */

import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export default class Aggregation {

    public static group(arr:any[], grouping:any[],applying:any[]){
        var applyVar:any[] = [];  // [maxseats]
        var Var;
        var applyToken:any[] = []; // [MAX]
        var Token;
        var applyKey:any[] = [];  // [rooms_seats]
        var Key;

        var numRow : any[] = [];
        var count : any[] = [];
        for(var item of applying){
            Var = Object.keys(item)[0];
            applyVar.push(Var);
            Token = Object.keys(item[Var])[0];
            applyToken.push(Token);
            Key = item[Var][Token];
            applyKey.push(Key);
        }
        //var array = Helper.columnsPick(arr,grouping.concat(applyKey))
        var sorted1 = Helper.sort(arr,grouping[0])
        //console.log(sorted1)
        // arr.reduce(function(memo, x) {
        //     if (!memo[x[property]]) { memo[x[property]] = []; }
        //     memo[x[property]].push(x);
        //     return memo;
        // }, {});



        var temp;
        for(var a of sorted1){
            if(a[grouping[0]] == temp){

            }
        }
    }

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

    public static groupBy(array:any[], grouping:any[], applying:any[]) {

        var newArray: any[] = [];
        var groups: any = []; // grouping result [[],[],[]]
        var record: any[] = [];
        var applyVar: any[] = [];  // [maxseats]
        var Var;
        var applyToken: any[] = []; // [MAX]
        var Token;
        var applyKey: any[] = [];  // [rooms_seats]
        var Key;

        var numRow: any[] = [];
        var count: any[] = [];
        for (var item of applying) {
            Var = Object.keys(item)[0];
            applyVar.push(Var);
            Token = Object.keys(item[Var])[0];
            applyToken.push(Token);
            Key = item[Var][Token];
            applyKey.push(Key);
        }
        for (var o of array) {
            var b = true
            //console.log(o)
            var groupValues = grouping.map(function (key) {
                return o[key]  // [LSK, BIOL] ect.
            })
            //console.log(groupValues)
            var applyValues = applyKey.map(function (key) {
                return o[key]  // [100, 200] etc.
            })
            for(var j = 0 ; j < groups.length; j++) {
                //if (groupValues.toString() == groups[j].toString()) {
                if(groupValues.every(function(u, i) {
                        return u === groups[j][i];
                    })){
                    numRow[j] += 1;
                    b = false
                    // for (var i = 0; i < applyToken.length; i++) {
                    //     switch (applyToken[i]) {
                    //         case "MAX":
                    //             if (record[j][i] < applyValues[i]) {
                    //                 record[j][i] = applyValues[i]
                    //             }
                    //             break;
                    //         case "MIN":
                    //             if (record[j][i] > applyValues[i]) {
                    //                 record[j][i] = applyValues[i]
                    //             }
                    //             break;
                    //         case "AVG":
                    //             var x = record[j][i]
                    //             x = x * 10 * (numRow[j] - 1);
                    //             x = Number(x.toFixed(0))
                    //             var y = applyValues[i]
                    //             y = y * 10;
                    //             y = Number(y.toFixed(0))
                    //             var total = x + y;
                    //
                    //             var avg = total / numRow[j]
                    //             avg = avg / 10
                    //             record[j][i] = Number(avg.toFixed(2))
                    //             break;
                    //         case "SUM":
                    //             record[j][i] += applyValues[i]
                    //             break;
                    //         case "COUNT":
                    //             if (numRow[j] == 2) {
                    //                 record[j][i] = 1
                    //             }
                    //             var isUnique = true
                    //             for (var c of count[j]) {
                    //                 if (c == applyValues[i]) {
                    //                     isUnique = false
                    //                 }
                    //             }
                    //             if (isUnique) {
                    //                 record[j][i] += 1;
                    //                 count[j].push(applyValues[i])
                    //             }
                    //             break;
                    //     }
                    //}
                }

            }
            if (b) {
                groups.push(groupValues);
                record.push(applyValues)
                for (var i = 0; i < applyToken.length; i++) {
                    if (applyToken[i] == "COUNT") {
                        record[record.length - 1][i] = 1
                    }
                }
                numRow.push(1)
                count.push(applyValues)
            }
        }



        //console.log(groups)

        for (var j = 0; j < groups.length; j++) {
            var obj: any = {}
            for (var i = 0; i < grouping.length; i++) {
                obj[grouping[i]] = groups[j][i]
            }
            for (var i = 0; i < applyVar.length; i++) {
                obj[applyVar[i]] = record[j][i]
            }
            newArray.push(obj);
        }
        return newArray
    }

}