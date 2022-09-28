<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/cashier-styles/cashier.managetables.module.css";
import { app } from "../../src/utility/firebase";
import Draggable from "react-draggable";
import { style } from "@mui/system";
import {
  AddTables,
  clearTables,
} from "../../src/utility/admin-utils/manage-table.firebase";
import AdminLayout from "../../src/admin-components/adminLayout";
import {
  getDatabase,
  ref,
  get,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import CashierTableComponent from "../../src/cashier-components/cashier-table.component";
import styled from "@emotion/styled";
import MessageBox from "../../src/misc/messagebox";

export default function CashierManageTableredo() {
  useEffect(() => {
    const tableUpdate = setInterval(() => {
      const access = { accessToken: localStorage.getItem("accessToken") };
      if (!access.accessToken) {
        console.log("lost login");
        router.push("../sign-in");
      }
    }, 1000);
  }, []);

  const [hasloaded, setHasLoaded] = useState(false);
  const [tableRecord, setTableRecord] = useState([]);
  const nodeRef = useRef(null);
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const [initPos, setInitPos] = useState([]);
  const [messageVisible, setMessageVisible] = useState(false);
  const [message,setMessage] = useState('');
  const handleMessageVisible = (temp,message) => {
    setMessage(message);
    setMessageVisible(temp);
  }

  function getTableData() {
    // setRecord(null);

    const db = getDatabase(app);
    const empRef = query(ref(db, "Dine/Tables"), orderByChild("id"));

    get(empRef).then((snapshot) => {
      var employees = [];

      snapshot.forEach((childSnapshot) => {
        employees.push(childSnapshot.val());
      });
      setTableRecord(employees);
    });
  }

  useEffect(() => {
    getTableData();
    setHasLoaded(true);
  }, [tableRecord]);

  const handleAddTable = () => {
    console.log(tableRecord.length);
    let id = tableRecord.length;
    if (tableRecord.length === 0) {
      //   id=1;
      const data = {
        id: 0,
        Category: "Door",
        Color: "blue",
        x: 0,
        y: 0,
        Status: true,
      };
      AddTables(id, data);
      console.log(tableRecord.length);
      window.location.reload(false);
      return;
    }
    let temp = 0,
      found = false;
    if (tableRecord.length !== 0) {
      tableRecord.map((table) => {
        console.log(table.id + " temp-" + temp);
        if (table.id !== temp && found === false) {
          console.log("found");
          id = temp;
          found = true;
        }
        temp++;
      });
      if (id < temp) {
        const data = {
          id: id,
          Category: "Table",
          Color: "green",
          x: 0,
          y: 0,
          Status: true,
        };
        AddTables(id, data);
        window.location.reload(false);
        return;
      }
    }
    const data = {
      id: id,
      Category: "Table",
      Color: "green",
      x: 0,
      y: 0,
      Status: true,
    };
    AddTables(id, data);
    console.log(tableRecord.length);
  };

  const handleAddHut = () => {
    console.log(tableRecord.length);
    let id = tableRecord.length;
    if (tableRecord.length === 0) {
      //   id=1;
      const data = {
        id: 0,
        Category: "Door",
        Color: "blue",
        x: 0,
        y: 0,
        Status: true,
      };
      AddTables(id, data);
      console.log(tableRecord.length);
      window.location.reload(false);
      return;
    }
    let temp = 0,
      found = false;
    if (tableRecord.length !== 0) {
      tableRecord.map((table) => {
        console.log(table.id + " temp-" + temp);
        if (table.id !== temp && found === false) {
          console.log("found");
          id = temp;
          found = true;
        }
        temp++;
      });
      if (id < temp) {
        const data = {
          id: id,
          Category: "Table",
          Color: "green",
          x: 0,
          y: 0,
          Status: true,
        };
        AddTables(id, data);
        window.location.reload(false);
        return;
      }
    }
    const data = {
      id: id,
      Category: "Hut",
      Color: "green",
      x: 0,
      y: 0,
      Status: true,
    };
    AddTables(id, data);
    console.log(tableRecord.length);
  };

  const resetTables = () => {
    clearTables();
  };

  return hasloaded ? (
    <div className={styles.Container}>
      <div className={styles.Table__Container} ref={containerRef}>
        <div className={styles.Table__ButtonBox}>
        </div>
        {tableRecord?.map((table) => {
          return (
            <>
            
              <CashierTableComponent
                table={table}
                handleMessageVisible={handleMessageVisible}
                coordinates={{
                  x: containerRef.current.offsetLeft,
                  y: containerRef.current.offsetTop,
                }}
              />
            </>
          );
        })}
      </div>
      {
         messageVisible == true && (
          <OuterBox>
          <InnerBox>
           <MessageBox message={message} setClose={handleMessageVisible} />
          </InnerBox>
        </OuterBox>
        )
      }
    </div>
  ) : null;
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
=======
import React from "react";
import CashierLayout from "../../src/cashier-components/cashierLayout";

export default function CashierTables() {
  return <div>cashier to</div>;
}
CashierTables.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};
>>>>>>> 2dfe03377d8f58cf17b93a5b44a86b4d0b8d1687
