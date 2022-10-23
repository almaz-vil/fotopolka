/**
 * Удаление фона классу CCS polka
 */
function clearbackgroudpolka(){
    var polka=document.getElementsByClassName('polka');for (p of polka){p.style.background='none'} ;
}
const TIME_FORMAT_MAS=[  
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

function admin_panel_for_new_name_vir_fould(){
    var response=document.getElementById('dialog');
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
    var response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Удалить виртуальный альбом?</div>`+
        `<img src="vopros.png">`+
        `<button id="new_name_button"  onclick="var id=document.getElementById('info_vir_albom').dataset.tag;`+
        `zaprosPOST({'id_vir_albom': id, 'oper': 'vir_albom_delete'}, delete_vir_albom);`+
        `document.getElementById('new_name_vir_fould').style.display='none'">Удалить</button>`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Отмена</button>`+
        `</div></div>`;

}
function admin_panel_for_rename_vir_fould(){
    var response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Переименовать виртуальный альбом?</div>`+
        `<label>Введите имя:<input type="text" maxlength="256" id="new_name"></label>`+
        `<button id="new_name_button"  onclick="let id=document.getElementById('info_vir_albom').dataset.tag;console.log(id);  let caption=document.getElementById('new_name').value;`+
        `zaprosPOST({'id_vir_albom': id, 'oper': 'vir_albom_rename', 'name': caption}, rename_vir_albom);`+
        `document.getElementById('new_name_vir_fould').style.display='none'">Переименовать</button>`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Отмена</button>`+
        `</div></div>`;

}
function rename_vir_albom(objJSON) {
    console.dir(objJSON);
    var response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Виртуальный альбом переименован!</div>`+
        `<img src="znak_ok.png" width="256">`+
        `Виртуальный альбом "${objJSON.name}"!`+
        `<button id="new_name_button"  onclick="zaprosPOST({'fould': ${objJSON.id}, 'oper': 'vir_f'}, alboms_vir_print_admin);document.getElementById('new_name_vir_fould').style.display='none'">Хорошо!</button>`+
        `</div></div>`;
    var albom=document.getElementById('albom_admin');
    albom.innerHTML="";


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
    zaprosPOST({"fould": id_fould, "oper": "vir_f"}, alboms_vir_print_admin);
}
function zapros_vir_fotoalbom(id_fould) {
    zaprosPOST({"fould": id_fould, "oper": "vir_albom"}, albom_vir_print)
}
function zapros_fotoalbom(id_fould) {
    zaprosPOST({"fould": id_fould, "oper": "albom"}, albom_vir_print)
}
function zapros_info_exif(id_file) {
    zaprosPOST({"id_foto": id_file, "oper": "info_exif"}, info_exif);
}
function zapros_comment(id_file) {
    zaprosPOST({"id_foto": id_file, "oper": "add_comment"}, add_comment);
}



function albom_vir_print(objJSON){
    if (objJSON.length==0) return;
    var text="";
    text=`<div class="ziro"><img id="download" title="Скачать все ${objJSON.length} фотографии!" src="download.png" onclick="download_all();" /><button onclick="pplus(document.getElementById('albom_admin_foto').getElementsByClassName('albom'))">+</button>`+
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

function download_all(){    
    let albom=document.getElementById('albom_admin_foto');
    let polkas=albom.querySelectorAll('div.polka');
    let urls= new Array();
    polkas.forEach(element => {
        let alb=element.querySelector('div.albom');
        let img= alb.querySelector('img');
        urls.push(img.dataset.fould+img.dataset.foto);
    });
    const delay = () => new Promise(resolve => setTimeout(resolve, 1000));
    const downloadWithRequest = async () => {
      for await (const [index, url] of urls.entries()) {
        await delay();
        const link = document.createElement("a");
        link.href = url;
        link.download = url;
        link.click();
      }
    };
    downloadWithRequest();
    
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
    if(objJSON.comment){
        if (objJSON.comment.length=0)
            document.getElementById('date').innerHTML=`"${objJSON.caption}" ${objJSON.data}`
        else
            document.getElementById('date').innerHTML=`${objJSON.comment}`
    }
    else
        document.getElementById('date').innerHTML=`"${objJSON.caption}" ${objJSON.data}`
        
    
}
function delete_vir_albom(objJSON){
    var response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Виртуальный альбом удалён!</div>`+
        `<img src="znak_ok.png" width="256">`+
        `Виртуальный альбом "${objJSON.name}" удалён!`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Хорошо!</button>`+
        `</div></div>`;
    var info= document.getElementById('info_vir_albom');
    info.dataset.id_vir_albom="-1";
    info.dataset.tag="-1";
    info.innerHTML="";
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
        console.log('zapros time');
        zaprosPOST({'oper':'date_min_max'}, finddate_max_min);
    }else {
        if(document.getElementById('caps_h1').style.display=="none") {
            panel.style.display = "none";
        }
        panel1.style.display="none";
        panel.style.visibility="hidden";
        panel1.style.visibility="hidden";
    }

}
function finddate_max_min(objJSON) {
    const max=new Date(parseInt(objJSON.max,10));
    const min=new Date(parseInt(objJSON.min,10));
    max.setMilliseconds(4 * 60 * 60 * 1000);  // +4 часа
    min.setMilliseconds(4 * 60 * 60 * 1000);  // +4 часа
    document.getElementById('date_ot').value=min.toISOString().substring(0, 16);
    document.getElementById('date_do').value=max.toISOString().substring(0, 16);

}
function check() {
    var id_vir_albom=this.dataset.id_vir_albom;
    var id_foto=this.dataset.id_foto;
    if(id_vir_albom=="-1") {
        zaprosPOST({"oper":"info_admin_foto", "id_foto": id_foto}, info_admin_foto);
        return;
    }
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

function info_exif(objJSON){
    console.dir(objJSON);
    let info=document.getElementById('dialog');
    info.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">EXIF информация`+
        `<div class="close" id="button_close" onclick="document.getElementById('new_name_vir_fould').style.display='none'">X</div></div>`+
        `<div style="text-shadow: none; background-color: aliceblue;  height: 80vh; overflow:auto;" id="log_error" ><pre>${objJSON.file}<br>${objJSON.exif}</pre></div>`+
        `</div></div>`;
}


function zapros_admin_add_comment(id_file, comment) {
    zaprosPOST({"id_foto": id_file, "comment":comment, "oper": "comment_add_for_foto"}, add_comment_for_foto_otvet);
}

function add_comment_for_foto_otvet(objJSON) {
    console.dir(objJSON);
    var response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Комментарии к фотографии успешна изменены!</div>`+
        `<img src="znak_ok.png" width="256">`+
        `На "${objJSON.comment}"!`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Хорошо!</button>`+
        `</div></div>`;
    
}

function add_comment(objJSON){
    let info=document.getElementById('dialog');
    info.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Комментарий к фото`+
        `<div class="close" id="button_close" onclick="document.getElementById('new_name_vir_fould').style.display='none'">X</div></div>`+
        `<div style="text-shadow: none; background-color: aliceblue;  height: 80vh; overflow:auto;"><textarea id="add_comment">${objJSON.comment}</textarea></div>`+
        `<button  onclick="zapros_admin_add_comment(${objJSON.foto_id}, document.getElementById('add_comment').value)">Изменить</button>`+
        `</div></div>`;
}

function zapros_admin_add_date_for_foto(id_file, date) {
    zaprosPOST({"id_foto": id_file, "date":date, "oper": "add_date_for_foto"}, add_date_for_foto_otvet);
}

function add_date_for_foto_otvet(objJSON) {
    var response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Дата фотографии успешна изменена!</div>`+
        `<img src="znak_ok.png" width="256">`+
        `На "${objJSON.date}"!`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Хорошо!</button>`+
        `</div></div>`;
    
}

function add_date_for_foto(foto_id) {    
    var info=document.getElementById('dialog');
    info.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Изменение даты `+
        `<div class="close" id="button_close" onclick="document.getElementById('new_name_vir_fould').style.display='none'">X</div></div>`+
        `<input type="datetime-local" id="date_new"></input>`+
        `<button  onclick="zapros_admin_add_date_for_foto(${foto_id}, document.getElementById('date_new').value)">Изменить</button>`+        
        `</div></div>`;
}

function info_admin_foto(objJSON){
    console.dir(objJSON);
    let date_t=new Date(1977);
    if(objJSON.time==date_t.getTime()){
        objJSON.date=`<img src="add_time.png" class="info_vir_albom_button" onclick="add_date_for_foto(${objJSON.id})"/><br>${objJSON.file}`;
    }
    let info=document.getElementById('info_vir_albom');
    info.innerHTML=`<img src="${objJSON.fould}${objJSON.file}" id="info_vir_albom_img"/>`+
                    `<img src="info_exif.png" class="info_vir_albom_button" onclick="zapros_info_exif(${objJSON.id})"/>`+
                    `<img src="add_comment.png" class="info_vir_albom_button" onclick="zapros_comment(${objJSON.id})"/>`+
                    `${objJSON.date}`;
    
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
    info.innerHTML=`<div class="close" id="button_close" onclick="close_vir_albom()">X</div><br>Имя текущего вирт альбома <b>${objJSON.name}<b/><br>Общие количество фотографий в альбоме <b>${objJSON.count}</b>`;
}

function add_button_for_add_date_fotos(fould_id) {
    let info=document.getElementById('info_vir_albom');
        info.innerHTML=`<img src="add_time.png" class="info_vir_albom_button" onclick="zaprosPOST({'fould': ${fould_id}, 'oper': 'fotoalbom'}, add_date_fotos_form)"/>`;
                 
}

function chas_kor_time_chesk() {
    if (this.style.opacity=="0.75"){
        this.style.opacity="0";        
        this.dataset.flag="false";
    }else {
        this.style.opacity="0.75";
        this.dataset.flag="true";
    }

}

function chas_kor_time_chesk_all() {
    if (this.style.opacity=="0.75"){
        this.style.opacity="0";
    }else {
        this.style.opacity="0.75";
    }
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_check');
    mas_times.forEach((element)=>{
        chas_kor_time_chesk.bind(element)();
    });

}

function chas_kor_time(index) {
    const houur=index-12;
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let check=document.getElementById(element.dataset.id_check).dataset.flag;
        if(check==="true"){
            let shablon=element.dataset.shablon;
            let date= new Date(Number(element.dataset.time));
            date.setHours(date.getHours()+houur);
            let milsec=date.getTime();
            element.dataset.time=milsec;
            element.innerText=`${DateInStrFormat(milsec,TIME_FORMAT_MAS[Number(shablon)])}`;
        }
    });
}

function kor_date(date_s) {
    let dat = new Date(date_s);
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let check=document.getElementById(element.dataset.id_check).dataset.flag;
        if(check==="true"){            
            let milsec=dat.getTime();
            element.dataset.time=milsec;
            element.innerText=`${DateInStrFormat(milsec,TIME_FORMAT_MAS[Number(element.dataset.shablon)])}`;
        }
    });
}

function kor_shablon(index) {
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let check=document.getElementById(element.dataset.id_check).dataset.flag;
        if(check==="true"){
            element.dataset.shablon=index;
            let milsec=element.dataset.time;
            element.innerText=`${DateInStrFormat(milsec,TIME_FORMAT_MAS[Number(index)])}`;
        }
    });
}

function chas_kor_shablon() {
    const shablon=this.selectedIndex;
    const id=this.id;
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let sha=element.dataset.id_shablon;
        if(id===sha){
            element.dataset.shablon=shablon;
            element.innerText=`${DateInStrFormat(element.dataset.time,TIME_FORMAT_MAS[Number(shablon)])}`;
            return;
        }
    });
}


function chas_kor_insert() {
    let mas = new Array();
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{

        mas.push({id:element.dataset.id,time:element.dataset.time, shablon:element.dataset.shablon});
        });
    console.dir(mas);
    zaprosPOST({'oper': 'ad_date_for_fotos', 'mas':`${JSON.stringify(mas)}`}, chas_kor_insert_otvet);
}

function chas_kor_insert_otvet(objJSON) {
    document.getElementById('new_name_vir_fould').style.display='none';
    let response=document.getElementById('dialog');
    response.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Даты фотографий успешна изменены!</div>`+
        `<img src="znak_ok.png" width="256">`+
        `<button id="new_name_button"  onclick="document.getElementById('new_name_vir_fould').style.display='none'">Хорошо!</button>`+
        `</div></div>`;
}


function zapros_rotate_file() {    
    let mas = new Array();
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let check=document.getElementById(element.dataset.id_check).dataset.flag;
        if(check==="true"){
            mas.push({id:element.dataset.id, shablon:element.dataset.shablon});
        }
        });
    zaprosPOST({'oper': 'rotate_file', 'mas':`${JSON.stringify(mas)}`}, otvet_rotate_file);    
}

function otvet_rotate_file(objJSON) {
    console.dir(objJSON);
    objJSON.forEach((item)=>{
        let element=document.getElementById(`imgdd_${Number(item.id)}`);
        let t=new Date();
        let src=`${element.src}?${t.getTime()}`;
        element.src=src;
        let chesk=document.getElementById(`chesk_${Number(item.id)}`);
        chesk.style.opacity="0";
        });
} 


function zapros_date_file() {    
    let mas = new Array();
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let check=document.getElementById(element.dataset.id_check).dataset.flag;
        if(check==="true"){
            mas.push({id:element.dataset.id, shablon:element.dataset.shablon});
        }
        });
    zaprosPOST({'oper': 'date_file', 'mas':`${JSON.stringify(mas)}`}, otvet_date_file);    
}

function otvet_date_file(objJSON) {
    let mas_times=new Array();
    mas_times=document.querySelectorAll('.time_s');
    mas_times.forEach((element)=>{
        let check=document.getElementById(element.dataset.id_check).dataset.flag;
        if(check==="true"){
            objJSON.forEach((item)=>{
                if(item.id===element.dataset.id){
                    let shablon=element.dataset.shablon;
                    let milsec=item.time;
                    element.dataset.time=milsec;
                    element.innerText=`${DateInStrFormat(milsec,TIME_FORMAT_MAS[Number(shablon)])}`;
               
                }
            });
        }
    });
} 

function  add_date_fotos_form(objJSON) {
    let grid_data='<div>Фото</div><div>Дата</div><div style="background-color:white">'+
    '<img src="check.png" draggable="false" onclick="chas_kor_time_chesk_all.bind(this)();"  style="width: 100%; opacity: 0%; height: 100%;">'+
    '</div><div>Вывод даты по шаблону</div>\n';
    
    objJSON.forEach(foto => {
        let list=`<select size="1" id="shablon_${foto.id}" onchange="chas_kor_shablon.bind(this)()">`;
        let t_shablon=0;
        let shablon=Number(foto.time_shablon);
        for(format of TIME_FORMAT_MAS){
            if(shablon==t_shablon){
                list=list+`<option selected>${DateInStrFormat(foto.time,format)}</option>`;
            }else{
                list=list+`<option>${DateInStrFormat(foto.time,format)}</option>`;}
            t_shablon=t_shablon+1;
        }
        list=list+'</select>';
        grid_data=grid_data+`<div><img src="${foto.fould}${foto.foto}" id="imgdd_${foto.id}" class="time_s_img" style="max-height: 4vh; " />`+
        `</div><div class="time_s" data-id="${foto.id}" data-id_check="chesk_${foto.id}" data-id_shablon="shablon_${foto.id}" data-shablon="${foto.time_shablon}" data-time="${foto.time}" data-time_format="${foto.time_shablon}">${foto.date}`+
                            `</div><div style="background-color:white">`+
                            `<img src="check.png" class="time_check" id="chesk_${foto.id}" draggable="false" onclick="chas_kor_time_chesk.bind(this)();"  style="width: 100%; opacity: 0%; height: 100%;">`+
                            `</div><div>${list}</div>\n`;
    });
    let mas_chas= Array('-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0'
                                ,'+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11','+12');
    let chas_list='<select id="select_chas_kor" onchange="chas_kor_time(this.selectedIndex)">';
    mas_chas.forEach((element, index)=>{
        if(index==12)
          chas_list=chas_list+`<option value="${element}" selected >${element}</option>`; 
        else
          chas_list=chas_list+`<option value="${element}" >${element}</option>`;
    });
    chas_list=chas_list+'</select>';
    let mas_shablon= Array('день, число месяц ГГГГ, ЧЧ:ММ',
                            'год','месяц год','число месяц год',
                            'день, число месяц ГГГГ');
    let shab_list='<select id="select_shab_kor" onchange="kor_shablon(this.selectedIndex)">';
    mas_shablon.forEach((element, index)=>{
        if(index==0)
          shab_list=shab_list+`<option value="${element}" selected >${element}</option>`; 
        else
        shab_list=shab_list+`<option value="${element}" >${element}</option>`;
    });
    shab_list=shab_list+'</select>';
    var info=document.getElementById('dialog');

    info.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Изменение даты `+
        `<div class="close" id="button_close" onclick="document.getElementById('new_name_vir_fould').style.display='none'">X</div></div>`+
        `<div class="div_form_fotos">`+
        `<img style="margin: 0 5px" src="rotate.png" class="info_vir_albom_button" onclick="zapros_rotate_file()" title="Поворот фотографий 90"/>`+
        `<img style="margin: 0 5px" src="info_exif.png" class="info_vir_albom_button" onclick="zapros_date_file()" title="Дату из свойства файла"/>`+
        `<label style="margin: 0 5px">Задать дату<input type="datetime-local" id="date_new" onchange="kor_date(this.value)"/></label>`+
        `<label style="margin: 0 5px">Корректировка шаблона ${shab_list}</label>`+
        `<label style="margin: 0 5px">Корректировка часового пояса ${chas_list}</label></div>`+
        `<div id="grid_fotos_date" >${grid_data}</div>`+
       
        `<button  onclick="chas_kor_insert()">Изменить</button>`+        
        `</div></div>`;
}

function alboms_print_admin(objJSON){

    var text=`<div class="ziro"><button onclick="pplus()">+</button>`+
        `<div class="caption">${objJSON[0].name}</div> <button onclick="mminus()">-</button><br></div>` +
        //`<div class="ziro"> </div> `+
        '<div id="albom_admin_foto">';
    let info= document.getElementById('info_vir_albom');
    let id_vir_albom=info.dataset.tag;
    if(id_vir_albom=="-1") {
        add_button_for_add_date_fotos(objJSON[0].fould_id);   
    }
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
         text=`<div id="albom_admin_foto"> В альбоме <b>${objJSON[0].name}</b> нет фотографий!<br><div><button onclick="admin_panel_for_rename_vir_fould()">Переименовать</button><button onclick="admin_panel_for_delete_vir_fould()">Удалить</button></div></div>`;
    }
    else{
        text=`<div class="ziro"><button onclick="pplus()">+</button>`+
            `<div class="caption">${objJSON[0].name}</div> <button onclick="mminus()">-</button><br><div><button onclick="admin_panel_for_rename_vir_fould()">Переименовать</button><button onclick="admin_panel_for_delete_vir_fould()">Удалить</button></div></div>` +
            '<div id="albom_admin_foto">';
        var info= document.getElementById('info_vir_albom');
        for( let foto of objJSON){
            text=text+`<div  class="polka"><div class="albom" style="background-image: url('${foto.fould}${foto.foto}'); background-position: bottom; background-repeat:no-repeat; background-size: contain;"><img src="check.png" draggable="false" data-id_vir_albom="${info.dataset.tag}" data-id_foto="${foto.id}" onclick="let g=check.bind(this); g();"  style="width: 100%; opacity: 0%; height: 100%;"></div></div>`;
        }
        text=text+'</div>';
    }
    var info= document.getElementById('info_vir_albom');
    info.dataset.tag=objJSON[0].id_vir_fould;
    info.innerHTML=`<div class="close" id="button_close" onclick="close_vir_albom()">X</div><br>Имя текущего вирт альбома <b>${objJSON[0].name}</b>`;
    var albom=document.getElementById('albom_admin');
    albom.innerHTML=text;
}

function close_vir_albom() {
    let info= document.getElementById('info_vir_albom');
    info.dataset.tag=-1;
    info.innerHTML=``;
    let fotos= new Array();
    fotos=document.getElementById('albom_admin_foto').getElementsByClassName('polka');
    for(element of fotos) {
       let img=element.querySelector('img');
       img.style.opacity='0';
       img.dataset.id_vir_albom='-1';
    };    
}


/**
 * Получено информация о новом фотоальбоме
 * @param objJSON
 */
function new_vir_fotoalbom(objJSON) {
    var info= document.getElementById('info_vir_albom');
    info.dataset.tag=objJSON.id;
    info.innerHTML=`<div class="close" id="button_close" onclick="close_vir_albom()">X</div>Имя текущего вирт альбома <b>${objJSON.name}</b>`;
    const ams=document.getElementById('admin_vid_vir_alboms');
    ams.innerHTML=ams.outerHTML+
    `<div  class="polka" id="vir_albom_${objJSON.id}" onclick="zapros_admin_vir_fotoalbom(${objJSON.id})"><div class="albom">`+
    `${objJSON.name}<br><b>{0}</b></div></div>`;
}
var rounded = function(number){
    return +number.toFixed(2);
}
//WebSocket для админки
function admin_websocket_client() {
    const webSocket = new WebSocket('ws://localhost:3001');
    let log_error = document.getElementById('log_error');
    let logg=document.getElementById('log');
    let img_reload=document.getElementById('imag_reload');
    webSocket.onopen = event => {
        logg.innerText='';
        log_error.innerText='';
        img_reload.style.display='block';
        document.getElementById('button_step_1').style.display='none';
        document.getElementById('button_step_2').style.display='none';
        document.getElementById('button_close').style.display='none';
        timer_init();
        webSocket.send("Efi");
    };
    let nober=0;
    let max_nober=0;
    let count_error=0;
    webSocket.onmessage = event => {
        if(max_nober==0){
            max_nober=event.data;
        } else {
            if (event.data.indexOf(':') > -1) {
                let objJSON = JSON.parse(event.data);
                if (objJSON.date == '-') {
                    log_error.innerText = `Файл ${objJSON.file} с ошибкой ${objJSON.error}! \x0a` + log_error.outerText;
                    count_error = count_error + 1;
                }
            }
        }
        if (count_error)
            logg.innerHTML=`Из ${max_nober} обработано <b>${rounded((nober*100)/max_nober)}%</b>(${nober})! С ошибкой ${count_error}.`;
        else
            logg.innerHTML=`Из ${max_nober} обработано <b>${rounded((nober*100)/max_nober)}%</b>(${nober})! `;
        if(max_nober==nober) {
            timer_stop();
            webSocket.close(1000);
        }
        nober=nober+1;
    };

    webSocket.onclose = event => {
        img_reload.style.display='none';
        log_error.innerText = logg.outerText+'\x0a'+ log_error.outerText;
        logg.innerText='Спасибо, первоначальная настройка завершина!';
        document.getElementById('close').style.display='block';
    };
}

function admin_websocket_client_scan() {
    const webSocket = new WebSocket('ws://localhost:3001');
    let log_error = document.getElementById('log_error');
    let logg=document.getElementById('log');
    let img_reload=document.getElementById('imag_reload');
    webSocket.onopen = event => {
        logg.innerText='';
        log_error.innerText='';
        document.getElementById('button_step_1').style.display='none';
        document.getElementById('button_step_2').style.display='none';
        document.getElementById('button_close').style.display='none';
        img_reload.style.display='block';
        timer_init();
        webSocket.send("scan");
    };
    webSocket.onmessage = event => {
        if (event.data.indexOf(':') > -1) {
            let objJSON = JSON.parse(event.data);
            log_error.innerText = `Папка ${objJSON.name} и ${objJSON.count} фотографий \x0a` + log_error.outerText;
            console.log(objJSON.date);
        } else{
            switch (event.data) {
                case (event.data.match(/exit_/) || {}).input:
                    webSocket.close(1000);
                    break;
                default:
                    logg.innerText = event.data;
            }
        }
    };
    webSocket.onclose = event => {
        timer_stop();
        img_reload.style.display='none';
        logg.innerText=logg.innerText+'Перейдите ко второму шагу!';
        document.getElementById('button_step_2').style.display='block';
        document.getElementById('button_close').style.display='block';
       
    };
}

function status_websocket(objJSON) {
    console.dir(objJSON);
}
function panel_admin() {
    var info=document.getElementById('dialog');
    info.innerHTML=`<div id="new_name_vir_fould"> <div class="form">`+
        `<div class="form_caption">Первоначальная настройка`+
        `<div class="close" id="button_close" onclick="document.getElementById('new_name_vir_fould').style.display='none'">X</div></div>`+
        `<img style="display:none;" class="loading" width="64px" id="imag_reload" src="reload.png"/>`+
        `<div id="timer">00:00</div>`+
        `<button id="button_step_1"  onclick="admin_websocket_client_scan();">Сканирование папки "foto"... (шаг 1)</button>`+
        `<button id="button_step_2"  onclick="admin_websocket_client();">Создать временные метки...(шаг 2)</button>`+
        `<button id="close" style="display: none" onclick="document.getElementById('new_name_vir_fould').style.display='none'">Готово</button> `+
        `<div style="text-shadow: none; background-color: aliceblue;" id="log" ></div>`+
        `<div style="text-shadow: none; background-color: aliceblue;  height: 10vh; overflow: auto;" id="log_error" ></div>`+
        `</div></div>`;

}

function DateInStrFormat(milsec, format) {
var date = new Date(Number(milsec));
return  date.toLocaleString("ru", format);
}

function panel_alboms_resize(minus=true){
    let d=document.getElementById('admin_grid');
    let whe=d.style.gridTemplateColumns;
    let zhach=256;//whe.split(' ')[0].split(px);
    if(minus){
        zhach=zhach/2;
    }else{
        zhach=zhach*2;
    }
    document.getElementById('admin_grid').style.gridTemplateColumns=`${zhach}px 1fr`;
}

function select_found(event) {
    let files = event.target.files;

    for (let i=0; i<files.length; i++)
        console.log(files[i].webkitRelativePath);

}

//Секундомер
//изначальные переменные
min = 0;
hour = 0;
id_timer=0;
//Оставляем вашу функцию
function timer_init() {
    sec = 0;
    id_timer=setInterval(timer_tick, 1000);
}
function timer_stop() {
    clearInterval(id_timer)
}

//Основная функция tick()
function timer_tick() {
    sec++;
    if (sec >= 60) { //задаем числовые параметры, меняющиеся по ходу работы программы
        min++;
        sec = sec - 60;
    }
    if (min >= 60) {
        hour++;
        min = min - 60;
    }
    if (sec < 10) { //Визуальное оформление
        if (min < 10) {
            if (hour < 10) {
                document.getElementById('timer').innerHTML ='0' + hour + ':0' + min + ':0' + sec;
            } else {
                document.getElementById('timer').innerHTML = hour + ':0' + min + ':0' + sec;
            }
        } else {
            if (hour < 10) {
                document.getElementById('timer').innerHTML = '0' + hour + ':' + min + ':0' + sec;
            } else {
                document.getElementById('timer').innerHTML = hour + ':' + min + ':0' + sec;
            }
        }
    } else {
        if (min < 10) {
            if (hour < 10) {
                document.getElementById('timer').innerHTML = '0' + hour + ':0' + min + ':' + sec;
            } else {
                document.getElementById('timer').innerHTML = hour + ':0' + min + ':' + sec;
            }
        } else {
            if (hour < 10) {
                document.getElementById('timer').innerHTML = '0' + hour + ':' + min + ':' + sec;
            } else {
                document.getElementById('timer').innerHTML = hour + ':' + min + ':' + sec;
            }
        }
    }
}


