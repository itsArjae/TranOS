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

export function saveMiddleware2(
  data,
  rawGoodsId,
  date,
  time,
  weight,
  pictureFile
) {
  uploadRawGoodsPicture(data, rawGoodsId, date, time, weight, pictureFile);
}

export function saveRawGoodsData(
  data,
  rawGoodsId,
  date,
  time,
  weight,
  pictureUrl
) {
  console.log("renderData");

  const db = getDatabase(app);
  set(ref(db, "rawGoods/" + rawGoodsId), {
    id: rawGoodsId,
    rawGoodsName: data.rawGoodsName,
    Details: data.Details,
    Unit: weight,
    Date: date,
    UpdatedDate: date,
    Time: time,
    ImageUrl: pictureUrl,
  });
  console.log("success");
}

function uploadRawGoodsPicture(
  data,
  rawGoodsId,
  date,
  time,
  weight,
  pictureFile
) {
  if (!pictureFile) {
    return saveRawGoodsData(data, rawGoodsId, date, time, weight, null);
  }

  const storageRef = sref(storage, "RawGoodsFiles/" + pictureFile.name);
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveRawGoodsData(data, rawGoodsId, date, time, weight, pictureUrl);
      });
    }
  );
}

export function updateRawGoods(id, rawgoodsname, detail, unit, date, time) {
  const db = getDatabase(app);

  update(ref(db, "rawGoods/" + id), {
    rawGoodsName: rawgoodsname,
    Details: detail,
    Unit: unit,
    UpdatedDate: date,
    Time: time,
  });
}
