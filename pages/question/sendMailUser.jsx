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
import Result from "./result";

const SendMailUser = () => {
  const { query } = useRouter();
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

    { name: "Email", field: "email", sortable: true },
    { name: "User Name", field: "user", sortable: true },
    { name: "Question Set Name", field: "name", sortable: true },
    { name: "Total", field: "total", sortable: true },
    { name: "Score", field: "Score", sortable: true },
    { name: "Action", field: "action" },
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
    if (query?.id) {
      getData();
    }
  }, []);

  const getData = async () => {
    showLoader();
    await questionService.getMailByID(query?.id).then((response) => {
      hideLoader();
      setComments(response.payload.user);
    });
  };

  const [contactFormVisiblity1, setContactFormVisiblity1] = useState(false);

  const toggleContactFormVisiblity1 = (id) => {
    if (id) {
      setId(id);
    } else {
      setId();
    }
    setContactFormVisiblity1((visiblity) => !visiblity);
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
        <title>SIP Interview - Receive Mail User </title>
        <meta
          name="description"
          content="Meta description for the Question Set Page"
        />
      </Head>

      <div className=" w-100 p-5 heightAuto">
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
                <h2>Receive Mail User</h2>
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
                  <th scope="row">{key + 1}</th>
                  <td>{comment?.response?.name}</td>
                  <td>{comment.email}</td>

                  {comment.Qsetid?.name?.length <= 20 ? (
                    <td>{comment.Qsetid?.name}</td>
                  ) : (
                    <Tooltip
                      content={comment.questionset[0]?.name}
                      direction="bottom"
                    >
                      <td>
                        <div className="elice">
                          {comment.questionset[0]?.name}
                        </div>
                      </td>
                    </Tooltip>
                  )}
                  <td>{comment?.response?.total}</td>
                  <td>{comment?.response?.Score}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        toggleContactFormVisiblity1(comment?.response)
                      }
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!commentsData?.length ? (
            <div>No Recive Mail User Found</div>
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
      {contactFormVisiblity1 && (
        <Result onClose={toggleContactFormVisiblity1} id={id} />
      )}
    </>
  );
};

export default SendMailUser;
