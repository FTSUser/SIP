import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";
import Styles from "../admin/admin.module.scss";
import { alertService, menuService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import moment from "moment";

import router, { useRouter } from "next/router";
import Head from "next/head";
import Tooltip from "components/custom/tooltip";

const DataTable = () => {
  const [comments, setComments] = useState([]);
  const [menuApprove, setmenuApprove] = useState([]);

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
    { name: "No#", field: "_id", sortable: false },
    { name: "Name", field: "name", sortable: true },
    { name: "Date", field: "createdAt", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "Total Question", field: "total", sortable: true },
    { name: "Score", field: "score", sortable: true },
    { name: "Action", field: "Action", sortable: false },
  ];

  useEffect(() => {
    getData();
  }, []);

  const deleteAdmin = (id) => {
    if (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this applied interviewer?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          menuService.deleteResponse(id?._id).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Delete!", "Applied interviewer deleted successfully.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your response is safe", "error");
        }
      });
    }
  };
  const getData = async () => {
    showLoader();
    await menuService.getAllResponseAdmin(localData?._id).then((response) => {
      hideLoader();
      response.payload.all?.map((e, index) => {
        e.index = index + 1;
        return e;
      });
      setComments(response.payload.all);
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
        <title>SIP Interview - Applied Interviewer</title>
        <meta name="description" content="Meta description for the Menu Page" />
      </Head>

      <div className="row w-100 p-5 heightAuto">
        <div className="col mb-3 col-12 text-center">
          <div className="row py-4">
            <div className="col-md-4">
              <div>
                <h2>Applied Interviewer List</h2>
              </div>
            </div>
            <div className="col-md-8 d-flex flex-row-reverse">
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
                  <th>{comment?.index}</th>
                  {comment.name.length <= 30 ? (
                    <td>{comment.name}</td>
                  ) : (
                    <Tooltip content={comment.name} direction="bottom">
                      <td>
                        <div className="elice">{comment.name}</div>
                      </td>
                    </Tooltip>
                  )}
                   
                    <td>{moment(comment.createdAt).format(
                              "YYYY-MM-DD"
                            ) ? moment(comment.createdAt).format(
                              "YYYY-MM-DD"
                            ) : '-'}</td>
                
                  
                 
                  {comment.email.length <= 30 ? (
                    <td>{comment.email}</td>
                  ) : (
                    <Tooltip content={comment.email} direction="bottom">
                      <td>
                        <div className="elice">{comment.email}</div>
                      </td>
                    </Tooltip>
                  )}
                  <td>{comment.total}</td>
                  <td>{comment.score}</td>
                  <td>
                    <div>
                      <>
                        <div
                          className="btn btn-primary mr-3"
                          onClick={() =>
                            router.push(
                              `/response/viewResponse?id=${comment?._id}`
                            )
                          }
                        >
                          View
                        </div>
                        <div
                          className="btn btn-danger mr-3"
                          onClick={() => deleteAdmin(comment)}
                        >
                          Delete
                        </div>
                      </>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!commentsData?.length ? <div>No response found</div> : <div></div>}

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
    </>
  );
};

export default DataTable;
