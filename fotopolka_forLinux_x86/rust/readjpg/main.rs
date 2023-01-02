extern crate exif;
extern crate regex;
extern crate chrono;

use chrono::{NaiveDate, NaiveDateTime, Duration};
use exif::{In, Tag};
use std::process::exit;
use std::path::Path;
use sqlite::State;
use std::time::Instant;

struct FidDate{
  id:String,
  msec: i64,
  shablon: i32,
}

fn main()->Result<(), std::io::Error>   {
  let start = Instant::now();

  #[cfg(target_os = "linux")]
  println!("Привет, Linux!");
  #[cfg(not(target_os = "linux"))]
  println!("Привет, Windows!");
  println!("Извлечение информации о времяни и даты фотографий. \nСканирование...\n");  
  let is_whasap=regex::Regex::new(r"IMG-(\d{8})(\w*)").unwrap();    
  let mut listtime:Vec<FidDate>=Vec::new();
  
  let connection = sqlite::open("foalbom").unwrap();
  let mut statement= connection.prepare("SELECT file.id AS id, file.name AS file_name, fould.name AS fould_p FROM file, fould WHERE file.id_fould=fould.id").unwrap();
  while let State::Row = statement.next().unwrap()  {
      let mut file_str=String::new();
      file_str.push_str(statement.read::<String>(2).unwrap().as_str());
      file_str.push_str("/");
      file_str.push_str(statement.read::<String>(1).unwrap().as_str());
      
      let entry=Path::new(file_str.as_str());
      if entry.is_file(){    
        let name_file=entry.file_name().unwrap().to_string_lossy().into_owned();
        let mut ttime=FidDate{id:statement.read::<String>(0).unwrap(), msec:0, shablon:0} ;
          
        if is_whasap.is_match(name_file.as_str()){
          ttime.shablon=3;
          ttime.msec=timeizname(name_file).checked_add_signed(Duration::hours(-3)).unwrap().timestamp_millis(); 
        }
        else{
          match timeisexif(entry) {
              Some(d)=>{
                                  ttime.shablon=0;    
                                  ttime.msec=d.checked_add_signed(Duration::hours(-3)).unwrap().timestamp_millis()}
              None=>{
                  ttime.shablon=1;
                  ttime.msec=1;
              }
          };
        }
        listtime.push(ttime);
         
      }
  }

  let mut sql= "BEGIN TRANSACTION;".to_string();
   
    for (_i, val) in listtime.iter().enumerate(){
      sql=sql+"UPDATE file SET time="+val.msec.to_string().as_str()+", time_shablon="+val.shablon.to_string().as_str()+" WHERE id="+val.id.to_string().as_str()+";"
    }
    sql=sql+"COMMIT;";
    match connection.execute(sql){
        Ok(_)=> {
          let duration = start.elapsed().as_secs_f32();
          println!("Записано {} в базу!\nВремя исполнения {:.2} сек", listtime.len(), duration)},
        Err(e)=> println!(" \n Произошла ошибка:\n \t{}", e)
      };
  exit(0);
}


/// Из Exif файла дату 
fn timeisexif(filepath: &Path)->Option<NaiveDateTime>{
  let file = std::fs::File::open(filepath).expect("Ошибка открытие файла");
  let mut bufreader = std::io::BufReader::new(file);
          let exifreader = exif::Reader::new();
          let exif = match  exifreader.read_from_container(&mut bufreader){
            Ok(x)=>x,
            Err(_)=>return None
          };
          let s = match exif.get_field(Tag::DateTimeOriginal, In::PRIMARY) {
            Some(x)=> x.display_value(),  
            None=> return None
          };
          let parse_from_str = NaiveDateTime::parse_from_str;

           match parse_from_str(s.to_string().as_str(), "%Y-%m-%d %H:%M:%S") {
            Ok(d)=> return Some(d),
            Err(_)=> return None
        };          
        
}
/// Из названия файла - дату
fn timeizname(nfile: String)->NaiveDateTime{
  let year=match nfile[4..8].parse::<i32>() {
    Ok(x)=>x,
    Err(e)=> panic!("Ошибка {} в {}",e , nfile),
};
let month=match nfile[8..10].parse::<u32>() {
    Ok(x)=>x,
    Err(e)=> panic!("Ошибка {} в {}",e , nfile),
};
let day=match nfile[10..12].parse::<u32>() {
    Ok(x)=>x,
    Err(e)=> panic!("Ошибка {} в {}",e , nfile),
};
let date= match NaiveDate::from_ymd_opt(year, month, day) {
    Some(d)=>d,
    None=>panic!("Ошибка в создание даты")
};
match date.and_hms_opt(12, 11, 54) {
  Some(d)=>d,
  None=>panic!("Ошибка в создание даты")    
}

}
