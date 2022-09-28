import { getDatabase, ref, set, child, get } from "firebase/database";
import {app,storage} from '../firebase';
import { getDownloadURL, uploadBytesResumable, ref as sref,  getStorage,} from "firebase/storage";
import { useState } from "react";


export function AddTables(TableId,data){
  console.log("renderData");
  
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/" + TableId), {
    id: TableId,
    Color:data.Color,
    Category:data.Category,
    x:0,
    y:0,
    Status:true
  });
  console.log("success");
}


export function changeTablePos(TableId,x,y,color,category,status){
  console.log(TableId+" "+x,+" "+y+" "+color+" "+category+" "+status);
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/" + TableId), {
    id: TableId,
    Color:color,
    Category:category,
    x:x,
    y:y,
    Status:status
  });
  console.log("success");
}

export function deleteTables(id){
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/" + id), {
    id: null,
    Color:null,
    Category:null,
    x:null,
    y:null,
    Status:null
  });
}

export function clearTables(){
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/"), {
    id: null,
  });
}