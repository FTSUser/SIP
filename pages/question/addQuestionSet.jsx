import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, questionService, menuService } from "services";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";
import Styles from "../Question/questionSet.module.scss";
import classNames from "classnames";

const AddQuestionSet = ({ onClose, getData, id }) => {
  const [inputs, setInputs] = useState({ name: "", price: "" });
  const [open, setOpen] = useState(true);
  const [isCheckList, setCheckList] = useState(false);
  const [isSubMenuList, setSubMenuList] = useState(false);
  const [isQuestionList, setQuestionList] = useState(false);

  const [comments, setComments] = useState([]);
  const [getIdData, setIDData] = useState([]);

  const [subMenuData, setSubMenuDataState] = useState([]);
  const [questionData, setQuestionState] = useState([]);
  const [questionDataList, setQuestionStateList] = useState([]);

  const [isAddMode, setIsAddMode] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [roleState, setroleset] = useState();
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin;
  const [localData, setRole] = useState(role);
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));
  const [menuCheck, setMenucheck] = useState([]);

  useEffect(() => {
    const getDatas = async () => {
      showLoader();
      await questionService.getQuestionSetByID(id?._id).then((response) => {
        hideLoader();
        setIDData(response.payload);
      });
    };

    setIsAddMode(id ? true : false);
    if (id) {
      getDatas();
    }
  }, [id?._id]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(" Name is required"),
    description: Yup.string().required(" Description is required"),
    // acceptTerms: Yup.bool().oneOf([true], "check thecheckbox is required"),
  });
  const editvalidationSchema = Yup.object().shape({
    name: Yup.string().required(" Name is required"),
    description: Yup.string().required(" Description is required"),
    // acceptTerms: Yup.bool().oneOf([true], "check thecheckbox is required"),
  });
  const formOptions = {
    resolver: isAddMode
      ? yupResolver(editvalidationSchema)
      : yupResolver(validationSchema),
  };

  // set default form values if in edit mode
  if (isAddMode) {
    formOptions.defaultValues = id;
  }
  const { query } = useRouter();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return !isAddMode ? createUser(data) : updateUser(id?._id, data);
  }

  function createUser(data) {
    data = {
      Aid: localData?._id,
      name: data.name,
      description: data.description,
      ListofQuestion: questionDataList,
      menus: checkedItems,
      subMenus: checkedSubMenuItems,
    };

    return questionService
      .createQuestionSet(data)
      .then((res) => {
        alertService.success(res.message, { keepAfterRouteChange: true });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    data = {
      Aid: localData?._id,
      name: data.name,
      description: data.description,
      ListofQuestion: questionDataList,
      menus: checkedItems,
      subMenus: checkedSubMenuItems,
    };
    return questionService
      .updateQuestionSet(id, data)
      .then((response) => {
        alertService.success(response.message, {
          keepAfterRouteChange: true,
        });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  function chnageCheckBox(e) {
    if (e.target.checked == true) {
      setOpen(false);
      setCheckList(true);
      getDataMenu();
    }
  }

  function closeList() {
    setCheckList(false);
    setOpen(true);
  }
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedSubMenuItems, setCheckedSubMenuItems] = useState([]);
  const [checkedQuestionItems, setCheckedQuestionItems] = useState([]);
  useEffect(() => {}, [checkedItems]);

  useEffect(() => {
    if (getIdData != []) {
      setCheckedItems(getIdData.menu ? getIdData.menu : []);
      setCheckedSubMenuItems(getIdData.subMenu ? getIdData.subMenu : []);
      setCheckedQuestionItems(getIdData.question ? getIdData.question : []);
    }
  }, [getIdData]);

  const handleChange = (event) => {
    setCheckedItems((pre) => {
      if (pre.includes(event.target.value)) {
        return pre.filter((data) => data != event.target.value);
      }
      return [...pre, event.target.value];
    });
  };
  const handleChangeSubMenu = (event) => {
    setCheckedSubMenuItems((pre) => {
      if (pre.includes(event.target.value)) {
        return pre.filter((data) => data != event.target.value);
      }
      return [...pre, event.target.value];
    });
  };
  const handleChangeQuestion = (event) => {
    setCheckedQuestionItems((pre) => {
      if (pre.includes(event.target.value)) {
        return pre.filter((data) => data != event.target.value);
      }
      return [...pre, event.target.value];
    });
  };
  //
  const getDataMenu = async () => {
    showLoader();
    await menuService.getAllSubMenuByID(localData?._id).then((response) => {
      hideLoader();
      setComments(response.payload.menus);
    });
  };
  function onSubmitNext(e) {
    e.preventDefault();
    let createMenu = { menuid: checkedItems,id:localData._id };
    if (checkedItems.length) {
      menuService.getAllSubMenuApprove(createMenu).then((response) => {
        hideLoader();
        setSubMenuDataState(response.payload.Menu);
        if (subMenuData) {
          setCheckList(false);
          setSubMenuList(true);
          setQuestionList(false);
        }
      });
    } else {
      alertService.warn("Please Select  Menu");
    }
  }

  function onSubmitSubMenuNext(e) {
    e.preventDefault();
    let createSubMenu = { submenus: checkedSubMenuItems };
    if (checkedSubMenuItems.length) {
      questionService.getQuestionBySubmenu(createSubMenu).then((response) => {
        hideLoader();

        setQuestionState(response.payload.Question);
        if (questionData) {
          setSubMenuList(false);
          setQuestionList(true);
        }
      });
    } else {
      alertService.warn("Please Select  Sub Menu");
    }
  }
  function onSubmitQuestionList(e) {
    e.preventDefault();
    let createSubMenu = checkedQuestionItems;

    if (checkedQuestionItems.length) {
      setQuestionStateList(createSubMenu);
      setSubMenuList(false);
      setQuestionList(false);
      setOpen(true);
    } else {
      alertService.warn("Please Select Question");
    }
  }

  function previous() {
    setOpen(true);
    setCheckList(true);
    setCheckList(false);
  }
  function previousMenu() {
    setSubMenuList(false);
    setCheckList(true);
  }
  function previousSubMenu() {
    setQuestionList(false);
    setSubMenuList(true);
  }

  return (
    <>
      <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          {!isAddMode ? (
            <Modal.Title>Add Question Set</Modal.Title>
          ) : (
            <Modal.Title>Edit Question Set</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body id="add-contact-modal">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <div className="form-group ">
                <label> Name</label>
                <input
                  name="name"
                  type="text"
                  {...register("name")}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.name?.message}</div>
              </div>
            </div>
            <div className="">
              <div className="form-group ">
                <label> Description</label>
                <input
                  name="description"
                  type="text"
                  {...register("description")}
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.description?.message}
                </div>
              </div>
            </div>
            <div className="">
              <div className="form-group ">
                <input
                  name="checkList"
                  type="checkbox"
                
                  id="acceptTerms"
                  className={`form-check-input ml-0`}
                  // className={` ${errors.checkList ? "is-invalid" : ""}`}
                  onChange={(e) => chnageCheckBox(e)}
                />
                <label htmlFor="checkList" className="form-check-label ml-4">
                  List Of Question
                </label>
                {/* <div className="invalid-feedback">
                  {errors.checkList?.message}
                </div> */}
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="btn btn-primary mr-2"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Save
              </button>

              <button
                onClick={onClose}
                type="button"
                disabled={formState.isSubmitting}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {isCheckList == true ? (
        <>
          <div className={Styles.customModel}>
            <div className={Styles.modelDesign}>
              <div className={Styles.modelHeader}>
                <div className={Styles.modelHeading}>
                  <h3>List of Menus</h3>
                </div>
                <div className="close" onClick={() => closeList()}>
                  <i className="fas fa-times"></i>
                </div>
              </div>
              <div className={Styles.modelBody}>
                <div>
                  <div className="">
                    {comments?.map((comment, key) => (
                      <div key={key}>
                        <input
                          type="checkbox"
                          // onChange={(e) => setMenucheck(e.target.value)}
                          onChange={(e) => handleChange(e)}
                          checked={checkedItems?.includes(comment?._id)}
                          value={comment?._id}
                          className="mr-2"
                        />
                        <span>{comment?.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={classNames(Styles.mainButton, "mr-3")}
                    onClick={() => previous()}
                  >
                    Previous
                  </button>
                  <button
                    className={Styles.mainButton}
                    onClick={(e) => onSubmitNext(e)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {isSubMenuList == true ? (
        <>
          <div className={Styles.customModel}>
            <div className={Styles.modelDesign}>
              <div className={Styles.modelHeader}>
                <div className={Styles.modelHeading}>
                  <h3>List of Sub Menus </h3>
                </div>
                <div className="close" onClick={() => closeList()}>
                  <i className="fas fa-times"></i>
                </div>
              </div>
              <div className={Styles.modelBody}>
                <div>
                  <div className="">
                    {subMenuData?.map((comment, key) => (
                      <div key={key}>
                        <input
                          type="checkbox"
                          // onChange={(e) => setMenucheck(e.target.value)}
                          onChange={(e) => handleChangeSubMenu(e)}
                          checked={checkedSubMenuItems?.includes(comment?._id)}
                          value={comment?._id}
                          className="mr-2"
                        />
                        <span>{comment?.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={classNames(Styles.mainButton, "mr-3")}
                    onClick={() => previousMenu()}
                  >
                    Previous
                  </button>
                  <button
                    className={Styles.mainButton}
                    onClick={(e) => onSubmitSubMenuNext(e)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      {isQuestionList == true ? (
        <>
          <div className={Styles.customModel}>
            <div className={Styles.modelDesign}>
              <div className={Styles.modelHeader}>
                <div className={Styles.modelHeading}>
                  <h3>List of Questions</h3>
                </div>
                <div className="close" onClick={() => closeList()}>
                  <i className="fas fa-times"></i>
                </div>
              </div>
              <div className={Styles.modelBody}>
                <div>
                  <div className="">
                    {questionData?.map((comment, key) => (
                      <div key={key}>
                        <input
                          type="checkbox"
                          // onChange={(e) => setMenucheck(e.target.value)}
                          onChange={(e) => handleChangeQuestion(e)}
                          checked={checkedQuestionItems?.includes(comment?._id)}
                          value={comment?._id}
                          className="mr-2"
                        />
                        <span>{comment?.Qname}</span>
                        {/* <div>{comment?.type}</div> */}
                      </div>
                    ))}
                  </div>
                  <button
                    className={classNames(Styles.mainButton, "mr-3")}
                    onClick={() => previousSubMenu()}
                  >
                    Previous
                  </button>
                  <button
                    className={Styles.mainButton}
                    onClick={(e) => onSubmitQuestionList(e)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default AddQuestionSet;
