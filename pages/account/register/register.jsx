import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "../Register/register.module.scss";
import classNames from "classnames";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";


export default Register;

function Register() {
  const router = useRouter();
  const { query } = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    fname: Yup.string().strict(true).required(" First Name is required").matches(/^\S.*$/gm, '* This field cannot contain only blankspaces'),
    lname: Yup.string().strict(true).required(" Last Name is required").matches(/^\S.*$/gm, '* This field cannot contain only blankspaces'),

    // fname: Yup.string().required("First Name is required"),
    // lname: Yup.string().required("Last Name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    phone: Yup.string().required("Phone Number is required"),
    // role: Yup.string().required("Role is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .concat(Yup.string().required("Password is required"))
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(user) {
    const data = {
      fname: user.fname,
      zipCode: user?.zipCode,
      city: user?.city,
      state: user?.state,
      companyAddress: user?.companyAddress,
      company: user?.company,
      lname: user.lname,
      password: user.password,
      email: user.email,
      phone: user.phone,
      isActive:true,
      role: "61aa0369803e260c3821ad0a",
    };

    return userService
      .register(data)
      .then(() => {
        alertService.success(data.message, { keepAfterRouteChange: true });
        if(query.url && query.price && query.plan){
          router.push(`/account/login/login?url=${query.url}&price=${query.price}&plan=${query.plan}`)
    
        }else{
          router.push("/account/login/login")
        }
      })
      .catch(alertService.error);
  }

  const redirectToLogin = () =>{
    if(query.url && query.price && query.plan){
      router.push(`/account/login/login?url=${query.url}&price=${query.price}&plan=${query.plan}`)

    }else{
      router.push("/account/login/login")
    }
  }

  return (
    <Layout>
      <div className={Styles.loginCard}>
        <div className={Styles.loginCardBoxOne}>
          {/* <div className={Styles.logo}>SIP</div> */}
          <div className={Styles.logo}>Sign Up</div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={Styles.cusFormGrid}>
                <div className=" ">
                  <label>First Name <span>*</span> </label>
                  <input
                    name="fname"
                    type="text"
                    {...register("fname")}
                    className={`form-control ${errors.fname ? "is-invalid" : ""
                      }`}
                  />
                  <div className="invalid-feedback">
                    {errors.fname?.message}
                  </div>
                </div>
                <div className=" ">
                  <label>Last Name <span>*</span> </label>
                  <input
                    name="lname"
                    type="text"
                    {...register("lname")}
                    className={`form-control ${errors.lname ? "is-invalid" : ""
                      }`}
                  />
                  <div className="invalid-feedback">
                    {errors.lname?.message}
                  </div>
                </div>
             
   
                <div className=" ">
                  <label>Email <span>*</span></label>
                  <input
                    name="email"
                    type="text"
                    {...register("email")}
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>
                <div className="form-group ">
                  <label>Password <span>*</span></label>
                  <input
                    name="password"
                    type="password"
                    {...register("password")}
                    className={`form-control ${errors.password ? "is-invalid" : ""
                      }`}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
              
              <div className=" ">
                <label>Company  </label>
                <input
                  name="company"
                  type="text"
                  {...register("company")}
                  className={`form-control ${errors.company ? "is-invalid" : ""
                    }`}
                />
                {/* <div className="invalid-feedback">
                    {errors.company?.message}
                  </div> */}
              </div>
              <div className=" ">
                <label>Company address  </label>
                <input
                  name="companyAddress"
                  type="text"
                  {...register("companyAddress")}
                  className={`form-control ${errors.companyAddress ? "is-invalid" : ""
                    }`}
                />
                {/* <div className="invalid-feedback">
                    {errors.companyAddress?.message}
                  </div> */}
              </div>
              <div className=" ">
                <label>City  </label>
                <input
                  name="city"
                  type="text"
                  {...register("city")}
                  className={`form-control ${errors.city ? "is-invalid" : ""
                    }`}
                />
                {/* <div className="invalid-feedback">
                    {errors.city?.message}
                  </div> */}
              </div>
              <div className=" ">
                <label>State  </label>
                <input
                  name="state"
                  type="text"
                  {...register("state")}
                  className={`form-control ${errors.state ? "is-invalid" : ""
                    }`}
                />
                {/* <div className="invalid-feedback">
                    {errors.state?.message}
                  </div> */}
              </div>
              <div className=" ">
                <label>Zip   </label>
                <input
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  maxLength={6}
                  name="zipcode"
                  type="text"
                  {...register("zipcode")}
                  className={`form-control ${errors.zipcode ? "is-invalid" : ""
                    }`}
                />
                {/* <div className="invalid-feedback">
                    {errors.zipcode?.message}
                  </div> */}
              </div>
              <div className="">
                <div className="form-group ">
                  <label>Phone<span>*</span></label>
                  <input
                    name="phone"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    maxLength={10}
                    type="text"
                    {...register("phone")}
                    className={`form-control ${errors.phone ? "is-invalid" : ""
                      }`}
                  />
                  <div className="invalid-feedback">
                    {errors.phone?.message}
                  </div>
                </div>
              </div>
              </div>
              <div className={Styles.resiterButtonDesign}>
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="btn btn-primary mr-2"
                >
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Sign Up
                </button>
                {/* <button
                onClick={() => reset(formOptions.defaultValues)}
                type="button"
                disabled={formState.isSubmitting}
                className="btn btn-secondary"
              >
                Reset
              </button> */}
              </div>
              <div>
                  <span>Already have account?&nbsp;&nbsp;</span>
                  <span className={Styles.Signup} onClick={()=>redirectToLogin()}>
                    <Link href="/account/login/login">Log In</Link>
                  </span>
                </div>
            </form>
          </div>
        </div>
        {/* <div className={Styles.loginCardBox}>
          <div className={Styles.welcome}>
            <div>
              <h2 className={Styles.welcomeHeading}>Welcome to SIP!</h2>
              <div className={Styles.welcomSubHeading}>
                Do not panic, we will guide you how and what to answer in your
                interview. If you are preparing for SIP
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}
