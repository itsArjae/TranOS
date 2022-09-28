import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { app, storage } from "../firebase";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sref,
  getStorage,
} from "firebase/storage";
import { useState } from "react";

var ImageUrl;
var ResumeUrl;

export function saveMiddleware2(data, bevId, bevSize, pictureFile) {
  uploadBeveragesPicture(data, bevId, bevSize, pictureFile);
}

export function updateBeverageStatus(id, stat) {
  const db = getDatabase(app);
  if (stat == true) {
    update(ref(db, "beverages/" + id), {
      Status: false,
    });
  } else if (stat == false) {
    update(ref(db, "beverages/" + id), {
      Status: true,
    });
  }
}

export function saveBeveragesData(data, bevId, bevSize, pictureUrl) {
  console.log("renderData");

  const db = getDatabase(app);
  set(ref(db, "beverages/" + bevId), {
    id: bevId,
    BeverageName: data.BeverageName,
    Price: data.Price,
    Quantity: data.Quantity,
    Size: data.Size,
    Details: bevSize,
    Status: true,
    ImageUrl: pictureUrl,
  });
  console.log("success");
}

function uploadBeveragesPicture(data, bevId, bevSize, pictureFile) {
  if (!pictureFile) {
    return saveBeveragesData(data, bevId, bevSize, null);
  }

  const storageRef = sref(storage, "BeveragesFiles/" + pictureFile.name);
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveBeveragesData(data, bevId, bevSize, pictureUrl);
      });
    }
  );
}

export function updateBeverage(
  id,
  bevname,
  bevqty,
  bevprice,
  bevsize,
  bevdetail
) {
  const db = getDatabase(app);

  update(ref(db, "beverages/" + id), {
    BeverageName: bevname,
    Quantity: bevqty,
    Price: bevprice,
    Size: bevsize,
    Details: bevdetail,
  });
}
