import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { adminService, alertService, userService } from "services";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router from "next/router";

const AddAdmin = ({ onClose, getData, id }) => {
  const [inputs, setInputs] = useState({ name: "", email: "" });
  const [open, setOpen] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  // const [roleData, getAllRoles] = useState([]);

  const [roleState, setroleset] = useState();
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));

  useEffect(() => {
    const getData = async () => {
      showLoader();
      await adminService.getAllRole().then((response) => {
        hideLoader();
        // getAllRoles(response.payload.admin);
        setroleset(response?.payload?.admin);
      });
    };

    getData();
  }, []);
  useEffect(() => {
    setIsAddMode(id ? true : false);
  }, [id]);
  // form validation rules
  const validationSchema = Yup.object().shape({
    // fname: Yup.string().required("First Name is required"),
    fname: Yup.string()
      .strict(true)
      .required("First Name is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
    lname: Yup.string()
      .strict(true)
      .required(" Last Name is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
    // lname: Yup.string().required("Last Name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    phone: Yup.string().required("Phone Number is required"),
    // role: Yup.string().required("Role is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .concat(isAddMode ? null : Yup.string().required("Password is required"))
      .min(6, "Password must be at least 6 characters"),
  });
  const editvalidationSchema = Yup.object().shape({
    fname: Yup.string()
      .strict(true)
      .required("First Name is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
    lname: Yup.string()
      .strict(true)
      .required(" Last Name is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    phone: Yup.string().required("Phone Number is required"),
    // password: Yup.string()
    //   .transform((x) => (x === "" ? undefined : x))
    //   .concat(isAddMode ? null : Yup.string().required("Password is required"))
    //   .min(6, "Password must be at least 6 characters"),
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
    return !isAddMode ? createUser(data) : updateUser(id?._id, data);
  }

  function createUser(data) {
    const datas = {
      email: data?.email,
      fname: data?.fname,
      lname: data?.lname,
      password: data?.password,
      phone: data?.phone,
      role: "61aa0369803e260c3821ad0a",
    };
    return userService
      .register(datas)
      .then((data) => {
        alertService.success(data.message, { keepAfterRouteChange: true });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    const datas={
      email: data?.email,
      fname: data?.fname,
      lname: data?.lname,
      password: data?.password,
      phone: data?.phone,
      role: "61aa0369803e260c3821ad0a",
    }
    return userService
      .update(id, datas)
      .then((response) => {
        alertService.success(response.message, { keepAfterRouteChange: true });
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
            <Modal.Title>Add Admin</Modal.Title>
          ) : (
            <Modal.Title>Edit Admin</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body id="add-contact-modal">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group col">
                <label>
                  First Name <span>*</span>
                </label>
                <input
                  name="fname"
                  type="text"
                  {...register("fname")}
                  className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.fname?.message}</div>
              </div>
              <div className="form-group col">
                <label>
                  Last Name <span>*</span>
                </label>
                <input
                  name="lname"
                  type="text"
                  {...register("lname")}
                  className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.lname?.message}</div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <label>
                  Email <span>*</span>
                </label>
                <input
                  name="email"
                  type="text"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
              <div className="form-group col">
                <label>
                  Password <span>*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  {...register("password")}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <label>
                  Phone <span>*</span>
                </label>
                <input
                  name="phone"
                  type="text"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  maxLength={10}
                  {...register("phone")}
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.phone?.message}</div>
              </div>
              {!isAddMode ? (
                <div className="form-group col">
                  <>
                    <label>
                      Role <span>*</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      name="admin"
                      placeholder="admin"
                      className={`form-control `}
                    />
                    {/* <select
                      name="role"
                      type="text"
                      {...register("role")}
                      className={`form-control ${
                        errors.role ? "is-invalid" : ""
                      }`}
                    >
                      <option selected disabled value="">
                        Role
                      </option>
                      
                          <option key={roleState?._id} value={roleState?._id}>
                            {roleState?.roleName}
                          </option>
                        
                    </select> */}
                  </>
                  {/* <div className="invalid-feedback">{errors.role?.message}</div> */}
                </div>
              ) : (
                <></>
              )}
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
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addContact}>
            Add Contact
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AddAdmin;
