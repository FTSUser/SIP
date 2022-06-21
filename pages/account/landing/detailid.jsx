import LandingHeader from "./LandingHeader/LandingHeader";
import styles from "../Landing/landing.module.scss";
import { alertService, menuService } from "services";

const NewBanner = "/assets/images/new-banner.png";
const CounterOne = "/assets/images/counter.png";
const CounterTwo = "/assets/images/counter1.png";
const CounterThree = "/assets/images/counter2.png";
const FacebookIcon = "/assets/images/facebook.png";
const InstagramIcon = "/assets/images/instagram.png";
const TwitterIcon = "/assets/images/twitter.png";
import Head from "next/head";

import React, { useEffect, useState, useMemo } from "react";

import router, { useRouter } from "next/router";

function Details() {
  // form validation rules
  const [comment, setComments] = useState([]);
  const { query } = useRouter();

  // get functions to build form with useForm() hook

  useEffect(() => {
    getData();
  }, [query.id]);
  const getData = async () => {
    await menuService.getAllGuide(query.id).then((response) => {
      setComments(response.payload.interviewGuide);
    });
  };
  return (
    <>
      <Head>
        <title>SIP Interview - Details </title>
        <meta
          name="description"
          content="Meta description for the Details Page"
        />
      </Head>
      <>
        <LandingHeader />
      </>

      <section>
        <div className="container">
          {comment &&
            comment?.map((comments, key) => (
              <>
                <div className={styles.detailNewFlowId}>
                  <img src={comments?.image} alt="NewBanner" />
                </div>
                <div className={styles.firstDetails}>
                  <h1>{comments?.guide?.[0]?.name} </h1>
                  <p>{comments?.guide?.[0]?.description[0]?.description}</p>
                </div>
                <div className={styles.firstDetails}>
                  <h2>{comments?.guide?.[1]?.name} </h2>
                  <p>{comments?.guide?.[1]?.description[0]?.description}</p>
                </div>
                <div className={styles.firstDetails}>
                  <h2>{comments?.guide?.[2]?.name}</h2>
                  <div className={styles.buttonAlign}>
                    {comments?.guide?.[2]?.description?.map((item) => (
                      <button>{item?.description}</button>
                    ))}
                  </div>
                </div>

                <div className={styles.detailsStep}>
                  {comments?.guide?.[3] && (
                    <div className={styles.detailsStepItems}>
                      <div className={styles.imageCenterAlign}>
                        <img src={CounterOne} alt="CounterOne" />
                      </div>
                      <h2>{comments?.guide?.[3]?.name}</h2>
                      <p>{comments?.guide?.[3]?.description[0]?.description}</p>
                    </div>
                  )}
                  {comments?.guide?.[4] && (
                    <div className={styles.detailsStepItems}>
                      <div className={styles.imageCenterAlign}>
                        <img src={CounterTwo} alt="CounterOne" />
                      </div>
                      <h2>{comments?.guide?.[4]?.name}</h2>
                      <p>{comments?.guide?.[4]?.description[0]?.description}</p>
                    </div>
                  )}
                  {comments?.guide?.[5] && (
                    <div className={styles.detailsStepItems}>
                      <div className={styles.imageCenterAlign}>
                        <img src={CounterThree} alt="CounterOne" />
                      </div>
                      <h2>{comments?.guide?.[5]?.name}</h2>
                      <p>{comments?.guide?.[5]?.description[0]?.description}</p>
                    </div>
                  )}
                </div>
                <div className={styles.accountInterview}>
                  <h1>{comments?.guide?.[6]?.name} </h1>
                  <ul>
                    {comments?.guide?.[6]?.description?.map((item) => (
                      <li>{item?.description}</li>
                    ))}
                  </ul>
                </div>
              </>
            ))}
          {/* <div className={styles.detailNewFlowId}>
            <img src={NewBanner} alt="NewBanner" />
          </div>
          <div className={styles.firstDetails}>
            <h1>Account Executive </h1>
            <p>
              Use this Account Executive Interview Guide to seek the best
              candidate to manage your company’s entire sales cycle.
            </p>
          </div> */}
          {/* <div className={styles.firstDetails}>
            <h1>What does an Account Executive do? </h1>
            <p>
              An Account Executive is someone who can work in many fields and
              help grow their companies by finding leads and closing sales deals
              with existing clients or new prospects. They also act as
              intermediaries between other departments within an organization to
              ensure the success of their clients.
            </p>
          </div> */}
          {/* <div className={styles.firstDetails}>
            <h1>Some of the Competencies of an Account Executive include:</h1>
            <div className={styles.buttonAlign}>
              <button>Job Industry Knowledge</button>
              <button>Client relations</button>
              <button>Excellent communication skills</button>
              <button>Relationship building</button>
              <button>Collaboration</button>
              <button>Collaboration</button>
              <button>Teamwork</button>
              <button>Sales</button>
            </div>
          </div> */}
          {/* <div className={styles.detailsStep}>
            <div className={styles.detailsStepItems}>
              <div className={styles.imageCenterAlign}>
                <img src={CounterOne} alt="CounterOne" />
              </div>
              <h2>imageCenterAlign</h2>
              <p>
                Interview includes a template with 6 interview competencies with
                an evaluation rating scale.
              </p>
            </div>
            <div className={styles.detailsStepItems}>
              <div className={styles.imageCenterAlign}>
                <img src={CounterOne} alt="CounterOne" />
              </div>
              <h2>imageCenterAlign</h2>
              <p>
                Interview includes a template with 6 interview competencies with
                an evaluation rating scale.
              </p>
            </div>
            <div className={styles.detailsStepItems}>
              <div className={styles.imageCenterAlign}>
                <img src={CounterOne} alt="CounterOne" />
              </div>
              <h2>imageCenterAlign</h2>
              <p>
                Interview includes a template with 6 interview competencies with
                an evaluation rating scale.
              </p>
            </div>
          </div> */}
          {/* <div className={styles.accountInterview}>
            <h1>Get your Account Executive Interview Guide today </h1>
            <ul>
              <li>ACCOUNTEXEC01</li>
              <li>ACCOUNTEXEC01</li>
              <li>ACCOUNTEXEC01</li>
              <li>ACCOUNTEXEC01</li>
              <li>ACCOUNTEXEC01</li>
              <li>ACCOUNTEXEC01</li>
              <li>ACCOUNTEXEC01</li>
            </ul>
          </div> */}
          <div className="globalButton">
            <button onClick={() => router.push("/account/landing/detail")}>
              Back
            </button>
          </div>
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
    </>
  );
}

export default Details;
