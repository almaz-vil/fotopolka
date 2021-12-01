/*
***Обработра URL параметров
***
**/
/**
 * Извлечение значения параметра
 * @param headler URL
 * @param param имя параметра
 * @returns {string|*} значение параметра
 * @constructor
 */
function  HeadlerParam(headler,param){
 var s = new Array();
  s=headler.split('&');
  for(h in s){
    var p=s[h].split('=');
    if(p[0]===param){
        if (p.length>0){return p[1]}else{return "-1";}
    }
  }
 } 


module.exports = HeadlerParam;
/*exports = module.exports;
exports.NameTr=NameTr;
exports.HeadlerParam=HeadlerParam;
*/