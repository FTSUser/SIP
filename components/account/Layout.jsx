import { useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "services";
import Styles from "../../styles/layout.module.scss";
export { Layout };

function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.userValue) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container">
        <div className={Styles.centerAlignBox}>
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
}
