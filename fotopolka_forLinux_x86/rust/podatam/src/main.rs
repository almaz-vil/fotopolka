extern crate chrono;

use std::time::Instant;
use chrono::prelude::*;
use sqlite::State;
use std::path::Path;
use filetime::FileTime;
fn main() {
    let start = Instant::now();
    println!("Привет, Linux!");
    println!("Рапределение по годам...\n");  

  let connection = sqlite::open("foalbom").unwrap();
  let mut statement= connection.prepare("SELECT file.id AS id, file.name AS file_name, fould.name AS fould_p, file.time AS time FROM file, fould WHERE file.id_fould=fould.id").unwrap();
  while let State::Row = statement.next().unwrap()  {
    let floud=statement.read::<String>(2).unwrap();  
    let file_name=statement.read::<String>(1).unwrap();
    let mut src_str=String::new();
      src_str.push_str(floud.as_str());
    src_str.push_str(file_name.as_str());
      
      let src_path=Path::new(src_str.as_str());
      let milisec=statement.read::<i64>(3).unwrap();
      let naive = match NaiveDateTime::from_timestamp_millis(milisec){
          Some(x)=>x,
          None=>panic!("Ошибка конвертации значения времяни.")
      };         
      let yad=naive.format("%Y").to_string()+"/";
      let mut dest_str=floud.clone();
      dest_str.insert_str(5, &yad);
      dest_str.push_str(file_name.as_str());
      let dest_path=Path::new(dest_str.as_str());
      let found=dest_path.parent().unwrap();
      let exis=found.try_exists().expect("Ошибка проверки на наличие католога!");
      if !exis {
       std::fs::create_dir_all(found).expect("Ошибка создания католога!");
      }
      match std::fs::copy(src_path, dest_path){
        Ok(_)=> {println!("{}->{}", src_str, dest_str);
                std::fs::remove_file(src_path).unwrap();},
        Err(x)=>println!("Ошибка копирования {}",x)  
      }
      
      let ftime=FileTime::from_unix_time(naive.timestamp(),naive.nanosecond());
      let res=filetime::set_file_mtime(dest_path, ftime);
      match res {
          Err(error)=>println!("Error {error}"),
          Ok(_)=>()

      }

  }
  let duration = start.elapsed().as_secs_f32();
  println!("Процесс распределения завершен!\nВремя исполнения {:.2} сек", duration);
}
