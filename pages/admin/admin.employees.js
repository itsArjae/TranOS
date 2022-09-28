import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.employees.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { app } from "../../src/utility/firebase";
import * as Yup from "yup";
import Image from "next/image";
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
import AdminTables from "../../src/admin-components/admin.tables";
import { saveMiddleware } from "../../src/utility/admin-utils/employees.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";

export default function AdminEmployees() {
  const router = useRouter();
  var tableUpdate;

  useEffect(() => {
    tableUpdate = setInterval(() => {
      try {
        const access = { accessToken: localStorage.getItem("accessToken") };
        if (!access.accessToken) {
          console.log("lost login emp");
          router.push("../sign-in");
        }
      } catch (err) {}
    }, 5000);
    return () => clearInterval(tableUpdate);
  }, []);

  const [isLoading, setLoading] = useState(false);
  const [empData, setEmpData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const [resItem, setResItem] = useState(); // for resume
  const imageRef = useRef(null);
  const resumeRef = useRef(null);
  const [pos, setPos] = useState("Cashier");
  const [gen, setGen] = useState("Male");
  const [update, forceUpdate] = useState(0);
  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };
  //backend
  const onSubmit = (data, { resetForm }) => {
    setLoading(null);
    try {
      let password = null;
      let username = null;
      let dpassword = null;
      if (pos === "Cashier") {
        password = `TCashier${empData.length}`;
        username = `TCashier${empData.length}`;
        dpassword = `TCashier${empData.length}`;
      }
      if (pos === "Admin") {
        password = `TAdmin${empData.length}`;
        username = `TAdmin${empData.length}`;
        dpassword = `TAdmin${empData.length}`;
      }
      if (pos === "Chef") {
        password = null;
        username = null;
        dpassword = null;
      }
      if (pos === "Cashier") {
        password = `TCashier${empData.length}`;
        username = `TCashier${empData.length}`;
        dpassword = `TCashier${empData.length}`;
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      saveMiddleware(
        data,
        empData.length,
        resItem,
        picItem,
        hashedPassword,
        username,
        dpassword,
        pos,
        gen
      );
      resetForm();
      imageRef.current.value = "";
      resumeRef.current.value = "";
      setPos("Cashier");
      setGen("Male");
      setPicItem(null);
      setResItem(null);
      const { id, Surname, FirstName, MiddleName, Image } = data;
      const addData = {
        id: empData.length,
        Surname,
        FirstName,
        MiddleName,
        Image,
      };
      setEmpData([...empData, addData]);
    } catch (err) {}
  };

  const id = () => {
    if (empData.length === 0) {
      return 1;
    } else {
      return empData.length + 1;
    }
  };

  const getEmpData = (field, fieldData) => {
    try {
      const db = getDatabase(app);
      const empRef = query(ref(db, "employees"), orderByChild("id"));
      // const empRef = query(ref(db, "employees"), orderByChild(`${field}`), equalTo(`${fieldData}`));
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
  }, [empData]);
  //

  var dt = new Date();
  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let monthFixed = () => {
    if (month.toString.length === 1) {
      return `0${month}`;
    } else {
      return month;
    }
  };
  let year = dt.getFullYear();
  let date = monthFixed() + `/${day}/${year}`;

  const initialValues = {
    Surname: "",
    FirstName: "",
    MiddleName: "",
    Age: "",
    Position: "Cashier",
    Gender: "Male",
    Email: "",
    Active: true,
    Address: "",
    Image: "",
    Resume: "",
    id: id(),
    Number: "",
  };

  const validationSchema = Yup.object().shape({
    Surname: Yup.string().required("Invalid"),
    FirstName: Yup.string().required("Invalid"),
    MiddleName: Yup.string().required("Invalid"),
    Age: Yup.number().required("Invalid"),
    Email: Yup.string().required("Invalid"),
    Address: Yup.string().required("Invalid"),
    Number: Yup.string().min(11).max(11).required("Invalid"),
  });

  //
  const timerRef = useRef(null);

  const onIdle = () => {
    console.log("onIdle");
  };

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.Employees__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.Employees__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD EMPLOYEES</div>
                <div className={styles.Header__Top2}>
                  {" "}
                  <Image
                    src="/assets/admin-assets/svg/user.icon.svg"
                    height={30}
                    width={30}
                    alt="User Icon"
                  />{" "}
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Surname"
                    placeholder="Surname"
                  />
                  <ErrorMessage name="Surname" />
                </div>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="FirstName"
                    placeholder="FirstName"
                  />
                  <ErrorMessage name="FirstName" />
                </div>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="MiddleName"
                    placeholder="MiddleName"
                  />
                  <ErrorMessage name="MiddleName" />
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Age"
                    placeholder="Age"
                    type="number"
                  />
                  <ErrorMessage name="Age" />
                </div>
                <div className={styles.Form__Input_Box}>
                  <select
                    name="Gender"
                    onChange={(event) => {
                      setGen(event.target.value);
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className={styles.Form__Input_Box}>
                  <select
                    name="Position"
                    onChange={(event) => {
                      setPos(event.target.value);
                    }}
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Chef">Chef</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input_Email}
                    name="Email"
                    placeholder="Email"
                    type="email"
                  />
                  <Field
                    className={styles.Form__Input_Email}
                    name="Number"
                    placeholder="Contact No.(ex. 09983511675)"
                  />
                  <ErrorMessage name="Number" />
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input_Email}
                    name="Address"
                    placeholder="Address"
                    type="Address"
                  />
                  <ErrorMessage name="Address" />
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box_File}>
                  <label htmlFor="imageFile">Image: </label>
                  <input
                    className={styles.Form__Input_File}
                    name="Image"
                    type="file"
                    id="imageFile"
                    onChange={imageHandler}
                    ref={imageRef}
                  />
                </div>
                <div className={styles.Form__Input_Box_File}>
                  <label htmlFor="imageFile">Resume: </label>
                  <input
                    className={styles.Form__Input_File}
                    name="Resume"
                    type="file"
                    id="resumeFile"
                    onChange={resumeHandler}
                    ref={resumeRef}
                  />
                </div>
              </div>
              <div className={styles.Form__Btn_Container}>
                <button
                  className={styles.Form__Clear_Btn}
                  type="button"
                  onClick={() => {
                    console.log(initialValues);
                  }}
                >
                  Clear
                </button>
                <button type="submit" className={styles.Form__Submit_Btn}>
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div className={styles.Table__Container}>
          <AdminTables empData={empData} />
        </div>
      </div>
    </IdleTimerContainer>
  ) : (
    <OuterBox>
      <InnerBox>
        <LoadingScreen />
      </InnerBox>
    </OuterBox>
  );
}
const OuterBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  backdrop-filter: blur(10px);
  display: flex;
  alignitems: center;
  justifycontent: center;
`;

const InnerBox = styled.div`
  margin: auto;
`;

AdminEmployees.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
