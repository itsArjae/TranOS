import React from "react";
import AdminLayout from "../../../src/admin-components/adminLayout";
import styles from "../../../styles/css/admin-styles/components-css/beverages.data.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { app } from "../../../src/utility/firebase";
import {
  getDatabase,
  ref,
  get,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { Divider } from "@mui/material";
import EditData from "../../../src/admin-components/admin.edit-meal";
import styled from "@emotion/styled";
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Menu.png";

export default function AdminMenuData() {
  useEffect(() => {
    const tableUpdate = setInterval(() => {
      const access = { accessToken: localStorage.getItem("accessToken") };
      if (!access.accessToken) {
        console.log("lost login");
        router.push("../../sign-in");
      }
    }, 1000);
  }, []);

  const router = useRouter();
  const id = router.query.MenuID;
  const [mealsData, setMealData] = useState([]);
  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getMealData = () => {
    let temp = id;
    const db = getDatabase(app);
    const mealRef = query(
      ref(db, "meals"),
      orderByChild("id"),
      equalTo(Number(temp ? temp : 0))
    );

    get(mealRef).then((snapshot) => {
      var meals = [];

      snapshot.forEach((childSnapshot) => {
        meals.push(childSnapshot.val());
      });
      setMealData(meals);
    });
  };
  useEffect(() => {
    getMealData();
  });

  const goBack = () => {
    router.push("../admin.menu");
  };
  const viewResume = (link) => {
    if (!link) {
      return;
    }
    window.open(link, "_blank");
  };

  return (
    <div className={styles.Data__Container}>
      {mealsData.map((data) => {
        return (
          <div className={styles.Data__Box} key={data.id}>
            <div className={styles.Data__Box1}>
              <div className={styles.Btn__Box}>
                <button className={styles.Exit__Button} onClick={goBack}>
                  ❌
                </button>
              </div>
              <div className={styles.Data__First}>
                <div className={styles.Data__Picture}>
                  <img src={data.ImageUrl ? data.ImageUrl : DefaultPic} />
                </div>
                <div>
                  <button
                    className={styles.Edit__Btn}
                    onClick={() => {
                      setVisible(!visible);
                    }}
                  >
                    Edit
                  </button>
                  &nbsp;
                  <button className={styles.Delete__Btn}>Delete</button>
                </div>
              </div>
            </div>
            <div className={styles.Data__Box2}>
              <div className={styles.Box2__Container}>
                <div className={styles.Data__Box2_Info1}>
                  <div>
                    <h1>{`${data.MealName}`}</h1>
                    <Divider />
                    <p>
                      Meal ID: <b>{data.id}</b>
                    </p>
                    <p>
                      Status:&nbsp;
                      <b>
                        {data.Status == true ? "Available" : "Not Available"}
                      </b>
                    </p>
                    <p>
                      Price: <b>{Number(data.Price).toFixed(2)}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {visible === true && (
        <OuterBox>
          <InnerBox>
            <EditData
              setEditDataVisible={setEditDataVisible}
              id={id}
              mealsData={mealsData}
            />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  );
}

AdminMenuData.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

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
