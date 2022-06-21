import React from "react";
const Spinner = "/assets/images/spinner.svg";

const FullPageLoader = () => {
  return (
    <div className="loader">
      <div className="loader-center">
        <img src={Spinner} className="fp-loader" alt="loading" />
      </div>
    </div>
  );
};

export default FullPageLoader;
