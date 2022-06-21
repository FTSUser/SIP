import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";
import Styles from "../admin/admin.module.scss";
import { adminService, alertService, userService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import Head from "next/head";
import Tooltip from "components/custom/tooltip";
import moment from "moment";

const DataTable = () => {
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
    { name: "Date", field: "creationDate", sortable: true },
    { name: "Name", field: "name", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "Subject", field: "subject", sortable: true },
    { name: "Message", field: "message", sortable: true },
    { name: "Action", field: "action", sortable: false },
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
        text: "You want to delete this contact?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          userService.deleteContactusadmin(id?._id).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Delete!", "Your contact is Deleted.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your contact is safe", "error");
        }
      });
    }
  };

  const getData = async () => {
    showLoader();
    await adminService.getContactUs().then((response) => {
      hideLoader();
      response.payload.Contactus?.map((e, index) => {
        e.index = index + 1;
        return e;
      });
      setComments(response.payload.Contactus);
    });
  };

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.name.toLowerCase().includes(search.toLowerCase()) ||
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
        <title>SIP Interview - Contact </title>
        <meta
          name="description"
          content="Meta description for the Contact Page"
        />
      </Head>
      <div className="row w-100 p-5 heightAuto">
        <div className="col mb-3 col-12 text-center ">
          <div className="row py-4">
            <div className="col-md-3">
              <div>
                <h2>Contact List</h2>
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
                  <td>{moment(comment.creationDate).format("MM-DD-YYYY HH:mm")}</td>
                  {comment.name.length <= 20 ? (
                    <td>{comment.name}</td>
                  ) : (
                    <Tooltip content={comment.name} direction="bottom">
                      <td>
                        <div className="elice">{comment.name}</div>
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
                  {comment.subject.length <= 20 ? (
                    <td>{comment.subject}</td>
                  ) : (
                    <Tooltip content={comment.subject} direction="bottom">
                      <td>
                        <div className="elice">{comment.subject}</div>
                      </td>
                    </Tooltip>
                  )}
                  {comment.message.length <= 20 ? (
                    <td>{comment.message}</td>
                  ) : (
                    <Tooltip content={comment.message} direction="bottom">
                      <td>
                        <div className="elice">{comment.message}</div>
                      </td>
                    </Tooltip>
                  )}

                  <td>
                    <div>
                      {/* <div
                        className="btn btn-primary mr-3"
                        onClick={() => toggleContactFormVisiblity(comment)}
                      >
                        Edit
                      </div> */}
                      <div
                        className="btn btn-danger"
                        onClick={() => deleteAdmin(comment)}
                      >
                        Delete
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!commentsData?.length ? (
            <div>No Contact Data Found</div>
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
      {loader}
    </>
  );
};

export default DataTable;
