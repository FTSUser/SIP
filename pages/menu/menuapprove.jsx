import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";
import Styles from "../admin/admin.module.scss";
import { alertService, menuService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import AddMenu from "./addMenu/addmenu";
import router, { useRouter } from "next/router";
import Head from "next/head";
import Tooltip from "components/custom/tooltip";

const DataTable = () => {
  const [comments, setComments] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [id, setId] = useState();
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin;
  const [localData, setRole] = useState(role);
  const ITEMS_PER_PAGE = 10;
  const { query } = useRouter();

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "Name", field: "name", sortable: true },
    { name: "Price", field: "price", sortable: true },
    { name: "Action", field: "Action", sortable: false },
  ];

  useEffect(() => {
    if (localData?._id) {
      getData();
    }
  }, []);

  const getData = async () => {
    showLoader();

    const data = {
      id: localData?._id,
    };
    await menuService.getAllSubMenuByID(data.id).then((response) => {
      hideLoader();

      setComments(response.payload.menus);
    });
  };

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments?.filter((comment) =>
        comment.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(
      computedComments && computedComments?.length
        ? computedComments?.length
        : 0
    );

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedComments = computedComments?.sort(
        (a, b) => reversed * a[sorting.field].toString().localeCompare(b[sorting.field].toString())
      );
    }

    //Current Page slice
    return computedComments?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [comments, currentPage, search, sorting]);

  return (
    <>
      <Head>
        <title>SIP Interview - Menu</title>
        <meta name="description" content="Meta description for the Menu Page" />
      </Head>

      <div className="row w-100 p-5 heightAuto">
        <div className="col mb-3 col-12 text-center">
          <div className="row py-4">
            <div className="col-md-3">
              <div>
                <h2>List of Menus</h2>
              </div>
            </div>
            <div className="col-md-9 d-flex flex-row-reverse">
              {localData?.role?.roleName == "superadmin" && (
                <button
                  className={classNames(Styles.mainButton, "ml-3")}
                  onClick={() => toggleContactFormVisiblity()}
                >
                  Add Menu
                </button>
              )}

              <Search
                onSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped ">
              <TBLHeader
                headers={headers}
                onSorting={(field, order) => setSorting({ field, order })}
              />
              <tbody>
                {commentsData?.map((comment, key) => (
                  <tr key={key}>
                    <th scope="row">{key + 1}</th>

                    {comment.name.length <= 20 ? (
                      <td>{comment.name}</td>
                    ) : (
                      <Tooltip content={comment.name} direction="bottom">
                        <td>
                          <div className="elice">{comment.name}</div>
                        </td>
                      </Tooltip>
                    )}
                   
                      <td>{comment.price}</td>
                   

                    <td>
                      <div>
                        {localData?.role?.roleName === "admin" && (
                          <>
                            <div
                              className="btn btn-primary"
                              onClick={() =>
                                router.push(
                                  `/menu/subMenu/submenus?id=${comment?._id}`
                                )
                              }
                            >
                              Sub Menu
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!commentsData?.length ? <div>No Menu Data Found</div> : <div></div>}
        </div>
      </div>
      {loader}
    </>
  );
};

export default DataTable;
