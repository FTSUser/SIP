import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { alertService } from "services";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      padding: "20px",
      color: "#ffff",
      letterSpacing: "0.025em",
      fontFamily: "Source Code Pro, monospace",
      "::placeholder": {
        color: "#fff",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

export default function CardInput() {
  return (
    <CardElement
      options={CARD_ELEMENT_OPTIONS}
      onChange={(e) => {
        alertService.error(e.error.message);
      }}
    />
  );
}
