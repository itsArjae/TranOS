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

export function saveMiddleware2(data, menuId, pictureFile) {
  uploadMenuPicture(data, menuId, pictureFile);
}

export function updateMenu(id, stat) {
  const db = getDatabase(app);
  if (stat == true) {
    update(ref(db, "meals/" + id), {
      Status: false,
    });
  } else if (stat == false) {
    update(ref(db, "meals/" + id), {
      Status: true,
    });
  }
}

export function saveMenuData(data, menuId, pictureUrl) {
  console.log("renderData");

  const db = getDatabase(app);
  set(ref(db, "meals/" + menuId), {
    id: menuId,
    MealName: data.MealName,
    Price: data.Price,
    Status: true,
    ImageUrl: pictureUrl,
  });
  console.log("success");
}

function uploadMenuPicture(data, menuId, pictureFile) {
  if (!pictureFile) {
    return saveMenuData(data, menuId, null);
  }

  const storageRef = sref(storage, "MenuFiles/" + pictureFile.name);
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveMenuData(data, menuId, pictureUrl);
      });
    }
  );
}

export function updateMeal(id, mealname, mealprice) {
  const db = getDatabase(app);

  update(ref(db, "meals/" + id), {
    MealName: mealname,
    Price: mealprice,
  });
}
