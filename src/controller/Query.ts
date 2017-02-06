/**
 * Created by Peng on 2017/2/4.
 */
import {InsightResponse, QueryRequest} from "./IInsightFacade";
import Helper from "./Helper";
import {isArray} from "util";
import {stringify} from "querystring";
import {type} from "os";

export default class Query{

    public static primer(query:QueryRequest, id:string){
        var json = Helper.readJSON('./' + id)
        var array_o = json[id]
        var whereFinal:any[] = []
        for(var section of array_o){
            var key = Object.keys(section)[0]
            var obj = section[key]
            //console.log(obj)
            //call subsequent function to deal with each {Courses_avg:xxx, Courses_dept:xxx...., Courses_uuid:xxx}
            var whereKey :any = Object.keys(query['WHERE'])[0];
            var whereValue = query['WHERE'][whereKey]
            if(Query.meetCondition(whereKey, whereValue, obj)){ //meet condition?
                whereFinal.push(obj)
            }
        }
        var columnKeywords = query.OPTIONS['COLUMNS']
        var columnOutput = Helper.columnsPick(whereFinal,columnKeywords)
        var orderKeyword = query.OPTIONS['ORDER']
        var final = Helper.sort(columnOutput,orderKeyword)
        //console.log(final);
        return final
    }

    public static meetCondition(whereKey: String, whereValue: any, section: any): boolean{
        var meetsCondition : boolean = false
        switch(whereKey) {  // keys[0] is the key. Can be "AND", "OR", "LT" etc..
            case "AND":
                //console.log("hit AND");
                meetsCondition = Query.ANDfunction(section, whereValue);
                break;
            case "OR":
                //console.log("hit OR in whichCase");
                meetsCondition = Query.ORfunction(section, whereValue);
                break;
            case "LT":
                meetsCondition = Query.MCFunction(section,"LT", whereValue);
                break;
            case "GT":
                //console.log("hit GT");
                meetsCondition = Query.MCFunction(section, "GT",whereValue);
                break;
            case "EQ":
                //console.log("hit this line");
                meetsCondition = Query.MCFunction(section, "EQ",whereValue);
                break;
            case "IS":
                //console.log("hit IS");
                meetsCondition = Query.isFunction(section, whereValue);
                break;
            case "NOT":
                meetsCondition = Query.NOTfunction(section, whereValue);
                break;
        }
        //console.log(arrayMeetsCondition);
        return meetsCondition;

    }

    public static NOTfunction(section: any, whereValue:any): boolean{
        var keyword = Object.keys(whereValue)[0]
        var keyValue = whereValue[keyword]
        var meetCon = Query.meetCondition(keyword,keyValue,section)
        return !meetCon
    }

    public static MCFunction(section: any, comp: string, whereValue:any): boolean{
        var keyword = Object.keys(whereValue)[0]  //id_avg, id_audit etc...
        var keyValue = whereValue[keyword]         //95, 69, 77 etc...
        var myValue = section[keyword]

        if (comp == "LT") {
            return myValue < keyValue
        }else if (comp == "GT") {
            return myValue > keyValue
        }else if (comp == "EQ") {
            return myValue == keyValue
        }
    }

    public static isFunction(section:any, whereValue:any): boolean{
        var keyword = Object.keys(whereValue)[0]  //id_dept, id_instructor etc...
        var keyValue : string = whereValue[keyword]         //'cpsc', 'Reid Holmes' etc...
        var myValue = section[keyword]
        if(typeof myValue === 'undefined'){
            return false
        }else if(keyValue.substring(0,1) == '*' && keyValue.slice(-1) == '*') {
            return myValue.includes(keyValue.substring(1,(keyValue.length-1)))
        }
        else if(keyValue.substring(0,1) == '*'){
            //console.log(myValue.slice(-(keyValue.length-1)))
            return myValue.slice(-(keyValue.length-1)) == keyValue.substring(1)
        }else if(keyValue.slice(-1) == '*'){
            return myValue.substring(0,(keyValue.length-1)) == keyValue.substring(0,(keyValue.length-1))
        }else {
            return myValue == keyValue
        }
    }
    public static ANDfunction(section: any, whereValue:any): boolean{
        for (var arg of whereValue){
            var keyword = Object.keys(arg)[0]  //id_avg, id_audit etc... //id_dept, id_instructor etc...
            var keyValue = arg[keyword]         //95, 69, 77 etc...      //'cpsc', 'Reid Holmes' etc...
            var meetCon = Query.meetCondition(keyword,keyValue,section)
            if(!meetCon){
                return false
            }
        }
        return true
    }

    public static ORfunction(section: any, whereValue:any): any{
        for (var arg of whereValue){
            var keyword = Object.keys(arg)[0]  //id_avg, id_audit etc... //id_dept, id_instructor etc...
            var keyValue = arg[keyword]         //95, 69, 77 etc...      //'cpsc', 'Reid Holmes' etc...
            var meetCon = Query.meetCondition(keyword,keyValue,section)
            if(meetCon){
                return true
            }
        }
        return false
    }
}