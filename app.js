const http = require("http");
const WebSocket = require("websocket").server;
let satic = require('node-static');
const HeadlerParam = require('./urlparam');
const Foto = require('./fotoalbom');
const Admin = require('./admin');
const sqlite =require('sqlite-sync');
sqlite.connect('foalbom');
let admin = new Admin(sqlite);
let fotoalbom =  new Foto(sqlite);
let serverf = new satic.Server('./');

http.createServer(
    function(request,response){
        var param=request.url;
        if(admin.file_check(param)){  request.addListener('end', function(){ serverf.serve(request,response); }).resume();}
        else{
            if(HeadlerParam(param, "POST")>-1){
                var body = '';
                request.on('data', function (data) {
                    body += data;
                    if (body.length > 1e6)
                        request.connection.destroy();
                });
                request.on('end', function () {
                    var oper=JSON.parse(body)["oper"];
                    switch (oper) {
                        case (oper.match(/alboms_/) || {}).input:
                            admin.ResponeJSON(response, admin.json_alboms());
                            break;
                        case (oper.match(/vir_alboms/) || {}).input:
                            admin.ResponeJSON(response, admin.json_vir_alboms());
                            break;
                        case (oper.match(/vir_albom/) || {}).input:
                            admin.ResponeJSON(response, admin.AlbomVirInJSON(JSON.parse(body)["fould"]));
                            break;
                        case (oper.match(/albom/) || {}).input:
                            admin.ResponeJSON(response, admin.AlbomInJSON(JSON.parse(body)["fould"]));
                            break;
                        case (oper.match(/findAlboms/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, admin.FindAlbomJSON(js.text, js.flag_vir));
                            break;
                        case (oper.match(/datefind/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, admin.FindDateAlbomJSON(js.date_ot, js.date_do, js.findinfoto));
                            break;
                        case (oper.match(/date_min_max/) || {}).input:
                            admin.ResponeJSON(response, admin.FindDateMinMaxJSON());
                            break;
                        case (oper.match(/showfoto/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, fotoalbom.ShowFoto(js.id_foto, js.foto, js.fould, js.id_fould, js.id_vir_fould, js.naprav ));
                            break;
                    }
                });
            } else {
                var data=new Date();
                    response.setHeader("Content-Type", "text/html; charset=utf-8;");
                    response.write("<!doctype html>");
                    response.write('<head><title>NODE JS приложение "Фотополка"</title><link rel="stylesheet" type="text/css" href="./c.css"><script type="text/javascript" src="requestax.js"></script></head>');
                    response.write(`<div class="caps" id="caps"><div><h1 id="caps_h1">Фотополка</h1></div>`+
                        `<div id="menufind1" style="visibility: visible"><label><input type="radio" name="find"  value="альбомах" id="find_in_albom">альбомах</label><label><input name="find" id="findinfoto" type="radio" checked="true" value="фотографиях" id="find_in_foto">фотографиях</label></div>`+
                        `<div id="menufind" style="visibility: hidden"><input type="datetime-local" id="date_ot" onchange="finddata(document.getElementById('findinfoto').checked)"><input type="datetime-local" value="${data.toISOString().substring(0, 16)}" id="date_do" onchange="finddata(document.getElementById('findinfoto').checked);"><input id="find"  name="find" placeholder="Для поиска начните ввод." data-flag_vir="false" onkeyup="var t=this.value; {zaprosPOST({'oper':'findAlboms', 'text':t, 'flag_vir':this.dataset.flag_vir}, alboms_print)}"></div>`+
                        `</div><div class="menu">`+
                        `<div onclick="document.getElementById('find').dataset.flag_vir=true ;zaprosPOST({'oper':'vir_alboms'}, alboms_vit_print)">Виртуальные альбомы</div>`+
                        `<div onclick="document.getElementById('find').dataset.flag_vir=false ;zaprosPOST({'oper':'alboms_'}, alboms_print)">Альбомы</div>`+
                        `<div onclick="panelfind(document.getElementById('menufind'))">поиск</div>`+

                    `</div>`);
                    fotoalbom.PrintAllCaptionAlbom(response, param);
                    response.write("</html")
                    response.end("");
            }
        }

    }).listen(3000, function(){//127.0.0.1
    console.log("Сервер начал прослушивание запросов на порту 3000");
});




const serverAdmin=http.createServer(
    function(request,response){
        if(admin.file_check(request.url)){  request.addListener('end', function(){ serverf.serve(request,response); }).resume();}
        else{
            if(HeadlerParam(request.url, "POST")>-1){
                var body = '';
                request.on('data', function (data) {
                    body += data;
                    if (body.length > 1e6)
                        request.connection.destroy();
                });
                request.on('end', function () {
                    var oper=JSON.parse(body)["oper"];
                    switch (oper) {
                        case (oper.match(/insert/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.InsertInVirtualAlbom(JSON.parse(body)["id_vir_fould"],JSON.parse(body)["id_foto"]));
                            break;
                        case (oper.match(/delete_/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.DeleteIzVirtualAlbom(JSON.parse(body)["id_vir_fould"],JSON.parse(body)["id_foto"]));
                            break;
                        case (oper.match(/vir_albom_rename/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.RenameVirtualAlbom(JSON.parse(body)["id_vir_albom"],JSON.parse(body)["name"]));
                            break;
                        case (oper.match(/fotoalbom/) || {}).input:
                            admin.ResponeJSON(response, admin.AlbomInJSON(JSON.parse(body)["fould"],JSON.parse(body)["vir_albom"]));
                            break;
                        case (oper.match(/vir_f/) || {}).input:
                            admin.ResponeJSON(response, admin.AlbomVirInJSON(JSON.parse(body)["fould"]));
                            break;
                        case (oper.match(/new_vir_albom/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.NewVirtualAlbom(JSON.parse(body)["name"]));
                            break;
                        case (oper.match(/websocket/) || {}).input:
                            admin.ResponeJSON(response, admin.Websoket(WebSocket, serverAdmin));
                            break;
                        case (oper.match(/vir_albom_delete/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.DeleteVirtualAlbom(JSON.parse(body)["id_vir_albom"]));
                            break;
                        case (oper.match(/info_admin_foto/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, fotoalbom.InfoAdminFoto(js.id_foto));
                            break;
                        case (oper.match(/info_exif/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, admin.InfoEXIF(js.id_foto));
                            break;
                        case (oper.match(/add_date_for_foto/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, fotoalbom.AddTimeForFoto(js.id_foto, js.date));
                            break;
                        case (oper.match(/ad_date_for_fotos/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, fotoalbom.AddTimeForFotos(js.mas));
                            break;
                        case (oper.match(/date_file/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, admin.InfoTimeForFile(js.mas));
                            break;
                        case (oper.match(/rotate_file/) || {}).input:
                            var js=JSON.parse(body);
                            admin.ResponeJSON(response, admin.RotateFile(js.mas));
                            break;
                        
                    }
                });
            }
            else {
                  response.setHeader("Content-Type", "text/html; charset=utf-8;");
                  response.write("<!doctype html>");
                  response.write('<head><title>NODE JS приложение "Фотополка" - административная панель</title>    <link rel="stylesheet" type="text/css" href="./c.css"><script type="text/javascript" src="requestax.js"></script></head>');
                  admin.panel_admin(response);
                  response.write("</html")
                  response.end("");
                }

        }
    }).listen(3001, function(){//127.0.0.1
    console.log("Сервер начал прослушивание запросов на порту 3001");
});




