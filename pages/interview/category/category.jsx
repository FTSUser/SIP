import React, { useEffect, useState, useMemo } from "react";
import PaginationComponent from "components/custom/paginastion/paginastion";
import Search from "components/custom/search/search";
import TBLHeader from "components/custom/header/header";
import Styles from "../../admin/admin.module.scss";
import { alertService, menuService } from "services";
import Swal from "sweetalert2";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import router, { useRouter } from "next/router";
import Head from "next/head";
import Tooltip from "components/custom/tooltip";
import Add from "../add/add";
import AddCategory from "./addCategory/addCategory";

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
    { name: "No#", field: "id", sortable: false },
    { name: "Name", field: "name", sortable: true },

    { name: "Image", field: "image", sortable: true },
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
    getApproveMenu();
  }, []);

  const deleteAdmin = (id) => {
    if (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete category?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          menuService.deleteGuideCategory(id?._id).then((res) => {
            getData();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            Swal.fire("Delete!", "Your category is deleted.", "success");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your category is safe", "error");
        }
      });
    }
  };
  const getApproveMenu = async () => {
    showLoader();
    await menuService.getAllGuideCategory().then((response) => {
      // hideLoader();

      setmenuApprove(response.payload.interviewCategory);
    });
  };
  const getData = async () => {
    showLoader();
    await menuService.getAllGuideCategory().then((response) => {
      hideLoader();
      response.payload.interviewCategory?.map((e, index) => {
        e.index = index + 1;
        return e;
      });
      setComments(response.payload.interviewCategory);
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
        <title>SIP Interview - Category</title>
        <meta name="description" content="Meta description for the Category Page" />
      </Head>

      <div className="row w-100 p-5 heightAuto">
        <div className="col mb-3 col-12 text-center">
          <div className="row py-4">
            <div className="col">
              <div>
                <h2  className="text-left">List of Categories</h2>
              </div>
            </div>
              
            <div className="col d-flex flex-row-reverse">
              {localData?.role?.roleName == "superadmin" && (
                <button
                  className={classNames(Styles.mainButton, "ml-3")}
                  onClick={() => toggleContactFormVisiblity()}
                >
                  Add Category
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
                  <th scope="row">{comment.index}</th>

                  <td>{comment.name}</td>

                  <td>
                    <img className="img-fluids" src={comment?.image} alt="" />
                  </td>

                  <td>
                    <div>
                      {localData?.role?.roleName === "superadmin" && (
                        <>
                          <div
                            className="btn btn-primary mr-3"
                            onClick={() => toggleContactFormVisiblity(comment)}
                          >
                            Edit
                          </div>
                          <div
                            className="btn btn-danger mr-3"
                            onClick={() => deleteAdmin(comment)}
                          >
                            Delete
                          </div>
                          <div
                            className="btn btn-primary"
                            onClick={() =>
                              router.push(
                                `/interview/interviewguide?id=${comment?._id}`
                              )
                            }
                          >
                            Guide
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
            <div>No Category Data Found</div>
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
        <AddCategory
          onClose={toggleContactFormVisiblity}
          getData={getData}
          id={id}
        />
      )}
    </>
  );
};

export default DataTable;
