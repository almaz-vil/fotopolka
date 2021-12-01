


/**
 * Удаление фона классу CCS polka
 */
function clearbackgroudpolka(){
    var polka=document.getElementsByClassName('polka');for (p of polka){p.style.background='none'} ;
}
var xmlHttp;
//Функция создания объекта XMLHttpRequest
function createXmlHttpRequestObject() {
    var xmlHttp;
    try {
        xmlHttp=new XMLHttpRequest();
    } catch (e) {
        // Internet Exploer
        try {
         xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");   
        } catch (e) {
           try {
             xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");   
           } catch (e) {
                alert("Технология AJAX не поддерживается!");
                return false;
           }
        }
    }
    return xmlHttp;
}
//Отправка асинхронного НТТР-запроса
function http_zapros(id_fould, foto) {
    
 xmlHttp = createXmlHttpRequestObject();

    if (xmlHttp){
        try {
          // запрос файла с сервера
          var fil=`&floud=${id_fould}&foto=${foto}&ajax=1`;
    
          xmlHttp.responseText='json';
          xmlHttp.open("GET", fil, true);
          xmlHttp.onreadystatechange=obrabotka;
          xmlHttp.send(null);
        } catch (e) {
            alert("Не удалось соединиться с сервером!"); 
        }
    }       
}
function admin_panel_for_new_name_vir_fould(){
    var response=document.getElementById('info_vir_albom');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
    `<div class="form_caption">Имя нового виртуального альбома</div>`+
    `<input id="new_name_vir_fould_name" placeholder="Введити имя альбома">`+
    `<button id="new_name_button"  onclick="var name=document.getElementById('new_name_vir_fould_name').value;`+
                                            `zaprosPOST({'name': name, 'oper': 'new_vir_albom'}, new_vir_fotoalbom);`+
                                            `document.getElementById('new_name_vir_fould').style.display='none'">Создать</button>`+
    `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Отмена</button>`+
    `</div></div>`;

}

/**
 * Вывод фотольбома а админке JSON
 * @param id_fould
 */
function zapros_admin_fotoalbom(id_fould, id_vir_albom) {
    zaprosPOST({"fould": id_fould,"vir_albom": id_vir_albom ,"oper": "fotoalbom"}, alboms_print_admin)
}
/**
 * Вывод виртуальных фотольбомов а админке JSON
 * @param id_fould
 */
function zapros_admin_vir_fotoalbom(id_fould) {
    zaprosPOST({"fould": id_fould, "oper": "vir_f"}, alboms_vir_print_admin)
}

function pplus(){
    clearbackgroudpolka();
    var admin_albom=document.getElementById('albom_admin');
    var albom=admin_albom.getElementsByClassName('albom');
    for (al of albom) {
        var h=al.offsetHeight;
        var hh=h*2;
        al.style.height=hh+'px';
        var w=al.offsetWidth;
        var ww=w*2;al.style.width=ww+'px';
    }
}

function mminus(){
    clearbackgroudpolka();
    var admin_albom=document.getElementById('albom_admin');
    var albom=admin_albom.getElementsByClassName('albom');
    for (al of albom) {
        var h=al.offsetHeight;
        var hh=h/2;
        al.style.height=hh+'px';
        var w=al.offsetWidth;
        var ww=w/2;al.style.width=ww+'px';
    }
}


/**
 * Обработка имени фотоальбома
 * @param name вида 1/2/1/3
 * @returns {string} вида 3 1 2 1
 * @constructor
 */
function PrintCaptionAlbom(name){
    var masfo ="";
    var mas_str =name.split('/').reverse();
    for( let str of mas_str){   masfo=`${str} `+masfo;     }
    return masfo;
}

function zaprosPOST(params, readyfun){
    var xmlHttp;
    try {
        xmlHttp=new XMLHttpRequest();
    } catch (e) {
        // Internet Exploer
        try {
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("Технология AJAX не поддерживается!");
                return false;
            }
        }
    }if (xmlHttp){
        try {
            // запрос файла с сервера
            var fil=`&POST=1`;
            xmlHttp.responseText='json';
            xmlHttp.open("POST", fil, true);
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.onreadystatechange=()=>{
                if (xmlHttp.readyState===4) {
                    if (xmlHttp.status===200) {
                        try { readyfun(JSON.parse(xmlHttp.response));
                        } catch (e) {alert("Ошибка чтения ответа!"+e);}
                    }
                    else {     alert("Возникла проблема при получении данных с сервера:/n"+xmlHttp.statusText);     }
                }

            }
            xmlHttp.send(JSON.stringify(params));
        } catch (e) {
            alert("Не удалось соединиться с сервером!");
        }
    }
}

function check() {
    var id_vir_albom=this.dataset.id_vir_albom;
    if(id_vir_albom=="undefined") return;
    var id_foto=this.dataset.id_foto;
    if (this.style.opacity=="0.75"){
        this.style.opacity="0";
        zaprosPOST({"oper":"delete","id_vir_fould": id_vir_albom, "id_foto": id_foto}, delete_insert_foto_vir_albom);
    }else {
        this.style.opacity="0.75";
        zaprosPOST({"oper":"insert","id_vir_fould": id_vir_albom, "id_foto": id_foto}, delete_insert_foto_vir_albom);
    }
}

function delete_insert_foto_vir_albom(objJSON){
    var info= document.getElementById('info_vir_albom');
    info.dataset.tag=objJSON.id;
    info.innerHTML=`Имя текущего вирт альбома ${objJSON.name}<br>Общие количество фотографий в альбоме ${objJSON.count}`;
}

function alboms_print_admin(objJSON){
    console.log(objJSON);
    var fouldname=objJSON[0].fould;
    var text=`<div class="ziro"><button onclick="pplus()">+</button>`+
        `<div class="caption">${PrintCaptionAlbom(fouldname.split('foto/')[1])}</div> <button onclick="mminus()">-</button><br></div>` +
        '<div id="albom_admin_foto">';
    var info= document.getElementById('info_vir_albom');
    for( let foto of objJSON){
        var op="0";
        if(foto.chesk){op="0.75";}
        text=text+`<div  class="polka"><div class="albom" style="background-image: url('${foto.fould}${foto.foto}'); background-position: bottom; background-repeat:no-repeat; background-size: contain;"><img src="check.png" draggable="false" data-id_vir_albom="${info.dataset.tag}" data-id_foto="${foto.id}" onclick="let g=check.bind(this); g();"  style="width: 100%; opacity: ${op}; height: 100%;"></div></div>`;
    }
    text=text+'</div>';
    var albom=document.getElementById('albom_admin');
    albom.innerHTML=text;
}

function alboms_vir_print_admin(objJSON){
    var text="";
    if (objJSON[0].id==="-1"){
         text=`<div id="albom_admin_foto"> В альбоме <b>${objJSON[0].name}</b> нет фотографий!</div>`;
    }
    else{
        text=`<div class="ziro"><button onclick="pplus()">+</button>`+
            `<div class="caption">${objJSON[0].name}</div> <button onclick="mminus()">-</button><br></div>` +
            '<div id="albom_admin_foto">';
        var info= document.getElementById('info_vir_albom');
        for( let foto of objJSON){
            text=text+`<div  class="polka"><div class="albom" style="background-image: url('${foto.fould}${foto.foto}'); background-position: bottom; background-repeat:no-repeat; background-size: contain;"><img src="check.png" draggable="false" data-id_vir_albom="${info.dataset.tag}" data-id_foto="${foto.id}" onclick="let g=check.bind(this); g();"  style="width: 100%; opacity: 0%; height: 100%;"></div></div>`;
        }
        text=text+'</div>';
    }
    var info= document.getElementById('info_vir_albom');
    info.dataset.tag=objJSON[0].id_vir_fould;
    info.innerHTML=`Имя текущего вирт альбома <b>${objJSON[0].name}</b>`;
    var albom=document.getElementById('albom_admin');
    albom.innerHTML=text;
}
//Функция обработки ответа сервера
function obrabotka() {
    if (xmlHttp.readyState===4) {
        if (xmlHttp.status===200) {
            try { load(JSON.parse(xmlHttp.response));
            } catch (e) {alert("Ошибка чтения ответа!"+e);}
        }
        else {     alert("Возникла проблема при получении данных с сервера:/n"+xmlHttp.statusText);     }
    }
}


function load(objJSON){
    var foto=document.getElementById('foto');
    var fotoend=document.getElementById('fotoend');
    var fotonext=document.getElementById('fotonext');
    var f=objJSON['fould']+objJSON['foto'];
    foto.style.backgroundImage = `url("${f}")`;
    fotonext.dataset.tag=objJSON['next'];
    fotoend.dataset.tag=objJSON['end'];   
}

/**
 * Получено информация о новом фотоальбоме
 * @param objJSON
 */
function new_vir_fotoalbom(objJSON) {
        var info= document.getElementById('info_vir_albom');
        info.dataset.tag=objJSON.id;
        info.innerHTML=`Имя текущего вирт альбома ${objJSON.name}`;

}