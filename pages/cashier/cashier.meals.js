import React from "react";
import CashierLayout from "../../src/cashier-components/cashierLayout";
import styles from "../../styles/css/cashier-styles/cashier.menu.module.css";
import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import ReactPaginate from "react-paginate";
import { getDatabase, ref, get, query, orderByChild } from "firebase/database";
import { app } from "../../src/utility/firebase";
const DefaultPicMenu =
  "/assets/cashier-assets/pictures/Cashier-Def-Pic-Menu.png";

export default function CashierMenu() {
  const [menuData, setMenuData] = useState([]);

  const getMenuData = (field, fieldData) => {
    try {
      const db = getDatabase(app);
      const menuRef = query(ref(db, "meals"), orderByChild(`${field}`));
      // const empRef = query(ref(db, "employees"), orderByChild(`${field}`), equalTo(`${fieldData}`));
      get(menuRef).then((snapshot) => {
        var meals = [];

        snapshot.forEach((childSnapshot) => {
          meals.push(childSnapshot.val());
        });
        setMenuData(meals);
      });
    } catch (err) {}
    setLoading(true);
  };

  useEffect(() => {
    try {
      getMenuData("id", "");
    } catch (err) {}
  }, [menuData]);

  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 6;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(menuData.length / itemsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const DisplayItems = menuData
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((meals) => {
      return (
        <div key={meals.id} className={styles.Data__Container}>
          <div className={styles.Data_Image}>
            <img
              src={meals.ImageUrl ? meals.ImageUrl : DefaultPicMenu}
              alt={meals.MealName}
              height={120}
            />
          </div>
          <div className={styles.Data_Info}>
            <h2>{meals.MealName}</h2>
            <p>Meal No. {meals.id}</p>
            <p>{Number(meals.Price).toFixed(2)}</p>
          </div>
        </div>
      );
    });

  return (
    <div className={styles.Cashier__Container}>
      <div className={styles.Cashier__Header}>
        <img
          src="/assets/cashier-assets/svg/cashier.menu.icon.svg"
          width={50}
          height={50}
          alt="Menu Icon"
        />
        <p className={styles.Cashier_Header_Text}>MEALS</p>
      </div>

      <Divider />
      <div className={styles.Cashier__Tab__Container}>
        <div className={styles.Container}> {DisplayItems}</div>
      </div>

      <div>
        <ReactPaginate
          nextLabel={"Next"}
          previousLabel={"Prev"}
          pageCount={pageCount}
          onPageChange={changePage}
          pageRangeDisplayed={5}
          containerClassName={styles.Pagination__Container}
          previousLinkClassName={styles.Pagination__Prev}
          nextLinkClassName={styles.Pagination__Next}
          disabledClassName={styles.paginationDisabled}
          activeClassName={styles.paginationActive}
        />
      </div>
    </div>
  );
}
CashierMenu.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};
