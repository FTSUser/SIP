import { useState, useEffect } from "react";
import { userService } from "services";
import Styles from "../styles/layout.module.scss";
import { useRouter } from "next/router";
export default Sidebar;

function Sidebar(props) {
  const [user, setUser] = useState(null);
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin?.role
    ?.roleName;
  const [localData, setRole] = useState(role);

  const router = useRouter();
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setToggle(props.toggle);
  }, [props.toggle]);

  function logout() {
    userService.logout();
  }
  const onToggle = () => {
    props.onToggle1(true);
  };
  // only show nav when logged in
  if (!user) return null;

  return (
    <div className={toggle ? Styles.sidebar : Styles.sidebarHidden}>
      <div className={Styles.sidebarSub}>
        <div className={Styles.alignsidebar}>
          <div className={Styles.logo}>SIP Interview</div>
          <div className={Styles.logoMin}>SIP</div>
          <i className="fas fa-times" onClick={() => onToggle()}></i>
          {/* <div onClick={() => onToggle()} className={Styles.close}>
           <div className="closeres">
           <i className="fas fa-times"></i>
           </div>
          </div> */}
        </div>
        <div className={Styles.sidebars}>
          <div
            className={Styles.dashboardIcon}
            onClick={() => {
              router.push("/");
            }}
          >
            <div
              className={
                router.asPath == "/" ? Styles.active : Styles.notActive
              }
            >
              <i className="fas fa-tachometer-alt"></i>

              <div className={Styles.dashboardText}>Dashboard</div>
            </div>
          </div>
          {localData === "superadmin" && (
            <>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/admin/admin")}
              >
                <div
                  className={
                    router.asPath == "/admin/admin"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-users"></i>
                  <div className={Styles.dashboardText}>Admin</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/admin/aprovemenu")}
              >
                <div
                  className={
                    router.asPath == "/admin/aprovemenu"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-users"></i>
                  <div className={Styles.dashboardText}>Approve Menu</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/menu/menu")}
              >
                <div
                  className={
                    router.asPath == "/menu/menu"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-universal-access"></i>

                  <div className={Styles.dashboardText}>Menu</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/interview/category/category")}
              >
                <div
                  className={
                    router.asPath == "/interview/category/category"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-universal-access"></i>

                  <div className={Styles.dashboardText}>Interview Guide</div>
                </div>
              </div>
            </>
          )}

          {localData === "admin" && (
            <>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/menu/menuapprove")}
              >
                <div
                  className={
                    router.asPath == "/menu/menuapprove"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-universal-access"></i>

                  <div className={Styles.dashboardText}>Menu</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/plan/plan")}
              >
                <div
                  className={
                    router.asPath == "/plan/plan"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-tasks"></i>
                  <div className={Styles.dashboardText}>Plan</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/question/questionSet")}
              >
                <div
                  className={
                    router.asPath == "/question/questionSet"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-question"></i>
                  <div className={Styles.dashboardText}>Question Set</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/response/response")}
              >
                <div
                  className={
                    router.asPath == "/response/response"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-users"></i>
                  <div className={Styles.dashboardText}>
                    Applied Interviewer
                  </div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/thankyou/thankyou")}
              >
                <div
                  className={
                    router.asPath == "/thankyou/thankyou"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-users"></i>
                  <div className={Styles.dashboardText}>Thank You</div>
                </div>
              </div>
              <div
                className={Styles.dashboardIcon}
                onClick={() => router.push("/instruction/instruction")}
              >
                <div
                  className={
                    router.asPath == "/instruction/instruction"
                      ? Styles.active
                      : Styles.notActive
                  }
                >
                  <i className="fas fa-users"></i>
                  <div className={Styles.dashboardText}>Instruction</div>
                </div>
              </div>
            </>
          )}
          {localData === "superadmin" && (
            <div
              className={Styles.dashboardIcon}
              onClick={() => router.push("/contact/contact")}
            >
              <div
                className={
                  router.asPath == "/contact/contact"
                    ? Styles.active
                    : Styles.notActive
                }
              >
                <i className="fas fa-phone-alt"></i>
                <div className={Styles.dashboardText}>Contact Us</div>
              </div>
            </div>
          )}
          <div
            className={Styles.dashboardIcon}
            onClick={() => router.push("/profile/profile")}
          >
            <div
              className={
                router.asPath == "/profile/profile"
                  ? Styles.active
                  : Styles.notActive
              }
            >
              <i className="fas fa-unlock-alt"></i>

              <div className={Styles.dashboardText}>Profile</div>
            </div>
          </div>
          <div
            className={Styles.dashboardIcon}
            onClick={() => router.push("/change/changePassword")}
          >
            <div
              className={
                router.asPath == "/change/changePassword"
                  ? Styles.active
                  : Styles.notActive
              }
            >
              <i className="fas fa-unlock-alt"></i>

              <div className={Styles.dashboardText}>Change Password</div>
            </div>
          </div>
          <div
            className={Styles.dashboardIcon}
            onClick={() => router.push("/notifi/notification")}
          >
            <div
              className={
                router.asPath == "/notifi/notification"
                  ? Styles.active
                  : Styles.notActive
              }
            >
              <i className="fa fa-bell"></i>

              <div className={Styles.dashboardText}>Notification</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
