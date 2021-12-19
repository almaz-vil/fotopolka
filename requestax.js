


/**
 * Удаление фона классу CCS polka
 */
function clearbackgroudpolka(){
    var polka=document.getElementsByClassName('polka');for (p of polka){p.style.background='none'} ;
}
var xmlHttp;
//Функция создания объекта XMLHttpRequest
/*function createXmlHttpRequestObject() {
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
*///Отправка асинхронного НТТР-запроса
/*function http_zapros(id_fould, foto) {
    
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
*/
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
function admin_panel_for_delete_vir_fould(){
    var response=document.getElementById('info_vir_albom');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Удалить виртуальный альбом?</div>`+
        `<img src="vopros.png">`+
        `<button id="new_name_button"  onclick="var id=document.getElementById('info_vir_albom').dataset.tag;`+
        `zaprosPOST({'id_vir_albom': id, 'oper': 'vir_albom_delete'}, delete_vir_albom);`+
        `document.getElementById('new_name_vir_fould').style.display='none'">Удалить</button>`+
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

function zapros_vir_fotoalbom(id_fould) {
    zaprosPOST({"fould": id_fould, "oper": "vir_albom"}, albom_vir_print)
}

function zapros_fotoalbom(id_fould) {
    zaprosPOST({"fould": id_fould, "oper": "albom"}, albom_vir_print)
}

function albom_vir_print(objJSON){
    if (objJSON.length==0) return;
    var text="";
    text=`<div class="ziro"><button onclick="pplus(document.getElementById('albom_admin_foto').getElementsByClassName('albom'))">+</button>`+
        `<div class="caption">${objJSON[0].name}</div> <button onclick="mminus(document.getElementById('albom_admin_foto').getElementsByClassName('albom'))">-</button></div>` +
        '<div id="albom_admin_foto">';
    for( let foto of objJSON){
        text=text+`<div  class="polka"><div class="albom" style="background-image: url('${foto.fould}${foto.foto}'); `+
        `background-position: bottom; background-repeat:no-repeat; background-size: contain;"><img src="check.png" draggable="false" data-id_fould="${foto.fould_id}" data-id_foto="${foto.id}" data-foto="${foto.foto}"`+
        `data-fould="${foto.fould}" data-datef="${foto.date}" data-id_vir_fould="${foto.id_vir_fould}" onclick="open_foto(this.dataset)"  style="width: 100%; opacity: 0%; height: 100%;"></div></div>`;
    }
    text=text+'</div>';
    document.getElementById('alboms-polka').innerHTML=text;
    document.getElementById('alboms-polka').style.display="flex";
    document.getElementById('caps_h1').style.display="none";
    var menufind=document.getElementById('menufind');
    if (menufind.style.visibility=="hidden"){
        menufind.style.display="none";
    }
}
function open_foto(dataset){
    var caption=document.getElementsByClassName('caption')[0].innerHTML;
    var text="";

    var s=`<div class="pilot" id="fotoend" data-id_fould="${dataset.id_fould}" data-id_foto="${dataset.id_foto}" data-foto="${dataset.foto}" data-fould="${dataset.fould}" data-id_vir_fould="${dataset.id_vir_fould}" onclick="zaprosPOST({'oper': 'showfoto', 'naprav': this.id, 'id_foto': this.dataset.id_foto, 'foto': this.dataset.foto, 'fould': this.dataset.fould, 'id_fould': this.dataset.id_fould, 'id_vir_fould': this.dataset.id_vir_fould},open_foto_next);">Назад</div>`;
    var ss=`<div class="pilot" id="fotonext" data-id_fould="${dataset.id_fould}" data-id_foto="${dataset.id_foto}" data-foto="${dataset.foto}" data-fould="${dataset.fould}" data-id_vir_fould="${dataset.id_vir_fould}" onclick="zaprosPOST({'oper': 'showfoto', 'naprav': this.id, 'id_foto': this.dataset.id_foto, 'foto': this.dataset.foto, 'fould': this.dataset.fould, 'id_fould': this.dataset.id_fould, 'id_vir_fould': this.dataset.id_vir_fould},open_foto_next);">Вперёд</div>`;
    text=`<div id="date">"${caption}" ${dataset.datef}</div><div class="image"  id="image">${s}`+
    `<div id="foto" onclick=" var link = document.createElement('a');
            link.setAttribute('href', '${dataset.fould}${dataset.foto}');
            link.setAttribute('download','${dataset.foto}');
            onload=link.click();
            " style="background-image: url('${dataset.fould}${dataset.foto}'); background-position: center; background-repeat:no-repeat; background-size: contain; flex: 4;"></div>`+
    `${ss}</div>`;

    document.getElementById('alboms-polka').innerHTML=text;
    document.getElementById('alboms-polka').style.display="block";
}

function open_foto_next(objJSON){
    document.getElementById('foto').style.backgroundImage=`url("${objJSON.fould+objJSON.name}")`;
    document.getElementById('fotoend').dataset.id_foto=objJSON.id;
    document.getElementById('fotoend').dataset.foto=objJSON.name;
    document.getElementById('fotoend').dataset.fould=objJSON.fould;
    document.getElementById('fotonext').dataset.id_foto=objJSON.id;
    document.getElementById('fotonext').dataset.foto=objJSON.name;
    document.getElementById('fotonext').dataset.fould=objJSON.fould;
    document.getElementById('date').innerHTML=`"${objJSON.caption}" ${objJSON.data}`;
}

function delete_vir_albom(objJSON){
    var response=document.getElementById('info_vir_albom');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Виртуальный альбом удалён!</div>`+
        `<img src="znak_ok.png" width="256">`+
        `Виртуальный альбом "${objJSON.name}" удалён!`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Хорошо!</button>`+
        `</div></div>`;
    var info= document.getElementById('info_vir_albom');
    info.dataset.id_vir_albom="undefined";
    document.getElementById(`vir_albom_${objJSON.id}`).style.display="none";
    var albom=document.getElementById('albom_admin');
    albom.innerHTML="";


}

function pplus(albom=document.getElementById('albom_admin').getElementsByClassName('albom')){
    clearbackgroudpolka();
    for (al of albom) {
        var h=al.offsetHeight;
        var hh=h*2;
        al.style.height=hh+'px';
        var w=al.offsetWidth;
        var ww=w*2;al.style.width=ww+'px';
    }
}

function mminus(albom=document.getElementById('albom_admin').getElementsByClassName('albom')){
    clearbackgroudpolka();
    for (al of albom) {
        var h=al.offsetHeight;
        var hh=h/2;
        al.style.height=hh+'px';
        var w=al.offsetWidth;
        var ww=w/2;al.style.width=ww+'px';
    }
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

function panelfind(panel) {
    var panel1=document.getElementById('menufind1');
    if (panel.style.visibility=="hidden"){
        panel.style.display="inline-flex";
        panel1.style.display="inline-flex";
        panel.style.visibility="visible";
        panel1.style.visibility="visible";
    }else {
        if(document.getElementById('caps_h1').style.display=="none") {
            panel.style.display = "none";
        }
        panel1.style.display="none";
        panel.style.visibility="hidden";
        panel1.style.visibility="hidden";
    }

}

function check() {
    var id_vir_albom=this.dataset.id_vir_albom;
    if(id_vir_albom=="undefined") return;
    var id_foto=this.dataset.id_foto;
    if (this.style.opacity=="0.75"){
        this.style.opacity="0";
        zaprosPOST({"oper":"delete_","id_vir_fould": id_vir_albom, "id_foto": id_foto}, delete_insert_foto_vir_albom);
    }else {
        this.style.opacity="0.75";
        zaprosPOST({"oper":"insert","id_vir_fould": id_vir_albom, "id_foto": id_foto}, delete_insert_foto_vir_albom);
    }
}

function finddata(findinfoto) {
    var date_ot=new  Date(document.getElementById('date_ot').value);
    var date_do=new  Date(document.getElementById('date_do').value);
    if(findinfoto) {
        zaprosPOST({
            "oper": "datefind",
            "date_ot": date_ot.getTime(),
            "date_do": date_do.getTime(),
            "findinfoto": findinfoto
        }, albom_vir_print);
    } else {
        zaprosPOST({
            "oper": "datefind",
            "date_ot": date_ot.getTime(),
            "date_do": date_do.getTime(),
            "findinfoto": findinfoto
        }, alboms_print);
    }
}

function  alboms_vit_print(objJSON){
    var  text="";
    for(let fould of objJSON){
        text=text+`<div  class="polka"><div class="albom" onclick="zapros_vir_fotoalbom(${fould.id})">`+
            `${fould.caption}<br><b>{${fould.count}}</b>`+
            '</div></div>';
    }
    document.getElementById('alboms-polka').innerHTML=text;
    document.getElementById('alboms-polka').style.display="flex";
    document.getElementById('caps_h1').style.display="block";
    document.getElementById('menufind').style.display="inline-flex";
}
function  alboms_print(objJSON){
    var  text="";
    for(let fould of objJSON){
        text=text+`<div  class="polka"><div class="albom" onclick="zapros_fotoalbom(${fould.id})">`+
            `${fould.caption}<br><b>{${fould.count}}</b>`+
            '</div></div>';
    }
    document.getElementById('alboms-polka').innerHTML=text;
    document.getElementById('alboms-polka').style.display="flex";
    document.getElementById('caps_h1').style.display="block";
    document.getElementById('menufind').style.display="inline-flex";
}
function delete_insert_foto_vir_albom(objJSON){
    var info= document.getElementById('info_vir_albom');
    info.dataset.tag=objJSON.id;
    info.innerHTML=`Имя текущего вирт альбома ${objJSON.name}<br>Общие количество фотографий в альбоме ${objJSON.count}`;
}

function alboms_print_admin(objJSON){
    var text=`<div class="ziro"><button onclick="pplus()">+</button>`+
        `<div class="caption">${objJSON[0].name}</div> <button onclick="mminus()">-</button><br></div>` +
        //`<div class="ziro"> </div> `+
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
         text=`<div id="albom_admin_foto"> В альбоме <b>${objJSON[0].name}</b> нет фотографий!<br><div><button onclick="">Переименовать</button><button onclick="admin_panel_for_delete_vir_fould()">Удалить</button></div></div>`;
    }
    else{
        text=`<div class="ziro"><button onclick="pplus()">+</button>`+
            `<div class="caption">${objJSON[0].name}</div> <button onclick="mminus()">-</button><br><div><button onclick="">Переименовать</button><button onclick="admin_panel_for_delete_vir_fould()">Удалить</button></div></div>` +
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
/*
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
*/

/**
 * Получено информация о новом фотоальбоме
 * @param objJSON
 */
function new_vir_fotoalbom(objJSON) {
    var info= document.getElementById('info_vir_albom');
    info.dataset.tag=objJSON.id;
    info.innerHTML=`Имя текущего вирт альбома ${objJSON.name}`;

}