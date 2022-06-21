import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, menuService } from "services";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";

const AddSubMenu = ({ onClose, getData, id }) => {
  const [inputs, setInputs] = useState({ name: "", price: "" });
  const [open, setOpen] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [roleState, setroleset] = useState();
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));

  useEffect(() => {
    setIsAddMode(id ? true : false);
  }, [id]);
  // form validation rules
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required(" Name is required"),
    name: Yup.string().strict(true).required(" Name is required").matches(/^\S.*$/gm, '* This field cannot contain only blankspaces'),
  });
  const editvalidationSchema = Yup.object().shape({
    name: Yup.string().strict(true).required(" Name is required").matches(/^\S.*$/gm, '* This field cannot contain only blankspaces'),
    // name: Yup.string().required(" Name is required"),
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
      mid: query.id,
      name: data.name,
    };

    return menuService
      .createSubMenu(data)
      .then((data) => {
        alertService.success(data.message, { keepAfterRouteChange: true });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    data = {
      mid: query.id,
      name: data.name,
    };
    return menuService
      .updateSubMenu(id, data)
      .then((response) => {
        alertService.success(response.message, {
          keepAfterRouteChange: true,
        });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  return (
    <>
      <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          {!isAddMode ? (
            <Modal.Title>Add Sub Menu</Modal.Title>
          ) : (
            <Modal.Title>Edit Sub Menu</Modal.Title>
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
    </>
  );
};

export default AddSubMenu;
