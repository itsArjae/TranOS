import React, { useState } from "react";
import styles from "../../styles/css/admin-styles/components-css/tables.components.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { updateMenu } from "../../src/utility/admin-utils/menu.firebase";
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Menu.png";

const headers = [
  {
    id: 1,
    header: "Picture",
  },
  {
    id: 2,
    header: "Meal Name",
  },
  {
    id: 3,
    header: "Price",
  },
  {
    id: 4,
    header: "Status",
  },
  {
    id: 5,
    header: "Set as",
  },
];

export default function AdminTables(props) {
  

  const router = useRouter();
  const { menuData, id } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm === "") {
      return 4;
    } else {
      return menuData.length;
    }
  };
  const itemsPerPage = pageCountFixed();
  const pagesVisited = pageNumber * itemsPerPage;

  const DisplayItems = menuData
    .filter((val) => {
      if (searchTerm == "") {
        return val;
      } else if (
        val.MealName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Image_Box}>
            <img
              src={data.ImageUrl ? data.ImageUrl : DefaultPic}
              alt="Image"
              className={styles.Table__Image}
            />
            <div
              className={styles.overlay}
              onClick={() => {
                viewData(data.id);
              }}
            >
              <div className={styles.text}>Click to view</div>
            </div>
          </div>
          <div className={styles.Table__Data__Box}> {data.MealName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.Price).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}>
            {data.Status == true ? "Available" : "Not Available"}
          </div>
          <div className={styles.Table__Data__Box}>
            <button
              className={styles.Table__Data_Available_Btn}
              onClick={() => {
                getID(data.id, data.Status);
              }}
            >
              {data.Status == false ? "Available" : "Not Available"}
            </button>
          </div>
        </div>
      );
    });
  const pageCount = Math.ceil(menuData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const getID = (id, stat) => {
    updateMenu(id, stat);
  };

  const viewData = (id) => {
    router.push(
      {
        pathname: `../admin/meals/menu`,
        query: { MenuID: id },
      },
      "../admin/meals/menu"
    );
  };

  const Header = headers.map((heads) => {
    return (
      <div className={styles.Table__Heads_Data} key={heads.id}>
        {heads.header}
      </div>
    );
  });
  const viewLink = (link) => {
    window.open(link, "_blank");
  };

  const initialValues = {
    search: "",
  };

  const validationSchema = Yup.object().shape({
    search: Yup.string().min(3).required("Invalid"),
  });

  const onSubmit = (data, { resetForm }) => {
    console.log(data);
  };

  return (
    <div className={styles.Table__Container}>
      <div className={styles.Table__Search_Box}>
        <div className={styles.Table__Search_Form}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <input
              autoComplete="off"
              name="search"
              className={styles.Table_Search_Input}
              placeholder="Search Meal Name"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.Table__Box}>
        <div className={styles.Table__Head}>{Header}</div>
        <div className={styles.Table__Data_Container}>{DisplayItems}</div>
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
