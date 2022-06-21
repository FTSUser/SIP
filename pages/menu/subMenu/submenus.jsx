import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";
import Styles from "../menu.module.scss";
import { alertService, menuService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import router, { useRouter } from "next/router";
import AddSubMenu from "./addSubMenu/addSubMenu";
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
    { name: "Action", field: "Action", sortable: false },
  ];
  const [contactFormVisiblity, setContactFormVisiblity] = useState(false);

  const toggleContactFormVisiblity = (id) => {
    if (id) {
      setId(id);
    } else {
      setId();
    }
    setContactFormVisiblity((visiblity) => !visiblity);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteAdmin = (id) => {
    if (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this sub menu?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          menuService.deleteSubMenu(id?._id).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Delete!", "Your sub menu is deleted.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your sub menu is safe", "error");
        }
      });
    }
  };

  const getData = async () => {
    showLoader();
    const data={
        id:localData._id,
        menuid:query.id
    }
    await menuService.getAllSubMenuApprove(data).then((response) => {
      hideLoader();
      response.payload.Menu?.map((e, index) => {
        e.index = index + 1;
        return e;
      });
      setComments(response.payload.Menu);
    });
  };
  useEffect(() => {
    getData();
    // getApproveMenu();
  }, []);
  const [menuApprove, setmenuApprove] = useState([]);
  const getApproveMenu = async () => {
    showLoader();
    await menuService.getAllSubMenuByID(localData._id).then((response) => {
      setmenuApprove(response.payload.Menu);
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
        (a, b) =>
          reversed *
          a[sorting.field].toString().localeCompare(b[sorting.field].toString())
      );
    }

    //Current Page slice
    return computedComments?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [comments, currentPage, search, sorting]);
  const [checked2, setChecked2] = useState([]);
  const handleClick = (e, comment) => {
    if (query.plan) {
      if (!e.target.checked) {
        onChecklist(e, comment);
      } else {
        if (query.plan === "1") {
          onCheckPlan(e, comment, 1);
        } else if (query.plan === "2") {
          onCheckPlan(e, comment, 2);
        } else if (query.plan === "3") {
          onCheckPlan(e, comment, 3);
        }
      }
    } else {
      onChecklist(e, comment);
    }
  };

  const onCheckPlan = (e, comment, plan) => {
    if (checked2.length === Number(plan)) {
      alertService.error(`You can't select more than ${plan} submenu!`);
      return false;
    } else {
      onChecklist(e, comment);
    }
  };

  const onChecklist = (e, comment) => {
    let list = [...checked2];
    let Index = list.findIndex((x) => x._id == e.target.value);
    if (list.length > 0) {
      if (Index == -1) {
        list.push({ isChecked: e.target.checked, _id: e.target.value });
      } else {
        if (!e.target.checked) {
          list.splice(Index, 1);
        } else {
          list[Index].isChecked = true;
        }
      }
    } else {
      list.push({ isChecked: e.target.checked, _id: e.target.value });
    }
    setChecked2(list);
  };

  function purchasesPlan(data) {
    if (checked2?.length == 0) {
      alertService.error("Please select menu");
    } else {
      let a = checked2.map((item) => {
        return item._id;
      });
      router.push({
        pathname: "/payment/model",
        query: { data: a, price: data, plan: query.plan },
      });
    }
  }

  return (
    <>
      <div className=" w-100 p-5 heightAuto">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="backButton"
                onClick={() => router.back()}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className="pl-3">Back</div>
            </div>
          </div>
          <div className="col mb-3 col-12 text-center">
            <div className="row py-4">
              <div className="col-md-3">
                <div>
                  <h2>List of Sub Menus </h2>
                </div>
              </div>
              <div className="col-md-9 d-flex flex-row-reverse">
                {localData?.role?.roleName === "superadmin" && (
                  <>
                    <button
                      className={classNames(Styles.mainButton, "ml-3")}
                      onClick={() => toggleContactFormVisiblity()}
                    >
                      Add Sub Menu
                    </button>
                  </>
                )}
                <Search
                  onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <table className="table table-striped ">
              <TBLHeader
                headers={headers}
                onSorting={(field, order) => setSorting({ field, order })}
              />
              <tbody>
                {commentsData?.map((comment, key) => (
                  <tr key={key}>
                    <th scope="row">
                      {query?.plan && (
                        <input
                          type="checkbox"
                          className="mr-3"
                          onClick={(e) => handleClick(e, comment)}
                          value={comment?._id}
                          checked={
                            checked2[
                              checked2?.findIndex((e) => e._id === comment?._id)
                            ]?.isChecked
                              ? true
                              : false
                          }
                          id={comment?._id}
                          disabled={
                            query.readonly == "true"
                              ? true
                              : false ||
                                (menuApprove?.length &&
                                  menuApprove?.findIndex(
                                    (e) => e._id === comment?._id
                                  ) !== -1)
                              ? true
                              : false
                          }
                        />
                      )}
                      {query?.data && (
                        <input
                          type="checkbox"
                          className="mr-3"
                          onClick={(e) => handleClick(e, comment)}
                          value={comment?._id}
                          defaultChecked={
                            query.data == "157"
                              ? true
                              : checked2?.findIndex(
                                  (e) => e._id === comment?._id
                                ) !== -1
                              ? checked2[
                                  checked2?.findIndex(
                                    (e) => e._id === comment?._id
                                  )
                                ].isChecked
                              : false ||
                                (menuApprove?.length &&
                                  menuApprove?.findIndex(
                                    (e) => e._id === comment?._id
                                  ) !== -1)
                              ? true
                              : false
                          }
                          id={comment?._id}
                          disabled={
                            query.readonly == "true"
                              ? true
                              : false ||
                                (menuApprove?.length &&
                                  menuApprove?.findIndex(
                                    (e) => e._id === comment?._id
                                  ) !== -1)
                              ? true
                              : false
                          }
                        />
                      )}

                      {comment.index}
                    </th>

                    {comment.name.length <= 20 ? (
                      <td>{comment.name}</td>
                    ) : (
                      <Tooltip content={comment.name} direction="bottom">
                        <td>
                          <div className="elice">{comment.name}</div>
                        </td>
                      </Tooltip>
                    )}
                    <td>
                      <div>
                        {localData?.role?.roleName === "superadmin" && (
                          <>
                            <div
                              className="btn btn-primary mr-3"
                              onClick={() =>
                                toggleContactFormVisiblity(comment)
                              }
                            >
                              Edit
                            </div>
                            <div
                              className="btn btn-danger mr-3"
                              onClick={() => deleteAdmin(comment)}
                            >
                              Delete
                            </div>
                          </>
                        )}
                        {!query.plan && (
                          <div
                            className="btn btn-primary"
                            onClick={() =>
                              router.push(
                                `/menu/question/question?id=${comment?._id}`
                              )
                            }
                          >
                            Questions
                          </div>
                        )}
                        {query.plan && (
                          <div>
                            {query.readonly == "true"
                              ? true
                              : false ||
                                (menuApprove?.length &&
                                  menuApprove?.findIndex(
                                    (e) => e._id === comment?._id
                                  ) !== -1)
                              ? <div className="green">Purchased</div>
                              : <div className="red">Not Purchase</div>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!commentsData?.length ? <div>No Sub Menu Found</div> : <div></div>}
            <div className="row">
              <div className="col-md-12">
                <PaginationComponent
                  total={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
            <div className={Styles.alignEnd}>
              {query?.data == 75 ? (
                <>
                  <button
                    className={Styles.mainButton}
                    onClick={() => purchase("75")}
                  >
                    Purchase
                  </button>
                </>
              ) : query?.data == 157 ? (
                <>
                  {localData?.role?.roleName == "admin" && (
                    <>
                      <button
                        className={Styles.mainButton}
                        onClick={() => purchases("157")}
                      >
                        Purchase
                      </button>
                    </>
                  )}
                </>
              ) : query.price ? (
                <>
                  {/* {localData?.role?.roleName == "admin" && ( */}
                  <>
                    <button
                      className={Styles.mainButton}
                      onClick={() => purchasesPlan(query.price)}
                    >
                      Purchase
                    </button>
                  </>
                  {/* } */}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {loader}

      {contactFormVisiblity && (
        <AddSubMenu
          onClose={toggleContactFormVisiblity}
          getData={getData}
          id={id}
        />
      )}
    </>
  );
};

export default DataTable;
