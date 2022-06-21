import LandingHeader from "./LandingHeader/LandingHeader";
import styles from "../Landing/landing.module.scss";
const HeroImage = "/assets/images/hero.webp";
const MockInterView = "/assets/images/mock-interview.png";
const fourtyFour = "/assets/images/44.png";
const thirtythrww = "/assets/images/33.png";
const Reviewbanner = "/assets/images/review.webp";
const SipIcon = "/assets/images/sip-icon.svg";
const HiredIcon = "/assets/images/hired.svg";
const CareerAdvisor = "/assets/images/career-advisor.webp";
const EarnIcon = "/assets/images/Accelerate.svg";
const AccountingIcon = "/assets/images/accounting.svg";
const ColonIcon = "/assets/images/colon.webp";
const p1 = "/assets/images/p1.png";
const StepOne = "/assets/images/number-one.png";
const StepTwo = "/assets/images/number-2.png";
const StepThree = "/assets/images/number-3.png";
const NewIcon = "/assets/images/new-icon.svg";
const PutIcon = "/assets/images/put-icon.svg";
const PeofileImage = "/assets/images/profile-inte.webp";
const VideoIcon = "/assets/images/video-icon.svg";
const FacebookIcon = "/assets/images/facebook.png";
const InstagramIcon = "/assets/images/instagram.png";
const TwitterIcon = "/assets/images/twitter.png";
const GetTheJob = "/assets/images/get-the-job.svg";
const LeftArrow = "/assets/images/next.png";
const save = "/assets/images/new-icon.png";
const reduce = "/assets/images/put-icon.png";
const make = "/assets/images/Accelerate.png";

import { alertService, menuService } from "services";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Head from "next/head";

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "components";
import { useRef } from "react";
import { useRouter } from "next/router";

function Landing() {
  const [category, setCategory] = useState([]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .strict(true)
      .required(" Name is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    subject: Yup.string()
      .strict(true)
      .required("Subject is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
    message: Yup.string()
      .strict(true)
      .required("Message is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const router = useRouter();

  function onSubmit({ name, email, subject, message }) {
    const data = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };
    return menuService
      .contact(data)
      .then((response) => {
        alertService.success(response.message, { keepAfterRouteChange: true });
        reset(formOptions.defaultValues);
      })
      .catch(alertService.error);
  }

  const redirectToRegister = (price, plan) => {
    router.push(
      `/account/register/register?url=/menu/menu&price=${price}&plan=${plan}`
    );
  };

  const getCategory = () => {
    menuService.getAllGuideCategory().then((response) => {
      setCategory(response.payload.interviewCategory);
    });
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <Head>
        <title>SIP Interview - Landing </title>
        <meta
          name="description"
          content="Meta description for the Landing Page"
        />
      </Head>
      <>
        <LandingHeader />
      </>

      <section className={styles.masterHeroBanner} id="home">
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <h1>
                Save time by using customized Interview Guides for your open
                positions.
              </h1>
              <p>
                Keep your hiring managers focused on using the same criteria to
                select the best candidate.
              </p>
              <button>Learn More</button>
            </div>
            <div className={styles.gridItems}>
              <img src={HeroImage} alt="HeroImage" />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.mockInterViewSection}>
        <div className="new-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <img src={fourtyFour} alt="MockInterView" />
            </div>
            <div className={styles.gridItems}>
              <div className={styles.topBar}></div>
              <h1>Create an exceptional and consistent hiring experience.</h1>
              <p>
                Take the hodgepodge out of the hiring process by incorporating
                job specific interview guides for each phase of the hiring
                process.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.practiceBanner}>
        <div className="new-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <div className={styles.topBar}></div>
              <h1>
                Give your hiring managers the appropriate tools to empower them
                to make the right hiring decisions.
              </h1>
              <p>
                Stop asking interview questions off-the-cuff or, trolling the
                internet in search of finding questions to ask during the
                interview. Aim Hire Consulting provides you with complete
                interview guides that have pre-planned questions to address
                competencies needed to be successful on the job. Plus, you will
                receive a customized evaluation rating scale to measure all
                candidates equally resulting in the elimination of racial and
                personal biases.
              </p>
            </div>
            <div className={styles.gridItems}>
              <img src={thirtythrww} alt="Practicebanner" />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.reviewSectionAlignment}>
        <div className="new-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <img src={MockInterView} alt="Reviewbanner" />
            </div>
            <div className={styles.gridItems}>
              <div className={styles.topBar}></div>
              <h1>
                Systemize your organizations interview process to optimize the
                candidate experience and improve your brand.
              </h1>
              <p>
                Create a great first impression from the beginning of the hiring
                process and improve your company’s brand by using the customized
                interview guides.
              </p>
              <button>Get Started</button>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.newBanner}>
        <div className="new-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <img src={SipIcon} alt="SipIcon" style={{ height: "109px" }} />
              <h1>
                Meet your organizations legal
                <br />
                guidelines for fair employment
                <br />
                practices
              </h1>
              {/* <p>
                We give you everything you need to master your interview skills
                in less time than any other option, so you can walk into your
                interview with confidence.
              </p>
              <a>Get Started</a> */}
            </div>
            <div className={styles.gridItems}>
              <img src={HiredIcon} alt="HiredIcon" />
              <h1>
                Find a better skill-fit by asking consistent questions and
                rating candidates using the same criteria
              </h1>
              {/* <p>
                Our simulator is optimized to help you master your interview
                skills in the most efficient way possible, so you can be
                prepared to ace the interview in no time.
              </p>
              <a>Get Started</a> */}
            </div>
            <div className={styles.gridItems}>
              <img src={EarnIcon} alt="EarnIcon" />
              <h1>A better skill-fit reduces high turnover</h1>
              {/* <p>
                Master the skill of interviewing by practicing it just like you
                practice your trade and give your career a boost.
              </p>
              <a>Get Staeted</a> */}
            </div>
            <div className={styles.gridItems}>
              <img src={EarnIcon} alt="EarnIcon" />
              <h1>{`Make life easier for your hiring managers by saving time.

`}</h1>
              {/* <p>
                Gain realistic interview experience and master the skills you
                need to wow your employers and beat out the competition.
              </p>
              <a>Get Staeted</a> */}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.careerSectionAlignment}>
        <div className="new-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              {/* <span>FOR CAREER ADVISORS</span> */}
              <h1> How it works</h1>
              {/* <p>
                Provide simulated interviews they can conduct on their own. No
                need to schedule, commute, or meet in person.
              </p> */}
              <button>Learn More</button>
            </div>
            <div className={styles.gridItems}>
              <img src={CareerAdvisor} alt="CareerAdvisor" />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.careerSectionAlignment}>
        {/* <iframe
          width="100%"
          height="515"
          src="https://www.youtube.com/embed/HG68Ymazo18?autoplay=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe> */}
        <iframe
        width="100%"
        height="515"
          src="https://www.youtube.com/embed/TQHW7gGjrCQ?autoplay=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        {/* <video
          className={styles.video}
          autoPlay
          controls
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        ></video> */}
      </section>
      <section className={styles.buildBanner}>
        <div className="container">
          <div className={styles.hiringTitle}>
            <h1>
              Stop basing your hiring decisions solely on a gut feeling and
              start standardizing your hiring process:
            </h1>
          </div>
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <div className={styles.iconCenterAlignment}>
                <img src={StepOne} alt="StepOne" />
              </div>
              <h1>Phone or first-round interview</h1>
              <p>
                To ensure the candidate meets the minimum requirements for the
                position
              </p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.iconCenterAlignment}>
                <img src={StepTwo} alt="StepTwo" />
              </div>
              <h1>Second interview</h1>
              <p>A deeper dive to ensure that the candidate can do the job</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.iconCenterAlignment}>
                <img src={StepThree} alt="StepThree" />
              </div>
              <h1>Third interview (optional)</h1>
              <p>
                An even deeper dive to ensure you have selected the best
                possible candidate
              </p>
            </div>
          </div>
          <div className={styles.childTextAlignment}>
            <p>
              You can purchase the interview guides separately or in a bundle
              depending on your needs. Stop making up interview questions on the
              fly or trolling the internet searching for interview questions and
              let us do the heaving lifting.
            </p>
            <p>
              To learn more about our services and solutions, and to find out
              how we can help you lower your hiring costs, watch the demo or
              contact us today.
            </p>
          </div>
        </div>
      </section>
      {/* <section className={styles.allInterViewAlignment}>
        <div className="cus-container">
          <div className={styles.boxGrid}>
            <div className={styles.boxGridItems}>
              <p>Administrative Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Project Management Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Managers Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Retail Sales Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Customer Service Interview Goal</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Financial Analyst Interview Guide</p>
            </div>
          </div>
        </div>
      </section> */}
      <section className={styles.mockInterviewAlignment}>
        <div className="new-container">
          <div className={styles.topBarAlignment}>
            <div className={styles.topBar}></div>
          </div>
          <h1>
            Choose from an ever growing selection of interview guides covering a
            variety of industry job titles.
          </h1>
          <div className={styles.grid}>
            {category?.map((data, i) => {
              return (
                <div
                  key={i}
                  className={styles.gridItems}
                  onClick={() =>
                    router.push(`/account/landing/detailid?id=${data?._id}`)
                  }
                >
                  <div className={styles.imageCenterAlign}>
                    <img src={data?.image} alt="AccountingIcon" />
                  </div>
                  <p>{data?.name}</p>
                </div>
              );
            })}
          </div>
          <div className="globalButton">
            <button onClick={() => router.push("/account/landing/detail")}>
              View All <img src={LeftArrow} alt="" />{" "}
            </button>
          </div>
        </div>
      </section>

      {/* <section className={styles.getTheGuarantee}>
        <div className="new-container">
          
          <div className={styles.jetTheJobAlignment}>
            <img src={GetTheJob} alt="GetTheJob" />
          </div>
          <div className={styles.pageTitle}>
            <h1>Our Promise to You</h1>
            <div>
              <p>
                {`We're so confident we can get you interview-ready, we're introducing our interview guidelines. If you don't get the job, we'll give you your money back. Guaranteed.`}
              </p>
            </div>
          </div>
        </div>
      </section> */}
      {/* <section className={styles.legBanner}>
        <div className="new-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <img src={Reviewbanner} alt="Reviewbanner" />
            </div>
            <div className={styles.gridItems}>
              <div className={styles.topBar}></div>
              <h1>Get a leg up with our training program.</h1>
              <p>{`Our training program will teach you how to ace the interview and exceed your interviewer's expectations. From preparation to negotiation, we've got you covered.`}</p>
              <button>Learn More</button>
            </div>
          </div>
        </div>
      </section> */}
      <section className={styles.pricingOrderSectionAlignment} id="price">
        <div className="cus-container">
          <div className={styles.pageTitle}>
            <h1>Pricing & Order Details</h1>
          </div>
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <h1>Individual Guides </h1>
              <p>Includes a single guide and Evaluation Template</p>
              <h2>$75.00</h2>

              <button onClick={() => redirectToRegister(75, 1)}>Buy Now</button>
            </div>
            {/* <div className={styles.gridItems}>
              <h1>Bundle 2 Individual Guides</h1>
              <p>
                Includes two guides 1<sup>st</sup> and 2<sup>nd</sup> and
                Evaluation Template
              </p>
              <h2>$150.00 @ 20% off $120.00</h2>
              <button onClick={() => redirectToRegister(120, 2)}>
                Buy Now
              </button>
            </div>
            <div className={styles.gridItems}>
              <h1>Bundle 3 Guides</h1>
              <p>
                Includes all 3 guides 1<sup>st</sup> and 2<sup>nd</sup> and
                Final Interview Guides and Evaluation Template
              </p>
              <h2>$225.00 @ 30% $157.00</h2>
              <button onClick={() => redirectToRegister(157, 3)}>
                Buy Now
              </button>
            </div> */}
          </div>
        </div>
      </section>
      <section className={styles.testiBanner}>
        <div className="new-container">
          <div className={styles.colonAlignment}>
            <img src={ColonIcon} alt="ColonIcon" />
          </div>
          <div className={styles.textCenterAlignBox}>
            <div className={styles.textBox}>
              <p>
                {`"I’m a new HR manager for a start-up.  Business is growing which means that I have to hire for a variety of positions quickly. Time is of the essence, so I don’t have a lot of time to spend on training new supervisors how to hire the best candidates. While searching the internet for examples of interview questions that my supervisors can use, I came across Aim Hire Consulting Interview Guides.  These guides are complete with pre-planned interview questions for many of the positions that I was hiring for. Using the guides, made the hiring process go much more smoothly resulting in a great candidate experience, and helping my managers to select the best candidate."`}
              </p>
              <div className={styles.profileGrid}>
                <div className={styles.profileGridItems}>
                  <img src={PeofileImage} alt="PeofileImage" />
                </div>
                <div className={styles.profileGridItems}>
                  <p>-Marlene Tillman, Digital Marketer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.aboutSectionAlignment} id="aboutus">
        <div className="cus-container">
          <div className={styles.pageTitle}>
            <h1>About Us</h1>
            <p>
              Aim Hire Consulting is a recruiting-based software aimed at
              helping the interviewer make better hiring decisions. Whether you
              are Human Resources, or a hiring manager, the interview guides
              have been created using customized suggestions to guide you
              through the interview process. Each interview guide contains
              built-in, job relevant questions for the interviewer to ask during
              each stage of the hiring process. A customized evaluation rating
              scale is included to help you get consistent results, thus
              eliminating hiring biases.
            </p>
            <p>
              Most hiring managers, (especially newly promoted) are not trained
              on how to conduct effective interviews and are left basing hiring
              decisions solely on a gut feeling. Even more, most managers are
              given the responsibility to interview, and are not provided with
              the proper tools to make one of the most important decisions a
              company can make, and that is hiring the right person for the job.
            </p>
            <p>
              Consequences of a bad hire can be costly. According to the U.S.
              Department of Labor, the average cost for each bad hire can equal
              30 percent of that individual’s annual earnings. Thus, when you
              hire the wrong mid-level accounting manager or application
              developer earning $60,000, the real cost to your organization will
              be $78,000. Bad hires not only affect the bottom line. Hiring the
              wrong person also affects productivity, and morale.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.threeBoxBanner}>
        <div className="cus-container">
          <div className={styles.grid}>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={save} alt="NewIcon" />
              </div>
              <h1>Save time</h1>
              {/* <p>
                Take unlimited mock interviews whenever you want, wherever you
                want.
              </p> */}
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={reduce} alt="NewIcon" />
              </div>
              <h1>Reduce turnover</h1>
              {/* <p>
                We raise the stakes by recording your responses to create
                realistic interview pressure.
              </p> */}
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={make} alt="VideoIcon" />
              </div>
              <h1>Make better hires</h1>
              {/* <p>
                Know exactly how you came across and refine your approach to
                nail the interview.
              </p> */}
            </div>
          </div>
        </div>
      </section>
      <section className={styles.contactSectionAlignment} id="contact">
        <div className="new-container">
          <div className={styles.pageTitle}>
            <h1>Contact Us</h1>
          </div>
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row ">
              <div className="form-group col">
                <div className={styles.formControl}>
                  <label>
                    Name <span>*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    {...register("name")}
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
              <div className="form-group col">
                <div className={styles.formControl}>
                  <label>
                    Email <span>*</span>
                  </label>
                  <input
                    name="email"
                    type="text"
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <div className={styles.formControl}>
                  <label>
                    Subject <span>*</span>
                  </label>
                  <input
                    name="subject"
                    type="text"
                    {...register("subject")}
                    className={`form-control ${
                      errors.subject ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.subject?.message}
                  </div>
                </div>
              </div>
              <div className="form-group col">
                <div className={styles.formControl}>
                  <label>
                    Message <span>*</span>
                  </label>
                  <textarea
                    id="w3review"
                    name="message"
                    {...register("message")}
                    className={`form-control ${
                      errors.message ? "is-invalid" : ""
                    }`}
                  ></textarea>
                  <div className="invalid-feedback">
                    {errors.message?.message}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.saveButtonAlignment}>
              <button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
      <section className={styles.footerDesign}>
        <div className="new-container">
          <div className={styles.footerMenuAlignment}>
            <ul>
              <li>Blog</li>
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Support & How-To Videos</li>
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div className={styles.socialIconAlignment}>
            <img src={FacebookIcon} alt="FacebookIcon" />
            <img src={InstagramIcon} alt="InstagramIcon" />
            <img src={TwitterIcon} alt="TwitterIcon" />
          </div>
          <div className={styles.copyRightText}>
            <p>
              © 2022 SIP Interview Practice, All Rights Reserved. | 1732 1st
              Avenue #21030, New York, NY 10128
            </p>
          </div>
        </div>
      </section>
      {/* <div className={styles.heroBanner} id="homeSection">
        <div className="cus-container">
          <div className={styles.heroBannerText}>
            <p>
              Save time by using customized Interview Guides for your open
              positions.
            </p>
            <p>Create an exceptional and consistent hiring experience</p>
            <p>
              Keep your hiring managers focused on using the same criteria to
              select the best candidate.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.boxAlignment}>
        <div className="cus-container">
          <div className={styles.boxGrid}>
            <div className={styles.boxGridItems}>
              <p>Administrative Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Project Management Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Managers Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Retail Sales Interview Guide</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Customer Service Interview Goal</p>
            </div>
            <div className={styles.boxGridItems}>
              <p>Financial Analyst Interview Guide</p>
            </div>
          </div>
        </div>
      </div>
      <section className={styles.aboutUsSectionAlignmnent} id="about-us">
        <div className="cus-container">
          <div className={styles.textGrid}>
            <div className={styles.textGridItems}>
              <h3 className="py-3 text-center">About Us</h3>
              <p>
                Aim Hire Consulting is a recruiting-based software aimed at
                helping the interviewer make better hiring decisions. Whether
                you are Human Resources, or a hiring manager, the interview
                guides have been created using customized suggestions to guide
                you through the interview process. Each interview guide contains
                built-in, job relevant questions for the interviewer to ask
                during each stage of the hiring process. A customized evaluation
                rating scale is included to help you get consistent results,
                thus eliminating hiring biases.
              </p>
              <p>
                Most hiring managers, (especially newly promoted) are not
                trained on how to conduct effective interviews and are left
                basing hiring decisions solely on a gut feeling. Even more, most
                managers are given the responsibility to interview, and are not
                provided with the proper tools to make one of the most important
                decisions a company can make, and that is…... hiring the right
                person for the job.
              </p>
              <p>
                Consequences of a bad hire can be costly. According to the U.S.
                Department of Labor, the average cost for each bad hire can
                equal 30 percent of that individual’s annual earnings. Thus,
                when you hire the wrong mid-level accounting manager or
                application developer earning $60,000, the real cost to your
                organization will be $78,000. Bad hires not only affect the
                bottom line. Hiring the wrong person also affects productivity,
                and morale.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.processSectionAlignment}>
        <div className="cus-container">
          <div className={styles.processText}>
            <h3>
              Stop basing your hiring decisions solely on a gut feeling and
              start standardizing your hiring process:
            </h3>
          </div>
          <div className={styles.processGrid}>
            <div className={styles.processGridItems}>
              <h4>Phone or first-round interview</h4>
              <p>
                To ensure the candidate meets the minimum requirements for the
                position
              </p>
            </div>
            <div className={styles.processGridItems}>
              <h4>Second interview</h4>
              <p>A deeper dive to ensure that the candidate can do the job</p>
            </div>
            <div className={styles.processGridItems}>
              <h4>Third interview (optional)</h4>
              <p>
                An even deeper dive to ensure you have selected the best
                possible candidate
              </p>
            </div>
          </div>
          <div className={styles.childTextAlignment}>
            <p>
              You can purchase the interview guides separately or in a bundle
              depending on your needs. Stop making up interview questions on the
              fly or trolling the internet searching for interview questions and
              let us do the heaving lifting.
            </p>
            <p>
              To learn more about our services and solutions, and to find out
              how we can help you lower your hiring costs, watch the demo or{" "}
              <span>contact us today</span>.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.contactSectionAlignmnet} id="contactUs">
        <div className="cus-container">
          <div className={styles.contactGrid}>
            <div className={styles.contactGridItems}>
              <div className="text-center">
                <p className="mb-2">Contact Us</p>
                <h1 className="mb-2">
                  Do You Have Any Questions? We’ll Be Happy To Assist!
                </h1>
              </div>

              <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row ">
                  <div className="form-group col">
                    <div className={styles.formControl}>
                      <label>Name</label>
                      <input
                        name="name"
                        type="text"
                        {...register("name")}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-group col">
                    <div className={styles.formControl}>
                      <label>Email</label>
                      <input
                        name="email"
                        type="text"
                        {...register("email")}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col">
                    <div className={styles.formControl}>
                      <label>Subject</label>
                      <input
                        name="subject"
                        type="text"
                        {...register("subject")}
                        className={`form-control ${
                          errors.subject ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.subject?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-group col">
                    <div className={styles.formControl}>
                      <label>Message</label>
                      <textarea
                        id="w3review"
                        name="message"
                        {...register("message")}
                        className={`form-control ${
                          errors.message ? "is-invalid" : ""
                        }`}
                      ></textarea>
                      <div className="invalid-feedback">
                        {errors.message?.message}
                      </div>
                    </div>
                  </div>
                </div>

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
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.pricingSectionAlignment} id="pricingSection">
        <div className="cus-container">
          <div className={styles.pageTitle}>
            <h1>Pricing & Order Details</h1>
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.cardGridItems}>
              <h1>Individual Guides </h1>
              <p>Includes a single guide and Evaluation Template</p>
              <h2>$75.00</h2>
            </div>
            <div className={styles.cardGridItems}>
              <h1>Bundle 2 Individual Guides</h1>
              <p>
                Includes two guides <sup>1</sup>st and <sup>2</sup>nd and
                Evaluation Template
              </p>
              <h2>$150.00 @ 20% off $130.00</h2>
            </div>
            <div className={styles.cardGridItems}>
              <h1>Bundle 3 Guides</h1>
              <p>
                Includes all 3 guides <sup>1</sup>st, <sup>2</sup>nd, and Final
                Interview Guides and Evaluation Template
              </p>
              <h2>$225.00 30% @$195.00</h2>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.termsAndCondistionSection} id="terms">
        <div className="cus-container">
          <div className={styles.textGrid}>
            <div>
              <h4 className="py-3 text-center">
                Terms and Conditions | Privacy Policy
              </h4>
              <h5>Copyright AimHireConsultant – 2021. All rights reserved</h5>
              <p>Reach Us At support@ahc.com</p>
              <p>Customer Support xxx xxx-xxxx</p>
              <p>
                <a href="#about-us">About Us</a>
              </p>
              <p>
                <a>Blog</a>
              </p>
              <p>
                <a href="#pricingSection">Pricing</a>
              </p>
              <p>Careers at AHC</p>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}

export default Landing;
