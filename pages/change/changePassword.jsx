import { Router, useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "../Change/changePassword.module.scss";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";
import classNames from "classnames";
export default ChangePassword;
import Head from "next/head";

function ChangePassword() {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string().required("password is required"),
    // newPassword: Yup.string().required("new password is required"),
    newPassword: Yup
    .string()
    .required('Please Enter your password')
    ,
  confirmPassword: Yup.string()
  .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ password, newPassword }) {
    return userService
      .change(password, newPassword)
      .then((res) => {
        if (res.result === 0) {
          alertService.success(res.message, { keepAfterRouteChange: true });
          // get return url from query parameters or default to '/'
          localStorage.removeItem("user");
          alertService.success("Logout Successfull", {
            keepAfterRouteChange: true,
          });
          router.push("./account/landing/landing");
        } else {
          alertService.error("Your Old Password is not Valid or correct", {
            keepAfterRouteChange: true,
          });
        }
      })
      .catch(alertService.error);
  }

  return (
    <>
      <Head>
        <title>SIP Interview - Change Password</title>
        <meta
          name="description"
          content="Meta description for the Chane Password Page"
        />
      </Head>

      <div className="heightAuto d-flexcenter">
        <div className="  p-5 ">
          <div className=" py-4 text-center">
            <h2>Change Password</h2>
          </div>
          <div className={Styles.loginCard}>
            <div className={Styles.loginCardBoxOne}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>Current Password</label>
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
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    {...register("newPassword")}
                    className={`form-control ${
                      errors.newPassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.newPassword?.message}
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                </div>

                <button disabled={formState.isSubmitting}>
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
