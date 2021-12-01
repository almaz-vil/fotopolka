console.log('Вас приветствует система администратирования!\n');
console.log('Мы производим, очистку базы данный и сканирования каталога "/foto"\n');
console.log('Дождитесь завершения работы системы !!!\n');

const Admin = require('./admin');
const sqlite =require('sqlite-sync');// require("sqlite3");
sqlite.connect('foalbom');
var admin = new Admin(sqlite);
admin.clear_base();
admin.scan_dir();
