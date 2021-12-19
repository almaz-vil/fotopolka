console.log('Вас приветствует система администратирования!\n');
console.log('Мы производим, очистку базы данный и сканирования каталога "/foto"\n');

const Admin = require('./admin');
const sqlite =require('sqlite-sync');// require("sqlite3");
sqlite.connect('foalbom');
var p = new Promise(function (resolve, reject){
    var admin = new Admin(sqlite);
    resolve(admin.add_ixef());
})
p.then(function (){
    console.log('Завершения работы системы !!!\n');

})

//admin.clear_base();
//admin.scan_dir();
