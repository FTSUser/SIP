import LandingHeader from "./LandingHeader/LandingHeader";
import styles from "../Landing/landing.module.scss";
import { alertService, menuService } from "services";

const AccountingIcon = "/assets/images/accounting.svg";

import Head from "next/head";

import React, { useEffect, useState, useMemo } from "react";

import router, { useRouter } from "next/router";

function Details() {
  // form validation rules

  // get functions to build form with useForm() hook

  const router = useRouter();
  const [category, setCategory] = useState([]);
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
        <title>SIP Interview - Details </title>
        <meta
          name="description"
          content="Meta description for the Details Page"
        />
      </Head>
      <>
        <LandingHeader />
      </>

      <div className="deatils">
        <section className={styles.mockInterviewAlignment}>
          <div className="new-container">
            {/* <div className={styles.topBarAlignment}>
            <div className={styles.topBar}></div>
          </div> */}
            <h1>
              Choose from an ever growing selection of interview guides covering
              a variety of industry job titles.
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
            {/* <div className={styles.grid}>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
            <div className={styles.gridItems}>
              <div className={styles.imageCenterAlign}>
                <img src={AccountingIcon} alt="AccountingIcon" />
              </div>
              <p>Accounting</p>
            </div>
          </div> */}
            <div className="globalButton">
              <button onClick={() => router.push("/account/landing/landing")}>
                Back
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Details;
