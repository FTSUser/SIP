import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "../Forget/forget.module.scss";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";
import classNames from "classnames";
export default Forget;

function Forget() {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ email }) {
    return userService
      .checkmail(email)
      .then((res) => {
        alertService.success(res.message, {
          keepAfterRouteChange: true,
        });
        // get return url from query parameters or default to '/'
        if (res) {
          router.push({
            pathname: "/account/forget/verifyCode",
            query: { email: email },
          });
        }
      })
      .catch(alertService.error);
  }

  return (
    <Layout>
      <div className={Styles.loginCard}>
        <div className={Styles.loginCardBoxOne}>
          <div className={Styles.logo}>SIP</div>
          <div>
            <div className="py-2">forgot Your Password?</div>
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
                <label>Email <span>*</span></label>
                <input
                  name="email"
                  type="text"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>

              <button
                disabled={formState.isSubmitting}
                className={classNames(Styles.button, "btn", "mb-3")}
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Send Mail
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
