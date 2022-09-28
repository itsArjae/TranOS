import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.beverages.module.css";
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
import AdminTablesBeverages from "../../src/admin-components/admin.tables.beverages";
import { saveMiddleware2 } from "../../src/utility/admin-utils/beverages.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";

export default function AdminBeverages() {
  const router = useRouter();
  useEffect(() => {
    const tableUpdate = setInterval(() => {
      const access = { accessToken: localStorage.getItem("accessToken") };
      if (!access.accessToken) {
        console.log("lost login");
        router.push("../sign-in");
      }
    }, 1000);
  }, []);

  const [isLoading, setLoading] = useState(false);

  const [beverageData, setBeverageData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [update, forceUpdate] = useState(0);
  const [stat, setStatus] = useState("Available");
  const [bevSize, setSize] = useState("N/A");

  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };
  //backend
  const onSubmit = (data, { resetForm }) => {
    setLoading(null);
    saveMiddleware2(data, beverageData.length, bevSize, picItem);
    resetForm();
    imageRef.current.value = "";
    setPicItem(null);
    const { id, BeverageName, Price, Quantity, Size, Image } = data;
    const addData = {
      id: beverageData.length,
      BeverageName,
      Price,
      Quantity,
      Size,
      Image,
    };
    setBeverageData([...beverageData, addData]);
  };

  const id = () => {
    if (beverageData.length === 0) {
      return 1;
    } else {
      return beverageData.length + 1;
    }
  };

  const getBeverageData = (field, fieldData) => {
    try {
      const db = getDatabase(app);
      const beverageRef = query(ref(db, "beverages"), orderByChild(`${field}`));
      // const empRef = query(ref(db, "employees"), orderByChild(`${field}`), equalTo(`${fieldData}`));
      get(beverageRef).then((snapshot) => {
        var beverage = [];

        snapshot.forEach((childSnapshot) => {
          beverage.push(childSnapshot.val());
        });
        console.log(beverage);
        setBeverageData(beverage);
      });
    } catch (err) {}
    setLoading(true);
  };

  useEffect(() => {
    try {
      getBeverageData("id", "");
    } catch (err) {}
  }, [beverageData]);
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
    BeverageName: "",
    Price: "",
    Quantity: "",
    Size: "",
    Status: "",
    Image: "",
    id: id(),
  };

  const validationSchema = Yup.object().shape({
    BeverageName: Yup.string().required("Incomplete Details!"),
    Price: Yup.string().required("Incomplete Details!"),
    Quantity: Yup.string().required("Incomplete Details!"),
  });

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.Beverages__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.Beverages__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD BEVERAGES</div>
                <div className={styles.Header__Top2}>
                  <Image
                    src="/assets/admin-assets/svg/beverage.logo.svg"
                    height={30}
                    width={30}
                    alt="beverages Icon"
                  />
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="BeverageName"
                    placeholder=" Beverage Name"
                  />
                  <ErrorMessage name="BeverageName" />
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Quantity"
                    placeholder="Quantity"
                    type="number"
                  />
                  <ErrorMessage name="Quantity" />
                </div>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Price"
                    placeholder="Price"
                    type="number"
                  />
                  <ErrorMessage name="Price" />
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Size"
                    placeholder="Size"
                  />
                  <ErrorMessage name="Size" />
                </div>

                <div className={styles.Form__Input_Box}>
                  <select
                    name="Weight"
                    id="Weight"
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option value="N/A">None</option>
                    <option value="ml">millimeter</option>
                    <option value="L">liter</option>
                  </select>
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
          <AdminTablesBeverages beverageData={beverageData} />
        </div>
      </div>
    </IdleTimerContainer>
  ) : (
    <OuterBox>
      {" "}
      <InnerBox>
        <LoadingScreen />
      </InnerBox>{" "}
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

AdminBeverages.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
