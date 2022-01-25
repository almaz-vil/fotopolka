/**
 * Класс фото
 */
const HeadlerParam = require('./urlparam');
//const ExifImage = require('exif').ExifImage;



class Fotoalmom {
    /**
     * Конструктор фотоальбома
     * @param sqlite подключение к базе данных SQLite
     */
    constructor(sqlite) {
        this.sqlite = sqlite;
    }

    /**
     * Вывод альбома
     * @param response
     * @param param id альбома
     * @constructor
     */
    PrintAlbom(response, param){
        let sql = `SELECT name, id FROM file WHERE id_fould=?`;
        let id_fould = HeadlerParam(param, "floud");
        var m = new Array();
        m=this.sqlite.run(sql, [id_fould]);
        var fould = new Array();
        fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould]);
        var fouldname=fould[0].name;
        response.write('<div class="ziro">')
        response.write(`<button onclick="clearbackgroudpolka(); var albom=document.getElementsByClassName('albom'); for (al of albom) {var h=al.offsetHeight; var hh=h*2;al.style.height=hh+'px';var w=al.offsetWidth; var ww=w*2;al.style.width=ww+'px';}">+</button>`);
        response.write(`<div class="caption">${this.PrintCaptionAlbom(fouldname.split('foto/')[1])}</div>`);
        response.write(`<button onclick="clearbackgroudpolka(); var albom=document.getElementsByClassName('albom'); for (al of albom) {var h=al.offsetHeight; var hh=h/2;al.style.height=hh+'px';var w=al.offsetWidth; var ww=w/2;al.style.width=ww+'px';}">-</button><br>`);
        response.write('</div>');
        response.write('<div class="polka-flex">');
        for( let foto of m){
            response.write(`<div  class="polka"><a href="${param}&foto=${foto.id}">`);
            response.write(`<div class="albom" style="background-image: url('${fouldname}${foto.name}'); background-position: bottom; background-repeat:no-repeat; background-size: contain;"></div>`);
            response.write("</a></div>");
        }
        response.write("</div>");
    }

    /**
     *Вывод фотополки
     * @param response
     * @param param
     * @constructor
     *
    PrintAllCaptionAlbom(response, param){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM fould `);
        response.write('<div class="polka-flex" id="alboms-polka" >');
        for(let fould of mas){
            response.write(`<div  class="polka"><a href="${param+"&floud="+fould.id}"><div class="albom">`);
            var fouldname=fould.name.split('foto/')[1];
            response.write(`${this.PrintCaptionAlbom(fouldname)}<br><b>{${fould.count}}</b>`);
            response.write('</div></a></div>')
        }
        response.write("</div>");

    }
    */
    PrintAllCaptionAlbom(response){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM fould `);
        response.write('<div class="polka-flex" id="alboms-polka" >');
        for(let fould of mas){
            response.write(`<div  class="polka"><div class="albom" onclick="zapros_fotoalbom(${fould.id})">`);
            var fouldname=fould.name.split('foto/')[1];
            response.write(`${this.PrintCaptionAlbom(fouldname)}<br><b>{${fould.count}}</b>`);
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
    
    InfoAdminFoto(id_file){
        let files = new Array();
        files=this.sqlite.run('SELECT name, time, id_fould, time_shablon FROM file WHERE id=?', [id_file]);
        let id_fould=files[0].id_fould;
        let fould = new Array();
        fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould]);
        var fouldname=fould[0].name;
        let foto= files[0];
        var fotot ={
            id:`${id_file}`,
            fould:`${fouldname}`,
            fould_id:`${id_fould}`,
            file:`${foto.name}`,
            name:`${this.CaptionAlbom(fouldname)}`,
            id_vir_fould:`-1`,
            date:this.TimeToStr(foto.time, foto.time_shablon),
            time:`${foto.time}`,
            chesk:false
        };
    

        return JSON.stringify(fotot);
    }
    
    InsertInVirtualAlbom(id_vir_albom, id_file){
        let sql = `INSERT INTO vir_file(id_vir_fould, id_file) VALUES(?, ?)`;
        this.sqlite.run(sql, [id_vir_albom, id_file]);
        var m = new Array();
        let sql_select=`SELECT count, name FROM vir_fould WHERE id=?`;
        m=this.sqlite.run(sql_select, [id_vir_albom]);
        var count;
        if(m.length==0){count=1;}
        else {count=m[0].count+1;}
        let sqlupdate = `UPDATE vir_fould SET count=? WHERE id=?`;
        this.sqlite.run(sqlupdate, [count, id_vir_albom]);
        var albom_vir={
            'name':m[0].name,
            'id':id_vir_albom,
            'count':count
        };
        return JSON.stringify(albom_vir);
    }


    DeleteIzVirtualAlbom(id_vir_albom, id_file){
        let sql = `DELETE FROM vir_file WHERE ((id_vir_fould=?) AND (id_file=?))`;
        this.sqlite.run(sql, [id_vir_albom,id_file]);
        var m = new Array();
        let sql_select=`SELECT count, name FROM vir_fould WHERE id=?`;
        m=this.sqlite.run(sql_select, [id_vir_albom]);
        var count=m[0].count-1;
        let sqlupdate = `UPDATE vir_fould SET count=? WHERE id=?`;
        this.sqlite.run(sqlupdate, [count, id_vir_albom]);
        var albom_vir={
            'name':m[0].name,
            'id':id_vir_albom,
            'count':count
        };
        return JSON.stringify(albom_vir);
    }

    RenameVirtualAlbom(id_vir_albom, name){
        this.sqlite.run(`UPDATE vir_fould SET name=? WHERE id=?`, [name, id_vir_albom]);
        var albom_vir={
            'name':name,
            'id':id_vir_albom
        };
        return JSON.stringify(albom_vir);
    }
    
    DeleteVirtualAlbom(id_vir_albom){
        let sql = `DELETE FROM vir_file WHERE (id_vir_fould=?)`;
        this.sqlite.run(sql, [id_vir_albom]);
        var m = new Array();
        let sql_select=`SELECT name FROM vir_fould WHERE id=?`;
        m=this.sqlite.run(sql_select, [id_vir_albom]);
        var count=m[0].count-1;
        let sqlupdate = `DELETE FROM vir_fould WHERE id=?`;
        this.sqlite.run(sqlupdate, [id_vir_albom]);
        var albom_vir_deleten={
            'name':m[0].name,
            'id':id_vir_albom
        };
        return JSON.stringify(albom_vir_deleten);
    }
    
    AddTimeForFoto(id_foto, date){
        let dat = new Date(date);
        this.sqlite.run('UPDATE file SET time=? WHERE id=?', [dat.getTime(), id_foto]);
        let foto={
            'date':this.TimeToStr(date, 0)
        };
        return JSON.stringify(foto);
        
    }

    AddTimeForFotos(mas){
        let mass= new Array()
        mass=JSON.parse(mas);
        mass.forEach((element)=>{
            let time=Number(element.time);
            let shablon=Number(element.shablon);
            this.sqlite.run('UPDATE file SET time=?, time_shablon=? WHERE id=?', [time, shablon, element.id]);        
        },this);
        return JSON.stringify({'oper':'yes'});
    }
    
    /**
     * Создание нового вируального альбома
     * @param name - имя виртуального альбома
     * @returns {string} - JSON
     * @constructor
     */
    NewVirtualAlbom(name){
        let sql = `INSERT INTO vir_fould(name) VALUES(?)`;
        this.sqlite.run(sql, [name]);
        var m = new Array();
        let sql_select=`SELECT id FROM vir_fould WHERE name=?`;
        m=this.sqlite.run(sql_select, [name]);
        var albom_vir={
                    'name':name,
                    'id':m[0].id
                    };
        return JSON.stringify(albom_vir);
    }

    ReadEXIF(file){
        console.log('EXIF');
        try {
            new ExifImage({ image : file }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else {
                    console.dir(exifData);
                    return exifData; // Do something with your data!
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    }

    /**
     * Обработка имени фотоальбома
     * @param name вида 1/2/1/3
     * @returns {string} вида 3 1 2 1
     * @constructor
     */
    CaptionAlbom(name){
        var masfo ="";
        var nam=name.split('foto/');
        var mas_str =nam[1].split('/').reverse();
        for( let str of mas_str){   masfo=`${str} `+masfo;     }
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

    ShowFoto(id_foto, foto, fould, id_fould, id_vir_fould, naprav){
        if (id_vir_fould.includes('-1')) {
            var fould = new Array();
            fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould]);
            var fouldname = fould[0].name;
            var files = new Array();
            files = this.sqlite.run(`SELECT id, name, time, time_shablon FROM file WHERE id_fould=?`, [id_fould]);
            for (var i = 0; i < files.length; i+=1) {
                if (files[i].id == id_foto) {
                    switch (naprav) {
                        case (naprav.match(/fotoend/) || {}).input:
                            i == 0?i = files.length - 1:i = i - 1;
                            break;
                        case (naprav.match(/fotonext/) || {}).input:
                            i == files.length - 1?i = 0:i = i + 1;
                            break;
                    }


                    return JSON.stringify({
                        id:files[i].id,
                        name:files[i].name,
                        fould:fouldname,
                        caption:this.CaptionAlbom(fouldname),
                        vir_fould:id_vir_fould,
                        data: this.TimeToStr(files[i].time, files[i].time_shablon),
                        time: files[i].time
                    });
                }
            }
        } else {
            var fould = new Array();
            fould = this.sqlite.run('SELECT name FROM vir_fould WHERE id=?', [id_vir_fould]);
            let sql = `SELECT file.name, file.time, file.id, file.time_shablon, fould.name AS fould  FROM vir_file, file, fould WHERE ((vir_file.id_file=file.id) AND (file.id_fould=fould.id) AND (vir_file.id_vir_fould=?))`;
            var files = new Array();
            files=this.sqlite.run(sql, [id_vir_fould]);
            for (var i = 0; i < files.length; i+=1) {
                if (files[i].id == id_foto) {
                    switch (naprav) {
                        case (naprav.match(/fotoend/) || {}).input:
                            i == 0 ? i = files.length - 1 : i = i - 1;
                            break;
                        case (naprav.match(/fotonext/) || {}).input:
                            i == files.length - 1 ? i = 0 : i = i + 1;
                            break;
                    }
                    var objJSON={
                        id: files[i].id,
                        name: files[i].name,
                        fould: files[i].fould,
                        caption: fould[0].name,
                        vir_fould: id_vir_fould,                        
                        data: this.TimeToStr(files[i].time, files[i].time_shablon)
                    };
                    return JSON.stringify(objJSON);
                }
            }
        }
    }
    /**
     * Вывод фотографий фотоальбома
     * @param response
     * @param id_fould - ид альбома
     * @param id_foto - ид текущего фото
     * @constructor
     */
   /* ImagAjax(response, id_fould, id_foto){
        let sql = `SELECT name, id FROM file WHERE id_fould=?`;
        var m = new Array();
        m=this.sqlite.run(sql, [id_fould]);
        var fould = new Array();
        fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould])
        var fouldname=fould[0].name;
        if(id_foto>-1){
            console.log(m);
            console.log(`\n id_foto=${id_foto} h=`);
            console.log(m[m.length-1].id);
            var max=m[m.length-1].id;
            var min=m[0].id;
            for(let i in m){
                if(id_foto==m[i].id){
                    var i_file;
                    var hh=id_foto-1;
                    if(min==hh){
                        i_file=Number(max);
                     }else {
                        i_file=id_foto-1;

                    }
                    var i_file_end;
                    var h=id_foto+1;
                    if(max==h){
                        i_file_end=m[0].id;

                    }else {
                        i_file_end=Number(id_foto)+1;

                    }

                    var TekFoto ={
                        end:`${i_file_end}`,
                        next:`${i_file}`,
                        fould:`${fouldname}`,
                        foto:`${m[i].name}`
                    };
                    console.log(TekFoto);
                    response.write(JSON.stringify(TekFoto));
                    break;

                }
            }
        }
    }
**/
}

module.exports=Fotoalmom;