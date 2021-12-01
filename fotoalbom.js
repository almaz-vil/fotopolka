/**
 * Класс фото
 */
const HeadlerParam = require('./urlparam');


class Fotoalmom {
    /**
     * Конструктор фотоальбома
     * @param sqlite подключение к базе данных SQLite
     */
    constructor(sqlite) {
        this.sqlite = sqlite;
    }

    /**
     * Формирования для просмотра фотографий
     * @param response
     * @param param - номер фотографии
     * @constructor
     */
    Imag(response, param){
        let sql = `SELECT name, id FROM file WHERE id_fould=?`;
        let id_fould = HeadlerParam(param, "floud");
        var m = new Array();
        m=this.sqlite.run(sql, [id_fould]);
        var fould = new Array();
        fould = this.sqlite.run('SELECT name FROM fould WHERE id=?', [id_fould])
        var fouldname=fould[0].name;
        response.write(`${this.PrintCaptionAlbom(fouldname.split('foto/')[1])}<br>`);

        let id_foto = HeadlerParam(param, "foto");
        for(let i in m){
            if(id_foto==m[i].id){
                var s='';
                var i_file;
                if(m[0].id>id_foto-1){
                    i_file=m[m.length-1];
                    s=`&floud=${id_fould}&foto=${i_file}`;
                }else {
                    i_file=id_foto-1;
                    s=`&floud=${id_fould}&foto=${id_foto-1}`;
                }
                s=`<div class="pilot" id="fotoend" data-tag="${i_file}"  onclick="var foto=document.getElementById('foto');http_zapros(foto.dataset.tag, this.dataset.tag);">Назад</div>`;
                var ss='';
                if(m[m.length-1].id>id_foto+1){
                    i_file=m[0];
                    ss=`<&floud=${id_fould}&foto=${i_file}`;
                }else {
                    i_file=Number(id_foto)+1;
                    ss=`&floud=${id_fould}&foto=${i_file}`;
                }
                 ss=`<div class="pilot" id="fotonext" data-tag="${i_file}" onclick="var foto=document.getElementById('foto');http_zapros(foto.dataset.tag, this.dataset.tag);">Вперёд</div>`;
                response.write(`<div class="image"  id="image">${s}`);

                response.write(`<div id="foto" data-tag="${id_fould}" onclick=" var link = document.createElement('a');
            link.setAttribute('href', '${fouldname}${m[i].name}');
            link.setAttribute('download','${m[i].name}');
            onload=link.click();
            " style="background-image: url('${fouldname}${m[i].name}'); background-position: center; background-repeat:no-repeat; background-size: contain; flex: 4;"></div>`);
                response.write(`${ss}</div>`);
                break;
            }
        }
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
     */
    PrintAllCaptionAlbom(response, param){
        var mas = new Array;
        mas=this.sqlite.run(`SELECT id, name, count FROM fould `);
        response.write('<div class="polka-flex">');
        for(let fould of mas){
            response.write(`<div  class="polka"><a href="${param+"&floud="+fould.id}"><div class="albom">`);
            var fouldname=fould.name.split('foto/')[1];
            response.write(`${this.PrintCaptionAlbom(fouldname)}<br><b>{${fould.count}}</b>`);
            response.write('</div></a></div>')
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
    /**
     * Вывод фотографий фотоальбома
     * @param response
     * @param id_fould - ид альбома
     * @param id_foto - ид текущего фото
     * @constructor
     */
    ImagAjax(response, id_fould, id_foto){
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
                        this.check(1);
                    }else {
                        i_file=id_foto-1;
                        this.check(2);
                    }
                    var i_file_end;
                    var h=id_foto+1;
                    if(max==h){
                        i_file_end=m[0].id;
                        this.check(3);
                    }else {
                        i_file_end=Number(id_foto)+1;
                        this.check(4);
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

}

module.exports=Fotoalmom;