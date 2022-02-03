/**
 * Администратирование
 */

 const fs = require("fs");
 const gm = require('gm');
 const util = require("util");
var pathModule=require("path");

const ExifI = require('kinda-exif').ExifImage;
const { Z_NO_COMPRESSION } = require("zlib");
class Admin {
    constructor(sqlite) {
        this.sqlite=sqlite;
        this.url = require('url');
        this.max=-1;
        this.min=-1;
        this.websokcet=true;
    }
    /**
     * Обработка имени фотоальбома
     * @param name вида 1/2/1/3
     * @returns {string} вида 3 1 2 1
     * @constructor
     */
    CaptionAlbom(name){
        var masfo ="";
        var mas_str =name.split('/').reverse();
        for( let str of mas_str){
            if(!(str.includes('foto')))
                masfo=`${str} `+masfo;
        }
        return masfo;
    }

    TimeToStr(milsec, format){
        let TIME_FORMAT_MAS=[  
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                timezone: 'UTC',
                hour: 'numeric',
                minute: 'numeric',
            },{
                year: 'numeric',
            },{
                year: 'numeric',
                month: 'long',
            },{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            }
        ];
       
        let date = new Date(Number(milsec));
        return  date.toLocaleString("ru", TIME_FORMAT_MAS[format]);      
    }

       
    /**
     * Список фотографий в альбоме для AJAX
     * @param id_fould - альбом
     * @param id_vir_albom - текущий вирт альбом
     * @returns {string} - JSON
     * @constructor
     */
    AlbomInJSON(id_fould, id_vir_albom=-1){
        var files = new Array();
        files=this.sqlite.run('SELECT name, id, time, time_shablon AS shablon FROM file WHERE id_fould=?', [id_fould]);
        var fould = new Array();
        fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould]);
        var fouldname=fould[0].name;
        var JSONMas = new Array();
        for( let foto of files){
            var fotot ={
                id:`${foto.id}`,
                fould:`${fouldname}`,
                fould_id:`${id_fould}`,
                foto:`${foto.name}`,
                name:`${this.CaptionAlbom(fouldname)}`,
                id_vir_fould:`-1`,
                date:this.TimeToStr(foto.time, foto.shablon),
                time:`${foto.time}`,
                time_shablon:`${foto.shablon}`,
                chesk:false
            };
            var vir_file = new Array();
            vir_file = this.sqlite.run('SELECT id FROM vir_file WHERE (id_vir_fould=?) AND (id_file=?)', [id_vir_albom, foto.id]);
            for(let id of vir_file){
                fotot.chesk=true;
            }
            JSONMas.push(fotot);
        }

        return JSON.stringify(JSONMas);
    }

    /**
     * Список фотографий в витруальном альбоме для AJAX
     * @param id_vir_fould - альбом виртуальный
     * @returns {string} - JSON
     * @constructor
     */
    AlbomVirInJSON(id_vir_fould){
        var fould = new Array();
        fould = this.sqlite.run('SELECT name FROM vir_fould WHERE id=?', [id_vir_fould]);
        var fouldname=fould[0].name;
        let sql = `SELECT file.name, file.time, file.time_shablon, file.id, fould.name AS fould  FROM vir_file, file, fould WHERE ((vir_file.id_file=file.id) AND (file.id_fould=fould.id) AND (vir_file.id_vir_fould=?))`;
        var m = new Array();
        m=this.sqlite.run(sql, [id_vir_fould]);
        var JSONMas = new Array();
        for( let foto of m){
            var fotot ={
                id:`${foto.id}`,
                fould:`${foto.fould}`,
                fould_id:`-1`,
                foto:`${foto.name}`,
                name:`${fouldname}`,
                id_vir_fould:`${id_vir_fould}`,
                date: this.TimeToStr(foto.time, foto.time_shablon),
                time_shablon:`${time_shablon}`
            };
            JSONMas.push(fotot);
        }
        if(JSONMas.length==0){
            var fotot ={
                id:`-1`,
                fould:`-1`,
                fould_id:`-1`,
                foto:`-1`,
                name:`${fouldname}`,
                id_vir_fould:`${id_vir_fould}`
            };
            JSONMas.push(fotot);
        }
        return JSON.stringify(JSONMas);
    }

    FindDateMinMaxJSON(){
       if (this.max===-1) {
           let max = new Array();
           max = this.sqlite.run('SELECT MAX(time) AS max FROM file');
           this.max=max[0].max;
       }
       if (this.min===-1) {
           let min = new Array();
           min = this.sqlite.run('SELECT MIN(time) AS min FROM file');
           this.min=min[0].min;
       }

       console.log(`max = ${this.max} \t min = ${this.min}` )
       return JSON.stringify({max:`${this.max}`, min:`${this.min}`})
    }

    FindDateAlbomJSON(date_ot,date_do, findinfo){
        var files = new Array();
        var JSONMas = new Array();
        if(findinfo) {
            files = this.sqlite.run('SELECT name, id, time, time_shablon, id_fould FROM file WHERE ((time>?)AND(time<?)) LIMIT 100', [date_ot, date_do]);
            for (let foto of files) {
                var fould = new Array();
                fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [foto.id_fould]);
                var fouldname = fould[0].name;

                var fotot = {
                    id: `${foto.id}`,
                    fould: `${fouldname}`,
                    fould_id: `${foto.id_fould}`,
                    foto: `${foto.name}`,
                    name: `${this.CaptionAlbom(fouldname)}`,
                    id_vir_fould: `-1`,
                    date: this.TimeToStr(foto.time, foto.time_shablon),
                    time: `${foto.time}`,
                    chesk: false
                };
                fould.slice();
                JSONMas.push(fotot);
            }
        }else {
            files = this.sqlite.run('SELECT name, id, time, id_fould FROM file WHERE ((time>?)AND(time<?)) GROUP BY id_fould', [date_ot, date_do]);
            for (let foto of files) {
                var fould = new Array();
                fould = this.sqlite.run('SELECT name, id, count FROM fould WHERE id=?', [foto.id_fould]);
                var fouldname = fould[0].name;
                var fotot = {name:`${fould[0].name}`, caption:`${this.CaptionAlbom(fould[0].name)}`, count:`${fould[0].count}`, id:`${fould[0].id}`}
                fould.slice();
                JSONMas.push(fotot);

            }
        }
        return JSON.stringify(JSONMas);
    }

    FindAlbomJSON(text, flag_vir='false'){
        var mas = new Array;
        switch (flag_vir) {
            case (flag_vir.match(/false/) || {}).input:
                mas = this.sqlite.run(`SELECT id, name, count FROM fould WHERE name LIKE ?`, ['%' + text + '%']);
                break;
            case (flag_vir.match(/true/) || {}).input:
                mas=this.sqlite.run(`SELECT id, name, count FROM vir_fould WHERE name LIKE ?`,['%'+text+'%']);
        }
        if (mas.length<1){
            let Tt=text.charAt(0).toUpperCase()+text.slice(1);
            switch (flag_vir) {
                case (flag_vir.match(/false/) || {}).input:
                    mas = this.sqlite.run(`SELECT id, name, count FROM fould WHERE name LIKE ?`, ['%' + Tt + '%']);
                    break;
                case (flag_vir.match(/true/) || {}).input:
                    mas=this.sqlite.run(`SELECT id, name, count FROM vir_fould WHERE name LIKE ?`,['%'+Tt+'%']);
            }
        }
        var JSONMas = new Array();
        for(let fould of mas){
            switch (flag_vir) {
                case (flag_vir.match(/false/) || {}).input:
                    JSONMas.push({
                        name: `${fould.name}`,
                        caption: `${this.CaptionAlbom(fould.name)}`,
                        count: `${fould.count}`,
                        id: `${fould.id}`
                    });
                    break;
                case (flag_vir.match(/true/) || {}).input:
                    JSONMas.push({
                        name: `${fould.name}`,
                        caption: `${fould.name}`,
                        count: `${fould.count}`,
                        id: `${fould.id}`
                    });
            }
        }
        return JSON.stringify(JSONMas);

    }

    add_ixef(){
        var count = new Array();
        count=this.sqlite.run('SELECT COUNT(file.id) AS cou FROM file, fould WHERE file.id_fould=fould.id');
        console.dir(count[0].cou);
        const len=count[0].cou;
        if (len>200){
            const limmit=200;
            const skip=200;
            for(let sk=0; sk<len; sk=sk+skip){
                let files = new Array();
                files=this.sqlite.run('SELECT file.id AS id, file.name AS file_name, fould.name AS fould_p FROM file, fould WHERE file.id_fould=fould.id LIMIT ?, ?',[sk,limmit]);
                for (let file of files){
                    let image;
                    try {
                        image= new ExifI({image: pathModule.join(__dirname,`${file.fould_p}${file.file_name}`)})
                        let sd=image.exifData.exif.DateTimeOriginal;   
                        let data;
                        if(sd==undefined){
                            data=new Date(1977);
                        } else {
                            let m = sd.split(' ');
                            let da = m[0].split(':');
                            let ti = m[1].split(':');
                                data = new Date(da[0], Number(da[1]) - 1, da[2], ti[0], ti[1], ti[2]);

                            this.sqlite.run('UPDATE file SET time=? WHERE id=?',[data.getTime(), file.id]);
                            console.log(data.toDateString());
                        }
                        
                    } catch (error) {
                        console.dir('Ошибка'+error);

                    }
                    
                }
                files=null;    
            }
        }
        else{
            let files = new Array();
            files=this.sqlite.run('SELECT file.id AS id, file.name AS file_name, fould.name AS fould_p FROM file, fould WHERE file.id_fould=fould.id');
                for (let file of files){
                    let image;
                    try {
                        image= new ExifI({image: pathModule.join(__dirname,`${file.fould_p}${file.file_name}`)})
                        let sd=image.exifData.exif.DateTimeOriginal;   
                        let data;
                        if(sd==undefined){
                            data=new Date(1977);
                        } else {
                            let m = sd.split(' ');
                            let da = m[0].split(':');
                            let ti = m[1].split(':');
                                data = new Date(da[0], Number(da[1]) - 1, da[2], ti[0], ti[1], ti[2]);

                            this.sqlite.run('UPDATE file SET time=? WHERE id=?',[data.getTime(), file.id]);
                            console.log(data.toDateString());
                        }
                        
                    } catch (error) {
                        console.dir('Ошибка'+error);
                    }
                    
                }
            files=null;
        }
    console.log('Выход');
    }

    json_vir_alboms(){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM vir_fould `);
        var JSONMas = new Array();
        for(let fould of mas){
            JSONMas.push({name:`${fould.name}`, caption:`${fould.name}`, count:`${fould.count}`, id:`${fould.id}`});
        }
        return JSON.stringify(JSONMas);
    }

    json_alboms(){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM fould `);
        var JSONMas = new Array();
        for(let fould of mas){
            JSONMas.push({name:`${fould.name}`, caption:`${this.CaptionAlbom(fould.name)}`, count:`${fould.count}`, id:`${fould.id}`});
        }
        return JSON.stringify(JSONMas);
    }

    /**1
     * Вывод виртуальных альбомоы
     * @param response
     */
    panel_show_vir_albom(response){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM vir_fould `);
        response.write('<div class="polka-flex" id="admin_vid_vir_alboms">');
        for(let fould of mas){
            response.write(`<div  class="polka" id="vir_albom_${fould.id}" onclick="zapros_admin_vir_fotoalbom(${fould.id})"><div class="albom">`);
            response.write(`${fould.name}<br><b id="vir_albom_${fould.id}_count">{${fould.count}}</b>`);
            response.write('</div></div>')
        }
        response.write("</div>");
    }
    /**
     * Обработка имени фотоальбома
     * @param name вида 1/2/1/3
     * @returns {string} вида 3 1 2 1
     * @constructor
     */
    PrintCaptionAlbom(name){
        var masfo ="";
        var mas_str =name.split('/').reverse();
        for( let str of mas_str){   masfo=`${str} `+masfo;     }
        return masfo;
    }

    /**
     * Вывод списка фотоальбомов
     * @param response
     */
    panel_show_almons(response){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM fould `);
        response.write('<div class="polka-flex">');
        for(let fould of mas){
            response.write(`<div  class="polka" onclick="zapros_admin_fotoalbom(${fould.id}, document.getElementById('info_vir_albom').dataset.tag)"><div class="albom">`);
            let fouldname;
            try {
                fouldname=    fould.name.split('foto/')[1];
            } catch (error) {
                fouldname="";
            }
            
            response.write(`${this.PrintCaptionAlbom(fouldname)}<br><b>{${fould.count}}</b>`);
            response.write('</div></div>')
        }
        response.write("</div>");
    }


    /**
     * Отправка JSON объекта
     * @param response
     * @param objson - JSON объект
     * @constructor
     */
    ResponeJSON(response, objson){
        response.setHeader("Content-Type", "text/html; charset=utf-8;");
        response.write(objson);
        response.end();
    }
    

    /**
     * печать структуры страницы админки
     * @param response
     */
    panel_admin(response){
        response.write('<div id="dialog"></div><div id="admin_grid">');
        response.write(`<div><div class="menu_admin_osn"><div>Работа с базой данных</div><div class="menu_admin_button" onclick="admin_panel_for_new_name_vir_fould()" style="background-image: url('new_albom.png')" title="Новый виртуальный альбом"></div>`+
            `<div class="menu_admin_button" onclick="zaprosPOST({'oper':'websocket'}, status_websocket); panel_admin()" style="background-image: url('config.png')"  title="Начальная настройка"></div>`+
            `<div class="menu_admin_button" onclick="panel_alboms_resize()" style="background-image: url('resize_plus.png')"  title="Увеличить ширину"></div>`+
            `<div class="menu_admin_button" onclick="panel_alboms_resize(false)" style="background-image: url('resize_minus.png')"  title="Уменьшить ширину"></div>`+
            ' </div></div>');
        response.write('<div class="head_admin"><h1>Административная часть ФОТОПОЛКИ</h1><div id="info_vir_albom" data-tag="-1"></div></div>');
        response.write('<div class="admin_albom">');
        this.panel_show_almons(response);
        response.write('<br>');
        this.panel_show_vir_albom(response);
        response.write('</div>');
        response.write('<div id="albom_admin">фотографии</div>');

        response.write('</div>')
    }

    /**
     * Очистка базы данных
     */
    clear_base(){
        this.sqlite.run('DELETE FROM file');
        this.sqlite.run('DELETE FROM fould');
        this.sqlite.run("UPDATE sqlite_sequence SET seq=0 WHERE name='fould'");
        this.sqlite.run("UPDATE sqlite_sequence SET seq=0 WHERE name='file'");
    }

    /**
     * Получение списка объектов файловой системы
     * @param dir - каталог для сканирования
     * @param files_
     * @returns {*[]}
     */
    getFiles(dir, files_){

        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                this.getFiles(name, files_);
            } else {                
                files_.push(name);
            }
        }
        return files_;
    };

    /**
     * Анализ папки и заполнение базы данных
     * @param dir
     */
    scan_dir(dir = 'foto'){
      //  fs.appendFileSync("2.txt",this.getFiles(dir));
        //this.LoadList("2.txt");
        this.LoadList((this.getFiles(dir)));

    }

    /**
     * Стоит обрабытывать файл или нет
     * @param param url симя предпологаемого файла
     * @returns {boolean}
     */
     file_check(param){
        try {
         
         var name_file=this.url.parse(param, true).pathname;
         if ((name_file.lastIndexOf("JPG")>1)
             ||(name_file.lastIndexOf("jpg")>1)
             ||(name_file.lastIndexOf("png")>1)
             ||(name_file.lastIndexOf("css")>1)
             ||(name_file.lastIndexOf("woff2")>1)
             ||(name_file.lastIndexOf("js")>1)
             ||(name_file.lastIndexOf("jpeg")>1)
             ||(name_file.lastIndexOf("JPEG")>1)) {
             return true;            }
         else {
             return false;
         }   
        } catch (error) {
            console.trace('My info');
            console.log(`Param=${param} \t name_file=${name_file}\n`);
            console.dir(error);
          return false;  
        }
     }

    /**
     * Стоит обрабытывать файл или нет
     * @param param url симя предпологаемого файла
     * @returns {boolean}
     */
     file_check_not(param){
        try {
         
         var name_file=param;
         if ((name_file.lastIndexOf("JPG")>1)
             ||(name_file.lastIndexOf("jpg")>1)
             ||(name_file.lastIndexOf("png")>1)
             ||(name_file.lastIndexOf("css")>1)
             ||(name_file.lastIndexOf("woff2")>1)
             ||(name_file.lastIndexOf("js")>1)
             ||(name_file.lastIndexOf("jpeg")>1)
             ||(name_file.lastIndexOf("JPEG")>1)) {
             return false;            }
         else {
             return true;
         }   
        } catch (error) {
            console.trace('My info');
            console.log(`Param=${param} \t name_file=${name_file}\n`);
            console.dir(error);
          return false;  
        }
    }
    file_check_1(param){
        try {
         
         var name_file=param;
         if ((name_file.lastIndexOf("JPG")>1)
             ||(name_file.lastIndexOf("jpg")>1)
             ||(name_file.lastIndexOf("png")>1)
             ||(name_file.lastIndexOf("css")>1)
             ||(name_file.lastIndexOf("woff2")>1)
             ||(name_file.lastIndexOf("js")>1)
             ||(name_file.lastIndexOf("jpeg")>1)
             ||(name_file.lastIndexOf("JPEG")>1)) {
             return true;            }
         else {
             return false;
         }   
        } catch (error) {
            console.trace('My info');
            console.log(`Param=${param} \t name_file=${name_file}\n`);
            console.dir(error);
          return false;  
        }
    }
    
    InfoTimeForFile(mas){
        let objJSON = new Array();
        let mass=JSON.parse(mas);
        mass.forEach((item)=>{
            let sql = `SELECT file.name AS name, file.id AS id, fould.name AS fould FROM file, fould WHERE ((file.id_fould=fould.id) AND (file.id=?))`;
            let m = new Array();
            m=this.sqlite.run(sql, [item.id]);
            m.forEach(element => {
                let path_file=pathModule.join(__dirname,`${element.fould}${element.name}`);
                let info_file=fs.statSync(path_file);                 
                objJSON.push({id:`${element.id}`, time:`${info_file.mtimeMs}` });
            });
           
        });        
        return JSON.stringify(objJSON);
    }
    
    RotateFile(mas){
        let objJSON = new Array();
        let mass=JSON.parse(mas);
        mass.forEach((item)=>{
            let sql = `SELECT file.name AS name, file.time AS time, file.id AS id, fould.name AS fould FROM file, fould WHERE ((file.id_fould=fould.id) AND (file.id=?))`;
            let m = new Array();
            m=this.sqlite.run(sql, [item.id]);
            m.forEach(element => {
                let path_file=pathModule.join(__dirname,`${element.fould}${element.name}`);                
                gm(path_file)
                .rotate('black',90)
                .write(path_file, function (err) {
                    if (err){console.dir(err);}
                  });
                //Обновить время изменения файла      
                let at= new Date( Number(element.time));
                fs.utimesSync(path_file,at,at);

                objJSON.push({id:`${element.id}`, fould:`${element.fould}`, file:`${element.file}` });
            });
           
        });        
        return JSON.stringify(objJSON);
    }


    /**
     * EXIF  для лога
     * @param {фото} id_file 
     * @returns 
     */
    InfoEXIF(id_file){
        let files = new Array();
        files=this.sqlite.run('SELECT name, id_fould FROM file WHERE id=?', [id_file]);
        let id_fould=files[0].id_fould;
        let name=files[0].name;
        let fould = new Array();
        fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould]);
        let image;
        let path_file=pathModule.join(__dirname,`${fould[0].name}${name}`);
        let info_file=fs.statSync(path_file);
        let info_json={
            atime:`${info_file.atime}`,
            mtime:`${info_file.mtime}`,
            ctime:`${info_file.ctime}`,
            
        }
        try {

            image= new ExifI({image: path_file});
            let objJSON={
                exif:`${util.inspect(image, {showHidden: false, depth: null})}`,
                file:`${util.inspect(info_json, {showHidden: false, depth: null})}`
            }
            return JSON.stringify(objJSON);
        
        } catch (error) {
            let objJSON={
                exif:`Error:${error}`
            }
            return JSON.stringify(objJSON);
        }
    }
    /**
     * Из строки/имени 
     * @param {*} str_date - строки
     * @param {*} file_name - или имя файла вида IMG-20040506
     * @returns {time:data.getTime(), todate: data.toDateString(),format:nomer}
     */
    StringInDateTime(str_date, file_name=''){
        let data;
        let nomer=0;
        if(str_date===undefined){          
            switch (file_name) {
                case (file_name.match(/IMG.+\d{8}/) || {}).input:
                    let yaer=`${file_name[4]}${file_name[5]}${file_name[6]}${file_name[7]}`;
                    let mec_n;
                    file_name[8]==='0'?mec_n=Number(file_name[9]):mec_n=Number(`${file_name[8]}${file_name[9]}`);
                    let mec=mec_n-1;
                    let day;
                    file_name[10]==='0'?day=`${file_name[11]}`:day=`${file_name[10]}${file_name[11]}`;
                    data = new Date(yaer,mec,day);   
                    nomer=3;
                    break;       
                default:
                    console.log(`file_name = ${file_name}`);
                    data = new Date(1977);
                    nomer=1;             
                    break;
            } 
        } else {     
            switch (str_date) {
                case (str_date.match(/\d{4}:\d{2}:\d{2}\s\d{2}:\d{2}:\d{2}/) || {}).input:
                    let m = str_date.split(' ');
                    let da = m[0].split(':');
                    let ti = m[1].split(':');
                    data = new Date(da[0], Number(da[1]) - 1, da[2], ti[0], ti[1], ti[2]);                                             
                    break;       
                default:
                    console.log(`str_date = ${str_date}`);
                    break;
            }     
        } 
        return {time:data.getTime(), todate: data.toDateString(),format:nomer}; 
    }


    Websoket(WebSocket, server){
        if (this.websokcet) {
            const ws = new WebSocket({
                httpServer: server,
                autoAcceptConnections: false
            });
            ws.on('request', req => {
                const connection = req.accept('', req.origin);
                console.log('Connected:' + connection.remoteAddress);
                connection.on('message', message => {
                    const dataName = message.type + 'Data';
                    const oper = message[dataName];
                    switch (oper) {
                        case (oper.match(/Efi/) || {}).input:
                            var count = new Array();
                            count=this.sqlite.run('SELECT COUNT(file.id) AS cou FROM file, fould WHERE file.id_fould=fould.id');
                            const len=count[0].cou;
                            connection.send(len);
                            if (len>200){
                                const limmit=200;
                                const skip=200;
                                for(let sk=0; sk<len; sk=sk+skip){
                                    let files = new Array();
                                    files=this.sqlite.run('SELECT file.id AS id, file.name AS file_name, fould.name AS fould_p FROM file, fould WHERE file.id_fould=fould.id LIMIT ?, ?',[sk,limmit]);
                                    for (let file of files){
                                        let image;
                                        try {
                                            image= new ExifI({image: pathModule.join(__dirname,`${file.fould_p}${file.file_name}`)})
                                            let objJSON=this.StringInDateTime(image.exifData.exif.DateTimeOriginal, file.file_name);
                                            this.sqlite.run('UPDATE file SET time=?, time_shablon=? WHERE id=?',[objJSON.time, objJSON.format, file.id]);
                                            let objJson ={
                                                file:`${file.fould_p}${file.file_name}`,
                                                error:``,
                                                date:`${objJSON.todate}`
                                            }
                                            connection.send(JSON.stringify(objJson));
     
                                        } catch (error) {
                                            connection.send(JSON.stringify({file:`${file.fould_p}${file.file_name}`, error:`${error.message}`,date:'-' }));
            
                                        }                                        
                                    }
                                    files=null;    
                                }
                            }
                            else{
                                let files = new Array();
                                files=this.sqlite.run('SELECT file.id AS id, file.name AS file_name, fould.name AS fould_p FROM file, fould WHERE file.id_fould=fould.id');
                                    for (let file of files){
                                        let image;
                                        try {
                                            image= new ExifI({image: pathModule.join(__dirname,`${file.fould_p}${file.file_name}`)})
                                            let objJSON=this.StringInDateTime(image.exifData.exif.DateTimeOriginal, file.file_name);
                                            this.sqlite.run('UPDATE file SET time=?, time_shablon=? WHERE id=?',[objJSON.time, objJSON.format, file.id]);
                                            let objJson ={
                                                file:`${file.fould_p}${file.file_name}`,
                                                error:``,
                                                date:`${objJSON.todate}`
                                            }
                                            connection.send(JSON.stringify(objJson));
     
                                        } catch (error) {
                                            connection.send(JSON.stringify({file:`${file.fould_p}${file.file_name}`, error:`${error.message}`,date:'-' }));
   
                                        }
                                        
                                    }
                                files=null;
                            }
                            break;
                        case (oper.match(/scan/) || {}).input:
                            const sqlite =this.sqlite;                                                
                            sqlite.run('DELETE FROM file');
                            sqlite.run('DELETE FROM fould');
                            sqlite.run('DELETE FROM vir_file');
                            sqlite.run('DELETE FROM vir_fould');
                            sqlite.run("UPDATE sqlite_sequence SET seq=0 WHERE name='fould'");
                            sqlite.run("UPDATE sqlite_sequence SET seq=0 WHERE name='file'");
                            let arr_files = Array();
                            arr_files=this.getFiles('foto');
                            let arr_not= new Array();
                            arr_not=arr_files.filter(this.file_check_not);
                            if(arr_not.length>0){
                                console.log(`Файлы не являются фотографиями:\n`);
                                arr_not.forEach((value, index)=>console.log(`\t${index}.'${value}'\n`));
                            }
                            console.log('\nОбрабатывается:\n');
                            let arr = new Array();
                            arr=arr_files.filter(this.file_check_1);                           
                            connection.send(arr.length);
                            let countFoto=0;
                            let countFould=0;
                            let arrayFoto = new Array();
                            let arrayFould = new Array();                           
                            arr.forEach(value=>{
                                let str_mas=value.split('/');
                                let file_name=str_mas.pop();
                                let fould=str_mas.join('/');
                                if(arrayFould.find((item)=>item.name==fould)===undefined){
                                    countFould=countFould+1;
                                    countFoto=1;
                                    arrayFould.push({id:countFould,name:fould,count:countFoto,id_tag:1});
                                } else{
                                    arrayFould.forEach(item=>{if(item.name===fould){item.count=item.count+1;}});
                                }
                                arrayFoto.push({name:file_name,id_fould:countFould});
                            });

                            arrayFould.forEach((item)=>{
                                connection.send(JSON.stringify(item));
                                this.sqlite.run('INSERT INTO fould (id, name, count, id_tag) VALUES(?, ?, ?, ?)', [item.id,item.name+'/',item.count,item.id_tag]);
                                console.log(`Католог '${item.name}/'\t\tКоль-во фото ${item.count}\n`);                                
                            }, this);

                            arrayFoto.forEach((item)=>{
                                this.sqlite.run('INSERT INTO file (name, id_fould) VALUES(?, ?)', [item.name, item.id_fould]);
                            }, this);

                            console.log(`У Вас ${arrayFould.length} альбомов с ${arrayFoto.length} фотографиями!`);
                            connection.send('Звершена, запись в базу!')
                        break;
                    }
                    console.log('exit');
                    connection.send('exit_');
                });

                connection.on('close', (reasonCode, description) => {
                });
            })
        }
        this.websokcet=false;
        return JSON.stringify({info:'ok'});
    }

    /**
     * Загрузка в базу данный
     * @param name_file имя файла со списком объектов файловой системы
     * @param separator разделитель объектов в файле "," - по умолчанию
     * @constructor
     */
    LoadList (name_file, separator=",") {
        //let list_file = fs.readFileSync(name_file).toString().split(separator);
        let arr = name_file;//fs.readFileSync("2.txt").toString().split(';');
        var ds = new Array();
        var fould=" ";
        var countFoto=0;
        var countFould=1;
        var arrayFoto = new Array();
        var arrayFould = new Array();
        for(let i in arr){
            ds=arr[i].split('/');
            for (let j in ds){
                var de=arr[i].lastIndexOf('/')+1;
                var d=arr[i].substring(de, arr[i].len-de);
                if (d==fould){ }
                else {
                    if (countFoto>0){
                        console.log(`${fould} \tКоль-во фото ${countFoto}\n`);
                        var gf =
                            {':id': countFould,
                                ':name': fould,
                                ':count': countFoto,
                                ':id_tag': 1
                            }
                        arrayFould.push(gf);
                        /*/Чтение id fould
                        let sql = `SELECT id, name FROM fould WHERE name=?`;
                        let name = fould;
                        db.get(sql, [name], function (err, row) {
                              var id=row.id;
                              console.log('ID_FOULD: ', id);
                              console.log('NAME: ', row.name);
                              var dfg=row.name.split('/');
                              console.log('name: ', dfg[dfg.length-2]);
                              var mas=dfg[dfg.length-2].split(' ');
                              for(let v in mas){
                                  //Запись тяга папки
                                  var tag_fould = {':name': mas[v],':id_fould': id};
                                  db.run('INSERT INTO tag (name, id_fould) VALUES(:name, :id_fould)',
                                  tag_fould, (err) => { if(err) {return console.log(err.message); }})

                              }

                              arrayFoto.length=0;
                              });
**/
                    }
                    fould=d;
                    countFould=countFould+1;

                    countFoto=0;
                }
                if (this.    file_check(ds[j])) {
                    countFoto=countFoto+1;
                    arrayFoto.push({':name': ds[j],':id_fould': countFould});
                }
            }
        }
        for(let i in arrayFould){
            this.sqlite.run('INSERT INTO fould (id, name, count, id_tag) VALUES(:id, :name, :count, :id_tag)',
                arrayFould[i]);
        }

        //запись фотографий
        for(let i in arrayFoto){
            this.sqlite.run('INSERT INTO file (name, id_fould) VALUES(:name, :id_fould)',
                arrayFoto[i]);

        }
        console.log(`${fould} \tКоль-во фото ${countFoto}\n`);

    }
   /**
     let list_path = new Array();
        let fould = " ";
        var countFoto=0;
        var countFould=1;
        var arrayFoto = new Array();
        var arrayFould = new Array();
        for(var path_file of list_file){
            list_path=path_file.split('/');
            for (var file_name of list_path){
                var de=path_file.lastIndexOf('/')+1;
                var fould_temp=path_file.substring(de, path_file.len-de);
                if (fould_temp===fould){ }
                else {
                    if (countFoto>0){
                        console.log(`${fould} \tКоль-во фото ${countFoto}\n`);

                        arrayFould.push({
                            ':id': countFould,
                            ':name': fould,
                            ':count': countFoto,
                            ':id_tag': 1
                            });
                        /*Чтение id fould
                        let sql = `SELECT id, name FROM fould WHERE name=?`;
                        let name = fould;
                        db.get(sql, [name], function (err, row) {
                              var id=row.id;
                              console.log('ID_FOULD: ', id);
                              console.log('NAME: ', row.name);
                              var dfg=row.name.split('/');
                              console.log('name: ', dfg[dfg.length-2]);
                              var mas=dfg[dfg.length-2].split(' ');
                              for(v in mas){
                                  //Запись тяга папки
                                  var tag_fould = {':name': mas[v],':id_fould': id};
                                  db.run('INSERT INTO tag (name, id_fould) VALUES(:name, :id_fould)',
                                  tag_fould, (err) => { if(err) {return console.log(err.message); }})

                              }

                              arrayFoto.length=0;
                              });

                    }
                    fould=fould_temp;
                    countFould=countFould+1;
                    countFoto=0;
                }
                if (this.file_check(file_name)) {
                    countFoto=countFoto+1;
                    arrayFoto.push({':name': file_name,':id_fould': countFould});

                }
            }
        }
        for(let fould of arrayFould){
            this.sqlite.run('INSERT INTO fould (id, name, count, id_tag) VALUES(:id, :name, :count, :id_tag)', fould);
        }
        //запись фотографий
        for(let foto of arrayFoto){
            this.sqlite.run('INSERT INTO file (name, id_fould) VALUES(:name, :id_fould)',foto);
        }
        //console.log(`${fould} \tКоль-во фото ${countFoto}\n`);
    };
    **/

}

module.exports=Admin;