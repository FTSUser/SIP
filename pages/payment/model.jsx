import React, { useEffect } from "react";
import { withRouter } from "react-router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payments from "./payment";
import { useState } from "react";
import router, { useRouter } from "next/router";
import Styles from "../Question/questionSet.module.scss";
import classNames from "classnames";

const stripePromise = loadStripe(
  "pk_test_51Ktqe8SFgjNQxvYefJo7RcHTP7NloLiiL7kx1oUW1uskbnpgEi7dsZAFry4BKIUOUDMX9TRvhCNOiuHNrpSvoLYz006JD8KgeT"
);
function Model(props) {
  // const route = use
  const [data, setData] = useState();
  const { query } = useRouter();
 
  const closeList = () => {
    router.push(`/plan/plan`);
  };
  return (
    <>
      <div className={Styles.customModel}>
        <div className={Styles.modelDesign}>
          <div className={Styles.modelHeader}>
            <div className={Styles.modelHeading}>
              <h3>Payment</h3>
            </div>
            <div className="close" onClick={() => closeList()}>
              <i className="fas fa-times"></i>
            </div>
          </div>
          <div className={Styles.modelBody}>
            <div>
              <Elements stripe={stripePromise}>
                <Payments
                  mainData={query.data}
                  price={query.price}
                  plan={query.plan}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
      {/* <div className=" w-100 p-5 heightAuto">
        <div>
          <Elements stripe={stripePromise}>
            <Payments
              mainData={query.data}
              price={query.price}
              plan={query.plan}
            />
          </Elements>
        </div>
      </div> */}
    </>
  );
}

export default Model;
