const http = require("http");
let satic = require('node-static');
const HeadlerParam = require('./urlparam');
const Foto = require('./fotoalbom');
const Admin = require('./admin');
const sqlite =require('sqlite-sync');// require("sqlite3");
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
                        case (oper.match(/vir_alboms/) || {}).input:
                            admin.ResponeJSON(response, admin.json_vir_alboms());
                            break;
                        case (oper.match(/vir_albom/) || {}).input:
                            admin.ResponeJSON(response, admin.AlbomVirInJSON(JSON.parse(body)["fould"]));
                            break;
                        case (oper.match(/albom/) || {}).input:
                            admin.ResponeJSON(response, admin.AlbomInJSON(JSON.parse(body)["fould"]));
                            break;
                        case (oper.match(/showfoto/) || {}).input:
                            var js=JSON.parse(body);
                            console.dir(js);
                            //var ob={'id_foto': js['i']}
                          admin.ResponeJSON(response, fotoalbom.ShowFoto(js.id_foto, js.foto, js.fould, js.id_fould, js.id_vir_fould, js.naprav ));
                            break;
                    }
                });
            } else {
                if (HeadlerParam(param, "ajax") > -1) {
                    response.setHeader("Content-Type", "text/html; charset=utf-8;");
                    fotoalbom.ImagAjax(response, HeadlerParam(param, "floud"), HeadlerParam(param, "foto"));
                    response.end();
                } else {

                    response.setHeader("Content-Type", "text/html; charset=utf-8;");
                    response.write("<!doctype html>");
                    response.write('<head><title>NODE JS приложение "Фотополка"</title><link rel="stylesheet" type="text/css" href="./c.css"><script type="text/javascript" src="requestax.js"></script></head>');

                    if (HeadlerParam(param, "floud") > -1) {
                        if (HeadlerParam(param, "foto") > -1) {
                            response.write(`<div class="menu"><div onclick="window.history.back()">Кнопка назад</div></div>`);
                            fotoalbom.Imag(response, param);
                        } else {
                            response.write(`<div class="caps"><h1>Фотополка</h1><div class="menu"><div onclick="window.history.back()">Кнопка назад</div></div></div>`);

                            fotoalbom.PrintAlbom(response, param);
                        }
                    } else {
                        response.write(`<div class="caps"><h1>Фотополка</h1><div class="menu"><div onclick="zaprosPOST({'oper':'vir_alboms'}, alboms_vit_print)">Виртуальные альбомы</div></div></div>`);
                        fotoalbom.PrintAllCaptionAlbom(response, param);
                    }
                    response.write("</html")
                    response.end("");
                }
            }
        }

    }).listen(3000, function(){//127.0.0.1
    console.log("Сервер начал прослушивание запросов на порту 3000");
});




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
                        case (oper.match(/insert/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.InsertInVirtualAlbom(JSON.parse(body)["id_vir_fould"],JSON.parse(body)["id_foto"]));
                            break;
                        case (oper.match(/delete/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.DeleteIzVirtualAlbom(JSON.parse(body)["id_vir_fould"],JSON.parse(body)["id_foto"]));
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
                        case (oper.match(/vir_albom_delete/) || {}).input:
                            admin.ResponeJSON(response, fotoalbom.DeleteVirtualAlbom(JSON.parse(body)["id_vir_albom"]));
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




