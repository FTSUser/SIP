import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, menuService } from "services";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router from "next/router";
import Editor from "pages/editor";
const AddIntruction = ({ onClose, getData, id }) => {
  const [inputs, setInputs] = useState({ name: "", description: "" });
  const [open, setOpen] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [roleState, setroleset] = useState();
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));

  useEffect(() => {
    setIsAddMode(id ? true : false);
    setData(id?.description)
  }, [id]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .strict(true)
      .required(" Title is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
  });
  const editvalidationSchema = Yup.object().shape({
    title: Yup.string()
      .strict(true)
      .required(" Title is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
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

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    if (description == "") {
      alertService.error("please enter description");
    } else {
      return !isAddMode ? createUser(data) : updateUser(id?._id, data);
    }
  }
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin;
  const [localData, setRole] = useState(role);
  function createUser(data) {
    const datas = {
      title: data?.title,
      description: description,
      Aid: localData?._id,
    };
    return menuService
      .addinstruction(datas)
      .then(() => {
        alertService.success(data.message, { keepAfterRouteChange: true });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    const datas = {
      title: data?.title,
      description: description,
      Aid: localData?._id,
    };
    return menuService
      .updateinstruction(id,datas)
      .then((response) => {
        alertService.success(response.message, { keepAfterRouteChange: true });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [description, setData] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);
  return (
    <>
      <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          {!isAddMode ? (
            <Modal.Title>Add </Modal.Title>
          ) : (
            <Modal.Title>Edit </Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body id="add-contact-modal">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <div className="form-group ">
                <label> Name</label>
                <input
                  name="title"
                  type="text"
                  {...register("title")}
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.title?.message}</div>
              </div>
              <div className="form-group ">
                <label> Description</label>
                <Editor
                  name="description"
                  value={description}
                  onChange={(data) => {
                    setData(data);
                  }}
                  editorLoaded={editorLoaded}
                />
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
              {/* <button
                onClick={() => reset(formOptions.defaultValues)}
                type="button"
                disabled={formState.isSubmitting}
                className="btn btn-secondary"
              >
                Reset
              </button> */}
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
    </>
  );
};

export default AddIntruction;
