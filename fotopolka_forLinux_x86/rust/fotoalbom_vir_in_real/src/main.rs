extern crate chrono;

use chrono::prelude::*;
use sqlite::State;
use sqlite::Value;
use std::path::Path;
use std::process::exit;
use filetime::FileTime;
fn main() {
    let connection = sqlite::open("foalbom").unwrap();
    let mut statement= connection.prepare("SELECT id, name FROM vir_fould").unwrap();
    while let State::Row = statement.next().unwrap()  {
        let mut dir_str=String::new();
        dir_str.push_str("./foto/");
        dir_str.push_str(statement.read::<String>(1).unwrap().as_str());
        dir_str.push_str("/");
        let d_path=Path::new(dir_str.as_str());
        match  std::fs::create_dir(d_path){
            Ok(_)=>println!("{} {}", statement.read::<String>(0).unwrap(),statement.read::<String>(1).unwrap()),
            Err(_)=>{println!("Работа завершена! Каталог {} уже существует.", d_path.to_string_lossy());
            exit(0);            
            }
        }               
        
    };
    let mut statement1= connection.prepare("SELECT id, name FROM vir_fould").unwrap();
    while let State::Row = statement1.next().unwrap()  {
        
            
        let mut stn1= connection.prepare(
            "SELECT file.name, fould.name AS fould, file.time  FROM vir_file, file, fould WHERE ((vir_file.id_file=file.id) AND (file.id_fould=fould.id) AND (vir_file.id_vir_fould=?))")
            .unwrap()
            .into_cursor()
            .bind(&[Value::Integer(statement1.read::<i64>(0).unwrap())]).unwrap();
            while let Some(Ok(row))= stn1.next() {
            let filename=row.get::<String, _>(0);
            let mut dest_str=String::new();
            dest_str.push_str("./foto/");
            dest_str.push_str(statement1.read::<String>(1).unwrap().as_str());
            dest_str.push_str("/");
            
            dest_str.push_str(&filename);
            let mut src_str=String::new();
            src_str.push_str("./");
            src_str.push_str(row.get::<String, _>(1).as_str());
            src_str.push_str(filename.as_str());
             let src_path=Path::new(src_str.as_str());
            let dest_path=Path::new(dest_str.as_str());

            

            match std::fs::copy(src_path, dest_path){
              Ok(_)=> std::fs::remove_file(src_path).unwrap(),
              Err(x)=>println!("error {}",x)  
            }
            println!("{}->{}", src_str, dest_str);
            let milisec=row.get::<i64,_>(2);
            let naive = match NaiveDateTime::from_timestamp_millis(milisec){
                Some(x)=>x,
                None=>panic!("Error convent time")
            };         
            let ftime=FileTime::from_unix_time(naive.timestamp(),naive.nanosecond());
            let res=filetime::set_file_mtime(dest_path, ftime);
            match res {
                Err(error)=>println!("Error {error}"),
                Ok(_)=>()

            }
            
        }
    }
    println!("Работа по созданию альбомов завершена!\nПроведите начальную настройку.");
}
