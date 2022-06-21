import React, { useEffect, useState, useMemo } from "react";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import classNames from "classnames";
import Styles from "../Plan/plan.module.scss";
import Head from "next/head";
import Router, { withRouter } from "next/router";
import router from "next/router";
const Plan = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  function redirectMenu(price, plan) {
    Router.push({
      pathname: "/menu/menu",
      query: { price, plan },
    });
  }
  return (
    <>
      <Head>
        <title>SIP Interview - Plan </title>
        <meta name="description" content="Meta description for the Plan Page" />
      </Head>
      <div className=" p-5 heightAuto">
        <div className="heading">
          <h2>Plan</h2>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="card h-100">
              <h2>Individual Guides </h2>
              <p>
                Includes a single guide and <br /> Evaluation Template
              </p>
              <h4>$75.00</h4>
              <button
                className={Styles.btns}
                onClick={() => redirectMenu(75, 1)}
              >
                Buy Now
              </button>
            </div>
          </div>
          {/* <div className="col-md-4">
            <div className="card h-100">
              <h2>Bundle 2 Individual Guides</h2>
              <p>
                Includes 2 guides 1<sup>st</sup> and 2<sup>nd</sup> and <br />
                Evaluation Template
              </p>
              <h4>$150.00 @ 20% off $120.00</h4>
              <button
                className={Styles.btns}
                onClick={() => redirectMenu(120, 2)}
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <h2>Bundle 3 Guides</h2>
              <p>
                Includes all 3 guides 1<sup>st</sup> and 2<sup>nd</sup> and
                Final Interview Guides and Evaluation Template
              </p>
              <h4>$225.00 @ 30% $157.00</h4>
              <button
                className={Styles.btns}
                onClick={() => redirectMenu(157, 3)}
              >
                Buy Now
              </button>
            </div>
          </div> */}
        </div>
      </div>
      {loader}
    </>
  );
};

export default Plan;
