import React, { useEffect, useState } from "react";
import styles from "../styles/css/login-pages/login.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { app } from "../src/utility/firebase";
import { useRouter } from "next/router";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import bcrypt from "bcryptjs";
import { async } from "@firebase/util";
import { sign } from "jsonwebtoken";

export default function SignIn() {
  const router = useRouter();
  const [pos, setPos] = useState("Admin");

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required(),
    username: Yup.string().required(),
  });

  const [empData, setEmpData] = useState([]);
  const getEmpData = (field, fieldData) => {
    try {
      const db = getDatabase(app);
      const empRef = query(ref(db, "employees"), orderByChild("id"));

      get(empRef).then((snapshot) => {
        var employees = [];

        snapshot.forEach((childSnapshot) => {
          employees.push(childSnapshot.val());
        });
        setEmpData(employees);
      });
    } catch (err) {}
    setLoading(true);
  };

  useEffect(() => {
    try {
      getEmpData("Surname", "");
    } catch (err) {}
  }, []);

  const onSubmit = (data, resetForm) => {
    let user;
    empData.map((val) => {
      if (data.username == val.Username) {
        user = {
          password: val.Password,
          id: val.id,
          username: val.Username,
          position: val.Position,
        };
      }
    });
    console.log(user);

    if (!user.password) {
      return console.log("Wrong username/password");
    }

    bcrypt.compare(data.password, user.password).then(async (match) => {
      console.log(match);
      if (match) {
        const accessToken = sign(
          { token: accessToken, id: user.id, ttl: Date.now() + 3600 * 1000 },
          "userAccess",
          { expiresIn: "1h" }
        );

        localStorage.setItem("accessToken", accessToken);
        if (pos == "Admin") {
          router.push("/admin/Admin.Dashboard");
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.Login__Box}>
        <div className={styles.Login__Form}>
          <h1>Log In</h1>
          <select
            name="position"
            onChange={(event) => {
              setPos(event.target.value);
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
            <option value="Chef">Chef</option>
          </select>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form autoComplete="off" className={styles.form}>
              <div className={styles.input__box}>
                <Field
                  name="username"
                  placeholder="username"
                  className={styles.input}
                />
                <ErrorMessage component="span" name="username" />
              </div>
              <div className={styles.input__box}>
                <Field
                  name="password"
                  type="password"
                  placeholder="password"
                  className={styles.input}
                />
                <ErrorMessage component="span" name="password" />
              </div>
              <button className={styles.submit} type="submit">
                LOGIN
              </button>
            </Form>
          </Formik>
        </div>
        <div className={styles.logo}>
          <img src="/assets/admin-assets/pictures/logo.png" alt="logo" />
          <div>
            <h4>
              Good Times, Chill Sounds, <br></br>
              Big Waves, GooZy Friends
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
