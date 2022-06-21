import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";
import Styles from "../admin/admin.module.scss";
import { adminService, alertService, userService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import AddAdmin from "./addAdmin/addAdmin";
import moment from "moment";
import Head from "next/head";
import { Tab, Tabs } from "react-bootstrap";

const DataTable = () => {
  const [key, setKey] = useState("home");

  const [comments, setComments] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [id, setId] = useState();

  const ITEMS_PER_PAGE = 10;

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "Menu", field: "menu", sortable: true },
    { name: "Sub Menu", field: "submenu", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "Date", field: "startDate", sortable: true },
    { name: "Action", field: "Action", sortable: false },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [key]);

  const approveMenu = (id) => {
    if (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to approve menu?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          const data = {
            isAprove: true,
          };
          adminService.approveRequest(id?._id, data.isAprove).then((res) => {
            getData();
            if (res) {
            }
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Approved", "Menu Approved Successfully.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Menu not approved", "error");
        }
      });
    }
  };
  const rejectMenu = (id) => {
    if (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to reject menu?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          const data = {
            isAprove: false,
          };
          adminService.approveRequest(id?._id, data.isAprove).then((res) => {
            getData();
            if (res) {
            }
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Rejected", "Menu Rejected Successfully.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Menu not reject", "error");
        }
      });
    }
  };

  const getData = async () => {
    if (key == "home") {
      showLoader();
      await adminService.getAllRequests().then((response) => {
        hideLoader();
        response.payload.admin.map((e, index) => {
          e.index = index + 1;
          return e;
        });
        setComments(response.payload.admin);
      });
    } else if (key == "profile") {
      showLoader();
      await adminService.getAllRequest(true).then((response) => {
        hideLoader();
        response.payload.admin?.map((e, index) => {
          e.index = index + 1;
          return e;
        });
        setComments(response.payload.admin);
      });
    } else if (key == "reject") {
      showLoader();
      await adminService.getAllRequest(false).then((response) => {
        hideLoader();
        response.payload.admin?.map((e, index) => {
          e.index = index + 1;
          return e;
        });
        setComments(response.payload.admin);
      });
    }
  };

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments?.filter((comment) =>
        comment.email.toLowerCase().includes(search.toLowerCase())
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

  return (
    <>
      <Head>
        <title>SIP Interview - Admin</title>
        <meta
          name="description"
          content="Meta description for the Admin Page"
        />
      </Head>
      <div className="row w-100 p-5 heightAuto">
        <div className="w-100">
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Tab eventKey="home" title="Request">
              <div className="abc">
                <div className="col mb-3 col-12 text-center">
                  <div className="row py-4">
                    <div className="col-md-3">
                      <div>
                        <h2>Request List</h2>
                      </div>
                    </div>
                    <div className="col-md-9 d-flex flex-row-reverse">
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
                          <th scope="row">{comment?.index}</th>
                          <td>{comment?.menus[0]?.mid?.name}</td>
                          <td>{comment?.menus[0]?.name}</td>
                          <td>{comment.email}</td>
                          <td>
                            {moment(comment.startDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </td>

                          <td>
                            <div>
                              {comment?.isAprove ? (
                                <>
                                  <div>
                                    <b>Approved</b>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="btn btn-primary mr-3"
                                    onClick={() => approveMenu(comment)}
                                  >
                                    Approve
                                  </div>
                                  <div
                                    className="btn btn-danger mr-3"
                                    onClick={() => rejectMenu(comment)}
                                  >
                                    Reject
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!commentsData?.length ? (
                    <div>No Admin Data Found</div>
                  ) : (
                    <div></div>
                  )}
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
                </div>
              </div>
            </Tab>

            <Tab eventKey="profile" title="Approved">
              <div className="abc">
                <div className="col mb-3 col-12 text-center">
                  <div className="row py-4">
                    <div className="col-md-3">
                      <div>
                        <h2>Approved List</h2>
                      </div>
                    </div>
                    <div className="col-md-9 d-flex flex-row-reverse">
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
                          <th scope="row">{comment?.index}</th>
                          <td>{comment?.menus[0]?.mid?.name}</td>
                          <td>{comment?.menus[0]?.name}</td>
                          <td>{comment.email}</td>
                          <td>
                            {moment(comment.startDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </td>

                          <td>
                            <div>
                              <div>
                                <b className={Styles.green}>Approved</b>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!commentsData?.length ? (
                    <div>No Admin Data Found</div>
                  ) : (
                    <div></div>
                  )}
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
                </div>
              </div>
            </Tab>
            <Tab eventKey="reject" title="Reject">
              <div className="abc">
                <div className="col mb-3 col-12 text-center">
                  <div className="row py-4">
                    <div className="col-md-3">
                      <div>
                        <h2>Rejected List</h2>
                      </div>
                    </div>
                    <div className="col-md-9 d-flex flex-row-reverse">
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
                          <th scope="row">{comment?.index}</th>
                          <td>{comment?.menus[0]?.mid?.name}</td>
                          <td>{comment?.menus[0]?.name}</td>
                          <td>{comment.email}</td>
                          <td>
                            {moment(comment.startDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </td>

                          <td>
                            <div>
                              <div>
                                <b className={Styles.red}>Rejected</b>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!commentsData?.length ? (
                    <div>No Admin Data Found</div>
                  ) : (
                    <div></div>
                  )}
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
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>

      {loader}
    </>
  );
};

export default DataTable;
