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
import EditData from "../../../src/admin-components/admin.edit-beverage";
import styled from "@emotion/styled";
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Drinks.png";

export default function AdminBeverageData() {
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
  const id = router.query.BevID;
  const [beverageData, setBeverageData] = useState([]);
  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getBevData = () => {
    let temp = id;
    const db = getDatabase(app);
    const bevRef = query(
      ref(db, "beverages"),
      orderByChild("id"),
      equalTo(Number(temp ? temp : 0))
    );

    get(bevRef).then((snapshot) => {
      var beverages = [];

      snapshot.forEach((childSnapshot) => {
        beverages.push(childSnapshot.val());
      });
      setBeverageData(beverages);
    });
  };
  useEffect(() => {
    getBevData();
  });

  const goBack = () => {
    router.push("../admin.beverages");
  };
  const viewResume = (link) => {
    if (!link) {
      return;
    }
    window.open(link, "_blank");
  };

  return (
    <div className={styles.Data__Container}>
      {beverageData.map((data) => {
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
                    <h1>{`${data.BeverageName}`}</h1>
                    <Divider />
                    <p>
                      Details: <b>{data.Size + data.Details}</b>
                    </p>
                    <p>
                      Beverage ID: <b>{data.id}</b>
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
                    <p>
                      Stocks: <b>{data.Quantity}</b>
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
              beverageData={beverageData}
            />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  );
}

AdminBeverageData.getLayout = function getLayout(page) {
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
