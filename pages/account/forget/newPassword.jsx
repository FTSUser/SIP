import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "../Forget/forget.module.scss";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";
import classNames from "classnames";
export default NewPassword;

function NewPassword(props) {
  const router = useRouter();
  const { query } = useRouter();
  // form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string()
    .transform((x) => (x === "" ? undefined : x))
    .concat(Yup.string().required("Password is required"))
    .min(6, "Password must be at least 6 characters"),
    passwordConfirmation: Yup.string().test(
      "passwords-match",
      "Password must match",
      function (value) {
        return this.parent.password === value;
      }
    ),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ password }) {
    const data = {
      password: password,
      email: query.email,
    };
    return userService
      .forget(data)
      .then((res) => {
        alertService.success(res.message, {
          keepAfterRouteChange: true,
        });
        if (res) {
          router.push({
            pathname: "/account/login/login",
          });
        }
        // get return url from query parameters or default to '/'
      })
      .catch(alertService.error);
  }

  return (
    <Layout>
      <div className={Styles.loginCard}>
        <div className={Styles.loginCardBoxOne}>
          <div className={Styles.logo}>SIP</div>
          <div>
            <div className="py-2">Verify Code</div>
            <div>
              <div className="py-4">
                Have password?
                <span className={Styles.Signup}>
                  <Link href="/account/login/login">Log In</Link>
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>New Password <span>*</span></label>
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
                <label>Confirm Password <span>*</span></label>
                <input
                  name="passwordConfirmation"
                  type="password"
                  {...register("passwordConfirmation")}
                  className={`form-control ${
                    errors.passwordConfirmation ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.passwordConfirmation?.message}
                </div>
              </div>

              <button
                disabled={formState.isSubmitting}
                className={classNames(Styles.button, "btn", "mb-3")}
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                New Password
              </button>
            </form>
          </div>
        </div>
        <div className={Styles.loginCardBox}>
          <div className={Styles.welcome}>
            <div>
              <h2 className={Styles.welcomeHeading}>Welcome to SIP!</h2>
              <div className={Styles.welcomSubHeading}>
                Do not panic, we will guide you how and what to answer in your
                interview. If you are preparing for SIP
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
