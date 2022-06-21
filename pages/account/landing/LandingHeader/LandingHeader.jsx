import React, { useState } from "react";
import { Link } from "components";
import classNames from "classnames";
import $ from "jquery";
const MenuButton = "/assets/images/button.svg";
const InterViewLogo = "/assets/images/my-interview.svg";
const WhiteMenuButton = "/assets/images/white-button.svg";
const WhiteInterViewLogo = "/assets/images/white-interview-logo.svg";
const Close = "/assets/images/close.png";
import styles from "../LandingHeader/landingheader.module.scss";
import { NavLink } from "react-router-dom";
export default function LandingHeader() {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [emailHeader, setEmailheader] = useState("");
  const location = window.location.pathname;
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      setEmailheader("scroll");
    } else if (scroll <= 10) {
      setEmailheader("notscroll");
    } else {
      setEmailheader("notscroll");
    }
  });

  return (
    <div>
      <div>
        <div className="" style={{ position: "relative" }}>
          {location === "/account/landing/detail" ? (
            emailHeader === "scroll" ? (
              <div
                className={classNames(
                  styles.menuHeader,
                  styles.menuHeaderFixed
                )}
              >
                <div className="cus-container">
                  <div className={styles.headerAlignment}>
                    {/* <div className={styles.menu} onClick={() => setMobileSidebar(!mobileSidebar)}>
                    <img src={WhiteMenuButton} alt="WhiteMenuButton" />
                  </div> */}
                    <div className={styles.logo}>
                      <span>SIP</span>
                    </div>
                    <div
                      className={styles.menu}
                      onClick={() => setMobileSidebar(!mobileSidebar)}
                    >
                      <img src={MenuButton} alt="MenuButton" />
                    </div>
                    <div className={styles.newMenuAdd}>
                      <ul>
                        <li>
                          <a href="/account/landing/landing">Home</a>
                        </li>
                        <li>
                          <a href="/account/landing/landing">About Us</a>
                        </li>
                        <li>
                          <a href="/account/landing/landing">
                            Interview Guides
                          </a>
                        </li>
                        <li>
                          <a href="/account/landing/landing">Contact Us</a>
                        </li>
                        <li>Blog</li>
                        <li>
                          <a href="/account/landing/landing">Pricing</a>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.loginButton}>
                      <div className={styles.buttonAlignmnentWhite}>
                        <div>
                          <Link href="/account/login/login">
                            <button>Login</button>
                          </Link>
                        </div>
                        <div>
                          <Link href="/account/register/register">
                            <button>Sign Up</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.menuHeader}>
                  <div className="cus-container">
                    <div className={styles.headerAlignment}>
                      <div className={styles.logo}>
                        {/* <img src={InterViewLogo} alt="InterViewLogo" /> */}{" "}
                        <div className={styles.black}>SIP</div>
                      </div>
                      <div
                        className={styles.menu}
                        onClick={() => setMobileSidebar(!mobileSidebar)}
                      >
                        <img src={MenuButton} alt="MenuButton" />
                      </div>
                      <div className={styles.newMenuAddBlack}>
                        <ul>
                          <li>
                            <a href="/account/landing/landing">Home</a>
                          </li>
                          <li>
                            <a href="/account/landing/landing">About Us</a>
                          </li>
                          <li>
                            <a href="/account/landing/landing">
                              Interview Guides
                            </a>
                          </li>
                          <li>
                            <a href="/account/landing/landing">Contact Us</a>
                          </li>
                          <li>Blog</li>
                          <li>
                            <a href="/account/landing/landing">Pricing</a>
                          </li>
                        </ul>
                      </div>
                      <div className={styles.loginButton}>
                        <div className={styles.buttonAlignmnent}>
                          <div>
                            <Link href="/account/login/login">
                              <button>Login</button>
                            </Link>
                          </div>
                          <div>
                            <Link href="/account/register/register">
                              <button>Sign Up</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : emailHeader === "scroll" ? (
            <div
              className={classNames(styles.menuHeader, styles.menuHeaderFixed)}
            >
              <div className="cus-container">
                <div className={styles.headerAlignment}>
                  {/* <div className={styles.menu} onClick={() => setMobileSidebar(!mobileSidebar)}>
                    <img src={WhiteMenuButton} alt="WhiteMenuButton" />
                  </div> */}
                  <div className={styles.logo}>
                    <span>SIP</span>
                  </div>
                  <div
                    className={styles.menu}
                    onClick={() => setMobileSidebar(!mobileSidebar)}
                  >
                    <img src={MenuButton} alt="MenuButton" />
                  </div>
                  <div className={styles.newMenuAdd}>
                    <ul>
                      <li>
                        <a href="#home">Home</a>
                      </li>
                      <li>
                        <a href="#aboutus">About Us</a>
                      </li>
                      <li>
                        <a href="#price">Interview Guides</a>
                      </li>
                      <li>
                        <a href="#contact">Contact Us</a>
                      </li>
                      <li>Blog</li>
                      <li>
                        <a href="#price">Pricing</a>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.loginButton}>
                    <div className={styles.buttonAlignmnentWhite}>
                      <div>
                        <Link href="/account/login/login">
                          <button>Login</button>
                        </Link>
                      </div>
                      <div>
                        <Link href="/account/register/register">
                          <button>Sign Up</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.menuHeader}>
                <div className="cus-container">
                  <div className={styles.headerAlignment}>
                    {/* <div className={styles.menu} onClick={() => setMobileSidebar(!mobileSidebar)}>
                      <img src={MenuButton} alt="MenuButton" />
                    </div> */}
                    <div className={styles.logo}>
                      {/* <img src={InterViewLogo} alt="InterViewLogo" /> */}{" "}
                      <div className={styles.black}>SIP</div>
                    </div>
                    <div
                      className={styles.menu}
                      onClick={() => setMobileSidebar(!mobileSidebar)}
                    >
                      <img src={MenuButton} alt="MenuButton" />
                    </div>
                    <div className={styles.newMenuAddBlack}>
                      <ul>
                        <li>
                          <a href="#home">Home</a>
                        </li>
                        <li>
                          <a href="#aboutus">About Us</a>
                        </li>
                        <li>
                          <a href="#price">Interview Guides</a>
                        </li>
                        <li>
                          <a href="#contact">Contact Us</a>
                        </li>
                        <li>Blog</li>
                        <li>
                          <a href="#price">Pricing</a>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.loginButton}>
                      <div className={styles.buttonAlignmnent}>
                        <div>
                          <Link href="/account/login/login">
                            <button>Login</button>
                          </Link>
                        </div>
                        <div>
                          <Link href="/account/register/register">
                            <button>Sign Up</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {mobileSidebar && <div className={styles.sidebarBlurCus}></div>}
      {/* mobileSidebar */}
      <div
        className={
          mobileSidebar
            ? classNames(styles.mainSidebarDesign, styles.cusSidebarOpen)
            : classNames(styles.mainSidebarDesign, styles.cusSidebarClose)
        }
      >
        <div
          className={styles.sidebarClose}
          onClick={() => setMobileSidebar(false)}
        >
          <img src={Close} alt="" />
        </div>
        <div
          className={styles.sidebarDesignMenu}
          onClick={() => setMobileSidebar(false)}
        >
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#aboutus">About Us</a>
            </li>
            <li>
              <a href="#price">Interview Guides</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>Blog</li>
            <li>
              <a href="#price">Pricing</a>
            </li>
          </ul>
        </div>
        {/* <div
          className={styles.subMenuDesign}
          onClick={() => setMobileSidebar(false)}
        >
          <ul>
            <li>FAQs</li>
            <li>Support & Video Tutorials</li>
            <a href="#contact">
              <li>Contact </li>
            </a>
            <li>Blog</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
