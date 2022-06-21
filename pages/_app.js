import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "styles/globals.scss";

import { userService } from "services";
import Sidebar from "../components/Sidebar";
import Nav from "../components/Nav";
import { Alert } from "components/Alert";
import Styles from "../styles/layout.module.scss";
import classNames from "classnames";

export default App;

function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [toggle, setToggle] = useState(true);

  const location = router.asPath.split("?")[0];
  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const publicPaths = [
    "/account/login/login",
    "/account/register/register",
    "/account/forget/forget",
    "/account/landing/landing",
    "/account/landing/detail",
    "/account/landing/detailid",
    "/account/forget/verifyCode",
    "/account/forget/newPassword",
    "/account/pepersetpublic/peperset",
  ];

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    setUser(userService.userValue);
    const path = url.split("?")[0];

    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/account/landing/landing",
        // query: { returnUrl: router.asPath }
      });
    } else {
      setAuthorized(true);
    }
  }
  return (
    <>
      <Head>
        <title>SIP Interview</title>
        <link
          href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css"
        />
        {/* <script
            src="https://kit.fontawesome.com/b7ecb94de9.js"
            crossorigin="anonymous"
          ></script> */}
      </Head>
      <div className="Toaster">
        <Alert />
      </div>
      {user ? (
        <div
          className={
            user
              ? classNames("app-container", "bg-light")
              : classNames("app-container")
          }
        >
          {!publicPaths.includes(location) ? (
            <Sidebar onToggle1={(data) => setToggle(!toggle)} toggle={toggle} />
          ) : null}
          <div
            className={
              !publicPaths.includes(location) && toggle
                ? Styles.appBar
                : Styles.hideAppbar
            }
          >
            <Nav onToggle1={(data) => setToggle(!toggle)} />
            {authorized && <Component {...pageProps} />}
          </div>
        </div>
      ) : (
        <>{authorized && <Component {...pageProps} />}</>
      )}
    </>
  );
}
