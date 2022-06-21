import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import React, { useEffect, useState, useMemo } from "react";

import CardInput from "./card";
import { alertService, questionService } from "services";
import router, { useRouter } from "next/router";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import Styles from "../Payment/payment.module.scss";
import Swal from "sweetalert2";

const Payments = (props) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { query } = useRouter();
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin;
  const [localData, setRole] = useState(role);
  const stripe = useStripe();
  const elements = useElements();

  const handleDataChange = (e) => {
    let { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    if (!stripe || !elements) {
      return;
    } else {
      showLoader();
      const data = {
        email: localData?.email,
        menus: props.mainData,
        Aid: localData?._id,
      };
      questionService
        .payment(data)
        .then(async (res) => {
          const paymentReponse = res.status._id;

          const clientSecret = res.data["client_secret"];
          if (clientSecret) {
            const result = await stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  email: localData?.email,
                  address: {
                    city: "surat",
                    country: "US",
                    line1: "test demo",
                    line2: "tes dkfdf",
                    state: "Gujarat",
                  },
                  name: "STRIPE NAME",
                },
              },
            });

            if (result.error) {
              hideLoader();
              // Show error to your customer (e.g., insufficient funds)
            } else {
              // The payment has been processed!
              if (result.paymentIntent.status == "succeeded") {
                const data = {
                  id: paymentReponse,
                  email: localData?.email,
                  menus: [props.mainData],
                  amount:
                    typeof props.mainData == "string"
                      ? props.price
                      : props.mainData.length * props.price,
                  Aid: localData._id,
                  PaymentId: result.paymentIntent.id,
                };
                await questionService.paymentConform(data).then((response) => {
                  hideLoader();
                  if (response) {
                    Swal.fire("Payment Successful", "Thank You", "success");
                    router.push(`/plan/plan`);
                  }
                });
              }
            }
          } else {
            alertService.error("Please Fill the details");
          }
        })
        .catch((e) => {
          Swal.fire(e, "Thank You", "error");
          router.push(`/plan/plan`);
        });
     
    }
    showLoader();
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className={Styles.cards}>
          <div className="">
            <CardInput />
          </div>
          <div className="">
            <button
              className={Styles.mainButtons}
              onClick={(e) => handleSubmit(e)}
              // disabled={isDisabled}
              disabled={!stripe || !elements}
            >
              {props.plan === "single" ? (
                <span>
                  {" "}
                  Pay $
                  {typeof props.mainData == "string"
                    ? props.price
                    : props.mainData.length * props.price}{" "}
                </span>
              ) : (
                <span> Pay ${props.price} </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
