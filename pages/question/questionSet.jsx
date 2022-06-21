import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";

import { alertService, questionService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import router, { useRouter } from "next/router";
import Styles from "../Question/questionSet.module.scss";
import AddQuestionSet from "./addQuestionSet";
import Head from "next/head";
import Tooltip from "components/custom/tooltip";

const QuestionSet = () => {
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

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "Name", field: "name", sortable: true },
    { name: "Description", field: "description", sortable: true },

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
        text: "You want to delete this question set?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          questionService.deleteQuestionSet(id).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Delete!", "Your question set is deleted.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your question set is safe", "error");
        }
      });
    }
  };

  const getData = async () => {
    showLoader();
    if(localData?.role?.roleName === 'superadmin'){
      await questionService.getAllQuestionSet().then((response) => {
        hideLoader();
        setComments(response.payload.Questionset);
      });
    }else{
      await questionService.getQuestionSetByAID(localData?._id).then((response) => {
        hideLoader();
        setComments(response.payload.QuestionSet);
      });
    }
    
  };

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.name.toLowerCase().includes(search.toLowerCase()) ||
          comment.description.toLowerCase().includes(search.toLowerCase())
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
        <title>SIP Interview - Question Set </title>
        <meta
          name="description"
          content="Meta description for the Question Set Page"
        />
      </Head>
      <div className="row w-100 p-5 heightAuto">
        <div className="col mb-3 col-12 text-center">
          <div className="row py-4">
            <div className="col-md-3">
              <div>
                <h2>List of Question set</h2>
              </div>
            </div>
            <div className="col-md-9 d-flex flex-row-reverse">
              {localData?.role?.roleName == "admin" && (
                <button
                  className={classNames(Styles.mainButtons, "ml-3")}
                  onClick={() => toggleContactFormVisiblity()}
                >
                  Add Question Set
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
                  {comment.description.length <= 20 ? (
                    <td>{comment.description}</td>
                  ) : (
                    <Tooltip content={comment.description} direction="bottom">
                      <td>
                        <div className="elice">{comment.description}</div>
                      </td>
                    </Tooltip>
                  )}

                  <td>
                    <div>
                      {localData?.role?.roleName == "admin" && (
                        <>
                          <div
                            className="btn btn-primary mr-3"
                            onClick={() => toggleContactFormVisiblity(comment)}
                          >
                            Edit
                          </div>
                          <div
                            className="btn btn-danger mr-3"
                            onClick={() => deleteAdmin(comment?._id)}
                          >
                            Delete
                          </div>
                          <div
                            className="btn btn-primary mr-3"
                            onClick={() =>
                              router.push(
                                `/question/sendMail?id=${comment?._id}`
                              )
                            }
                          >
                            Send Mail
                          </div>
                          <div
                            className="btn btn-primary mr-3"
                            onClick={() =>
                              router.push(
                                `/question/sendMailUser?id=${comment?._id}`
                              )
                            }
                          >
                            Receive Mail User
                          </div>
                       
                        </>
                      )}

                      <div
                        className="btn btn-primary mr-3"
                        onClick={() =>
                          router.push(
                            `/question/viewQuestionSet?id=${comment?._id}`
                          )
                        }
                      >
                        View Question Set
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!commentsData?.length ? (
            <div>No Question Set Found</div>
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

      {contactFormVisiblity && (
        <AddQuestionSet
          onClose={toggleContactFormVisiblity}
          getData={getData}
          id={id}
        />
      )}
    </>
  );
};

export default QuestionSet;
