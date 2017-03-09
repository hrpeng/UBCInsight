/**
 * Created by Peng on 2017/3/5.
 */

import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export default class Aggregation {

    public static groupBy(array:any[], grouping:any[], applying:any[]) {
        var newArray:any[] = [];
        var groups :any[] = []; //grouping result [[],[],[]]
        var record :any[] = [];

        var applyVar:any[] = [];
        var Var;
        var applyToken:any[] = [];
        var Token;
        var applyKey:any[] = [];
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
        array.forEach(function (o) {
            var groupKeys = grouping.map(function(key){
                return o[key]  // [LSK, BIOL] ect.
            })
            var applyValues = applyKey.map(function(key){
                return  o[key]  // [100, 200] etc.
            })
            var b = true
            for (var j = 0; j < groups.length ; j++) {
                if(groupKeys.toString() == groups[j].toString()){
                    numRow[j] += 1;
                    b = false
                    for(var i = 0; i < applyToken.length;i++){
                        switch(applyToken[i]) {
                            case "MAX":
                                if (record[j][i] < applyValues[i]) {
                                    record[j][i] = applyValues[i]
                                }
                                break;
                            case "MIN":
                                if (record[j][i] > applyValues[i]) {
                                    record[j][i] = applyValues[i]
                                }
                                break;
                            case "AVG":
                                var x = record[j][i]
                                x = x * 10 * (numRow[j] - 1);
                                x = Number(x.toFixed(0))
                                var y = applyValues[i]
                                y = y * 10;
                                y = Number(y.toFixed(0))
                                var total = x + y;

                                var avg = total/numRow[j]
                                avg = avg/10
                                record[j][i] = Number(avg.toFixed(2))
                                break;
                            case "SUM":
                                record[j][i] += applyValues[i]
                                break;
                            case "COUNT":
                                if(numRow[j] == 2){
                                    record[j][i] = 1
                                }
                                var isUnique = true
                                for(var c of count[j]){
                                    if (c == applyValues[i]){
                                        isUnique = false
                                    }
                                }
                                if(isUnique){
                                    record[j][i] += 1;
                                    count[j].push(applyValues[i])
                                }
                                break;
                        }
                    }
                }
            }

            if(b){
                groups.push(groupKeys);
                record.push(applyValues)
                for(var i = 0; i < applyToken.length; i++){
                    if(applyToken[i] == "COUNT"){
                        record[record.length - 1][i] = 1
                    }
                }
                numRow.push(1)
                count.push(applyValues)
            }

        });
        //console.log(numRow)

        for(var j = 0; j < groups.length; j++) {
            var obj: any = {}
            for (var i = 0; i < grouping.length; i++) {
                obj[grouping[i]] = groups[j][i]
            }
            for (var i = 0 ; i < applyVar.length; i++){
                obj[applyVar[i]] = record[j][i]
            }
            newArray.push(obj);
        }
        return newArray
    }
}