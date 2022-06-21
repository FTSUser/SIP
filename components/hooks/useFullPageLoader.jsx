import FullPageLoader from "components/custom/fullPageLoader/fullPageLoader";
import React, { useState } from "react";

const useFullPageLoader = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <FullPageLoader /> : null,
    () => setLoading(true), //Show loader
    () => setLoading(false), //Hide Loader
  ];
};

export default useFullPageLoader;
