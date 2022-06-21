import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "../Login/login.module.scss";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";
import classNames from "classnames";
export default SignIn;

function SignIn() {
  const router = useRouter();
  const { query } = useRouter();
  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ email, password }) {
    return userService
      .login(email, password)
      .then((res) => {
        alertService.success(res.message, { keepAfterRouteChange: true });
        // get return url from query parameters or default to '/'
        if(query.url && query.price && query.plan){
          router.push(`${query.url}?price=${query.price}&plan=${query.plan}`)
    
        }else{
        const returnUrl = "/";
        router.push(returnUrl);
      }
      })
      .catch(alertService.error);
  }

  return (
    <Layout>
      <div className={Styles.loginCard}>
        <div className={Styles.loginCardBoxOne}>
          <div className={Styles.logo}>Log In</div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Username <span>*</span></label>
                <input
                  name="email"
                  type="text"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
              <div className="form-group">
                <label>Password <span>*</span></label>
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
              <div className="text-right py-2">
                <Link href="/account/forget/forget">forgot Your Password?</Link>
              </div>
              <button disabled={formState.isSubmitting}>
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Log In
              </button>
              <div>
                <span>Dont have account?&nbsp;&nbsp;</span>
                <span className={Styles.Signup}>
                  <Link href="/account/register/register">Sign Up</Link>
                </span>
              </div>
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
