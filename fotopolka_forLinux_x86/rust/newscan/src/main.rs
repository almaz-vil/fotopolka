extern crate regex;

use std::time::Instant;
use walkdir::WalkDir;
use std::path::Path;
use std::process::exit;

struct Fould {
  id: i32,
  count: i32,
  name: String

}

struct Foto {
  id_fould: i32,
  name: String
}
fn main()->Result<(), std::io::Error> {
    let start = Instant::now();

    #[cfg(target_os = "linux")]
    println!("Привет, Linux!");
    #[cfg(not(target_os = "linux"))]
    println!("Привет, Windows!");
    println!("Сканирование...\n");
    let mut fotos= Vec::new();
    let mut not_fotos= Vec::new();
    
    let semver=regex::Regex::new(r"(\w*)(.jpg|.JPG|.jpeg|.JPEG|.png|.jpg|.JPG|.jpeg|.JPEG|.png)").unwrap();    

    let dir_scan = "./foto/".to_string();
    
    for entry_result in WalkDir::new(dir_scan.clone()) {
      let entry=match entry_result {
              Ok(d)=>d,
              Err(e)=>{ println!("Не нахожу каталог '{1}'!\n{0}\nРабота программы завершена.", e, dir_scan);
                               exit(0)}
          };
      let d=entry.path();
      if entry.file_type().is_file(){
        if semver.is_match(d.to_string_lossy().into_owned().as_str()) && !d.to_string_lossy().into_owned().contains("\"") {           
          fotos.push(d.to_string_lossy().into_owned());          
        }else {
          not_fotos.push(entry.path().to_string_lossy().into_owned());
         }
        }  
    
    }
    println!("Файлы не подлежащие обработке:\t");
    not_fotos.iter().for_each(|f| println!("\t{}", f));
    println!("Обработка... \n");
    let mut countfould=0;
    let mut arrayfotos: Vec<Foto>=Vec::new();
    let mut arrayfoud: Vec<Fould>=Vec::new();
    let mut arrayfould: Vec<String>=Vec::new();
    
    for (_i, val) in fotos.iter().enumerate(){
      let value =Path::new(val);
      #[cfg(target_os = "linux")] 
      let  fould= value.parent().unwrap().to_string_lossy().into_owned()[2..].to_string()+r"/";
      #[cfg(not(target_os = "linux"))]
      let fould= value.parent().unwrap().to_string_lossy().into_owned()[2..].to_string().replace(r"\", r"/")+r"/" ;// Замена "\" на "/"
      let filename=value.file_name().unwrap().to_string_lossy().into_owned();
      if arrayfould.contains(&fould){
        for (_id, co) in arrayfoud.iter_mut().enumerate(){
          if co.name.contains(fould.as_str()){
          co.count=co.count+1;}
        }
      }else{
        arrayfould.push(fould.clone());
        countfould=countfould+1;        
        arrayfoud.push(Fould {id: (countfould), count: (1), name: (fould) });
        }
      arrayfotos.push(Foto{id_fould: (countfould),name: (filename)});
    }
    //Сохранение в базе данных

     for (_i, val) in arrayfoud.iter().enumerate(){
       println!("{} {} - {}", val.id, val.name, val.count)
     }
    let connection = sqlite::open("foalbom").unwrap();
    let mut sql= "DELETE FROM file;
    DELETE FROM fould;
    DELETE FROM vir_file;
    DELETE FROM vir_fould;
    UPDATE sqlite_sequence SET seq=0 WHERE name='fould';
    UPDATE sqlite_sequence SET seq=0 WHERE name='file'; BEGIN TRANSACTION;".to_string();
   
    for (_i, val) in arrayfoud.iter().enumerate(){
      sql=sql+"INSERT INTO fould (id, name, count, id_tag) VALUES("+val.id.to_string().as_str()+",\""+val.name.to_string().as_str()+
      "\", "+val.count.to_string().as_str()+", "+"0"+"); ";
    }
    for (_i, val) in arrayfotos.iter().enumerate(){
        sql=sql+"INSERT INTO file (name, id_fould) VALUES(\""+val.name.as_str()+"\", "+val.id_fould.to_string().as_str()+"); ";
        }
    sql=sql+"COMMIT;";
    
    println!("\nКол-во файлов\t{}\nКоль-во папок\t{}\n", arrayfotos.len(), arrayfoud.len());
    match connection.execute(sql){
        Ok(_)=> {
          let duration = start.elapsed().as_secs_f32();
          println!("Запись в базу завершена!\nВремя исполнения {:.2} сек", duration)},
        Err(e)=> println!(" \n Произошла ошибка:\n \t{}", e)
      };
    exit(0);
   }
 
