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
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin?.role
    ?.roleName;
  const [localData, setRole] = useState(role);
  const ITEMS_PER_PAGE = 10;

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "Name", field: "fname", sortable: true },
    { name: "Last Name", field: "lname", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "Phone", field: "phone", sortable: false },
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
        text: "Are you sure you want to delete this administrator?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          userService.delete(id?._id).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Delete!", "Admin deleted successfully", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your admin is safe", "error");
        }
      });
    }
  };

  const handleUpdateStatusCourseName = (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to ${status === false ? 'deactivate ':'active '} this admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        adminService.getStatus(id, { isActive: status }).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Status!", "Your admin status has been changed.", "success");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your admin is safe", "error");
      }
    });


  
  };

  const getData = async () => {
    showLoader();
    await adminService.getAll().then((response) => {
      hideLoader();
      response.payload.admin.map((e, index) => {
        e.index = index + 1;
        return e;
      });
      setComments(response.payload.admin);
    });
  };

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.fname.toLowerCase().includes(search.toLowerCase()) ||
          comment.lname.toLowerCase().includes(search.toLowerCase()) ||
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
        <title>SIP Interview - Admin</title>
        <meta
          name="description"
          content="Meta description for the Admin Page"
        />
      </Head>
      <div className="row w-100 p-5 heightAuto">
        <div className="col mb-3 col-12 text-center">
          <div className="row py-4">
            <div className="col-md-3">
              <div>
                <h2>Admin List</h2>
              </div>
            </div>
            <div className="col-md-9 d-flex flex-row-reverse">
              <button
                className={classNames(Styles.mainButton, "ml-3")}
                onClick={() => toggleContactFormVisiblity()}
              >
                Add Admin
              </button>

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
                  <th scope="row">{comment.index}</th>
                  {comment.fname.length <= 20 ? (
                    <td>{comment.fname}</td>
                  ) : (
                    <Tooltip content={comment.fname} direction="bottom">
                      <td>
                        <div className="elice">{comment.fname}</div>
                      </td>
                    </Tooltip>
                  )}
                  {comment.lname.length <= 20 ? (
                    <td>{comment.lname}</td>
                  ) : (
                    <Tooltip content={comment.lname} direction="bottom">
                      <td>
                        <div className="elice">{comment.lname}</div>
                      </td>
                    </Tooltip>
                  )}
                  {comment.email.length <= 20 ? (
                    <td>{comment.email}</td>
                  ) : (
                    <Tooltip content={comment.email} direction="bottom">
                      <td>
                        <div className="elice">{comment.email}</div>
                      </td>
                    </Tooltip>
                  )}
                  {comment.phone.length <= 20 ? (
                    <td>{comment.phone}</td>
                  ) : (
                    <Tooltip content={comment.phone} direction="bottom">
                      <td>
                        <div className="elice">{comment.phone}</div>
                      </td>
                    </Tooltip>
                  )}

                  <td>
                    <div>
                      {localData === "admin" && (
                        <div
                          className="btn btn-primary mr-3"
                          onClick={() => toggleContactFormVisiblity(comment)}
                        >
                          Edit
                        </div>
                      )}
                      {localData === "superadmin" && (
                        <>
                          <button
                            className="btn btn-success mr-2 maxwidth" style={{width:'110px'}}
                            onClick={() =>
                              handleUpdateStatusCourseName(
                                comment?._id,
                                !comment?.isActive
                              )
                            }
                          >
                            {comment?.isActive ? 'Active' : 'Deactive'}
                          </button>
                          <div
                            className="btn btn-danger"
                            onClick={() => deleteAdmin(comment)}
                          >
                            Delete
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
          {!commentsData?.length ? <div>No Admin Data Found</div> : <div></div>}
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
      {loader}

      {contactFormVisiblity && (
        <AddAdmin
          onClose={toggleContactFormVisiblity}
          getData={getData}
          id={id}
        />
      )}
    </>
  );
};

export default DataTable;
