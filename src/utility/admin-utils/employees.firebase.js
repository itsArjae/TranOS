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

export function saveMiddleware(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen
) {
  uploadEmployeeResume(
    data,
    empId,
    resumeFile,
    pictureFile,
    Password,
    Username,
    defaultPass,
    pos,
    gen
  );
}
export function saveMiddleware2(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen,
  resumeUrl
) {
  uploadEmployeePicture(
    data,
    empId,
    resumeFile,
    pictureFile,
    Password,
    Username,
    defaultPass,
    pos,
    gen,
    resumeUrl
  );
}

export function saveEmployeesData(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen,
  resumeUrl,
  pictureUrl
) {
  console.log("renderData");

  const db = getDatabase(app);
  set(ref(db, "employees/" + empId), {
    id: empId,
    Surname: data.Surname,
    FirstName: data.FirstName,
    MiddleName: data.MiddleName,
    Age: data.Age,
    Status: true,
    Email: data.Email,
    Gender: gen,
    Position: pos,
    Address: data.Address,
    ImageUrl: pictureUrl,
    ResumeUrl: resumeUrl,
    Password: Password,
    Username: Username,
    Number: data.Number,
    DefaultPass: defaultPass,
  });
  console.log("success");
}
function uploadEmployeeResume(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen
) {
  if (!resumeFile) {
    return saveMiddleware2(
      data,
      empId,
      resumeFile,
      pictureFile,
      Password,
      Username,
      defaultPass,
      pos,
      gen,
      null
    );
  }

  const storageRef = sref(
    storage,
    "EmployeesFiles/" +
      `${data.Surname}${data.FirstName}/Resume/` +
      resumeFile.name
  );
  const uploadTask = uploadBytesResumable(storageRef, resumeFile);
  console.log("resume upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((resumeUrl) => {
        saveMiddleware2(
          data,
          empId,
          resumeFile,
          pictureFile,
          Password,
          Username,
          defaultPass,
          pos,
          gen,
          resumeUrl
        );
      });
    }
  );
}

function uploadEmployeePicture(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen,
  resumeUrl
) {
  if (!pictureFile) {
    return saveEmployeesData(
      data,
      empId,
      resumeFile,
      pictureFile,
      Password,
      Username,
      defaultPass,
      pos,
      gen,
      resumeUrl,
      null
    );
  }

  const storageRef = sref(
    storage,
    "EmployeesFiles/" +
      `${data.Surname}${data.FirstName}/Pictures/` +
      pictureFile.name
  );
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveEmployeesData(
          data,
          empId,
          resumeFile,
          pictureFile,
          Password,
          Username,
          defaultPass,
          pos,
          gen,
          resumeUrl,
          pictureUrl
        );
      });
    }
  );
}

export function statusChange(empId, stat) {
  const db = getDatabase(app);
  update(ref(db, "employees/" + empId), {
    Status: stat,
  });
  console.log("success" + stat);
}

export function updateEmployee(
  id,
  lname,
  fname,
  mname,
  empAge,
  empEmail,
  empContact,
  empAdd
) {
  const db = getDatabase(app);

  update(ref(db, "employees/" + id), {
    Surname: lname,
    FirstName: fname,
    MiddleName: mname,
    Age: empAge,
    Email: empEmail,
    Number: empContact,
    Address: empAdd,
  });
}
