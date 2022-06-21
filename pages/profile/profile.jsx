import useFullPageLoader from "components/hooks/useFullPageLoader";
import React, { useEffect, useState } from "react";
import { adminService, alertService, userService } from "services";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

function Profile() {
  const [inputs, setInputs] = useState({ name: "", email: "" });
  const [open, setOpen] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.payload?.admin?._id;
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin;
  const [localData, setRole] = useState(role);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  useEffect(() => {
    if (!userId) return;
    getData(userId);
    setIsAddMode(localData?._id ? true : false);
  }, [localData?._id]);

  // const [roleData, getAllRoles] = useState([]);

  const [roleState, setroleset] = useState();
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));

  const getData = async (id) => {
    showLoader();
    await userService.getadminById(id).then((response) => {
      hideLoader();
      if (response?.payload?.admin) {
        // response.payload.admin = response?.payload?.admin[0];
        // getAllRoles(response.payload.admin);
        localStorage.setItem("user", JSON.stringify(response));
        setroleset(response?.payload?.admin);
      }
    });
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    phone: Yup.string().required("Phone Number is required"),
  });
  const editvalidationSchema = Yup.object().shape({
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    phone: Yup.string().required("Phone Number is required"),
  });
  const formOptions = {
    resolver: isAddMode
      ? yupResolver(editvalidationSchema)
      : yupResolver(validationSchema),
  };

  // set default form values if in edit mode
  if (isAddMode) {
    formOptions.defaultValues = localData;
  }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return !isAddMode ? createUser(data) : updateUser(localData?._id, data);
  }

  function createUser(data) {
    return userService
      .register(data)
      .then(() => {
        alertService.success(data.message, { keepAfterRouteChange: true });
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    return userService
      .update(id, data)
      .then((response) => {
        getData();
        alertService.success(response.message, { keepAfterRouteChange: true });
      })
      .catch(alertService.error);
  }
  return (
    <>
      <div className=" w-100 p-5 heightAuto">
        <div className="row">
          <div className="col-md-12">
            <h2>Profile</h2>
          </div>
          <div className="col-md-5 mt-5">
            <div className="card">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>
                    First Name <span>*</span>
                  </label>
                  <input
                    name="fname"
                    type="text"
                    defaultValue={roleState?.fname}
                    {...register("fname")}
                    className={`form-control ${
                      errors.fname ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.fname?.message}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Last Name <span>*</span>
                  </label>
                  <input
                    name="lname"
                    type="text"
                    defaultValue={roleState?.lname}
                    {...register("lname")}
                    className={`form-control ${
                      errors.lname ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.lname?.message}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Phone <span>*</span>
                  </label>
                  <input
                    name="phone"
                    type="text"
                    defaultValue={roleState?.phone}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    maxLength={10}
                    {...register("phone")}
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.phone?.message}
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text "
                    defaultValue={roleState?.email}
                    disabled
                    className="form-control"
                  />
                </div>
                <button className="mainButton" type="submit">
                  {" "}
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
