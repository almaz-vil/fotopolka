/**
 * Администратирование
 */

const fs = require("fs");
const HeadlerParam = require("./urlparam");

class Admin {
    constructor(sqlite) {
        this.sqlite=sqlite;
        this.url = require('url');
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
    /**
     * Список фотографий в альбоме для AJAX
     * @param id_fould - альбом
     * @param id_vir_albom - текущий вирт альбом
     * @returns {string} - JSON
     * @constructor
     */
    AlbomInJSON(id_fould, id_vir_albom=-1){
        var files = new Array();
        files=this.sqlite.run('SELECT name, id FROM file WHERE id_fould=?', [id_fould]);
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
        let sql = `SELECT file.name, file.id, fould.name AS fould  FROM vir_file, file, fould WHERE ((vir_file.id_file=file.id) AND (file.id_fould=fould.id) AND (vir_file.id_vir_fould=?))`;
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
                id_vir_fould:`${id_vir_fould}`
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

    json_vir_alboms(){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM vir_fould `);
        var JSONMas = new Array();
        for(let fould of mas){
            JSONMas.push({name:`${fould.name}`, count:`${fould.count}`, id:`${fould.id}`});
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
            response.write(`<div  class="polka" onclick="zapros_admin_vir_fotoalbom(${fould.id})"><div class="albom">`);
            response.write(`${fould.name}<br><b>{${fould.count}}</b>`);
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
            var fouldname=fould.name.split('foto/')[1];
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
       // this.panel_for_new_name_vir_fould(response);
        response.write('<div id="admin_grid">');
        response.write('<div>Информация по базе<br><button onclick="admin_panel_for_new_name_vir_fould()">Новый виртуальный альбом</button> <div id="info_vir_albom"></div></div>');
        response.write('<div><h1>Административная часть ФОТОПОЛКИ</h1></div>');
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