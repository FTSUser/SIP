import { useState, useEffect } from "react";
import Styles from "../styles/layout.module.scss";
const close = "/assets/images/close.png";

import { NavLink } from ".";
import { userService } from "services";
import { useRouter } from "next/router";
export default Nav;
import { alertService, questionService } from "services";
import moment from "moment";
import OutsideAlerter from "./custom/OutsideAlerter";

function Nav(props) {
  const [user, setUser] = useState(null);
  const [noti, setnotificationToggle] = useState(false);
  const [notificationData, setNotificationData] = useState();
  const router = useRouter();
  const publicPaths = [
    "/account/login/login",
    "/account/register/register",
    "/account/forget/forget",
    "/account/landing/landing",
    "/account/landing/detail",
    "/account/forget/verifyCode",
    "/account/forget/newPassword",
    "/account/pepersetpublic/peperset",
  ];
  const location = router.asPath.split("?")[0];
  const role = JSON.parse(localStorage.getItem("user"));
  const [localData, setRole] = useState(role);
  const onToggle = () => {
    props.onToggle1(true);
  };
  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }
  const getData = async (id) => {
    // showLoader();
    await questionService
      .getNotification(localData?.payload?.admin?._id)
      .then((response) => {
        setNotificationData(response.payload.notification);
      });
  };
  const clearAllNotification = async () => {
    await questionService
      .clearAll(localData?.payload?.admin?._id)
      .then((res) => {
        if (res) {
          getData()

        }
      });
  };
  useEffect(() => {
    getData(localData?.payload?.admin?._id);
    setRole(JSON.parse(localStorage.getItem("user")));
  }, [location]);

  // only show nav when logged in
  if (!user) return null;

  return (
    <>
      {!publicPaths.includes(location) ? (
        <div className={Styles.header}>
          <div className={Styles.menuRightAlign}>
            <div className={Styles.logo} onClick={() => onToggle()}>
              <i className="fas fa-bars"></i>
            </div>
            <div className={Styles.alignLogout}>
              <div
                className=" hovers"
                onClick={() => setnotificationToggle(!noti)}
              >
                <i className="fa fa-bell"></i>
              </div>
              {noti && (
                <OutsideAlerter outSideClick={setnotificationToggle} >
                  <div className="model">
                    <div className="d-flex justify-content-between">
                      <div>Notification</div>
                      <div
                        className="clsoe"
                        onClick={() => setnotificationToggle(!noti)}
                      >
                        <img src={close} alt="" />
                      </div>
                    </div>
                    <div>
                      {notificationData?.length > 0 ? (
                        <>
                          {notificationData?.map((data) => (
                            <div className="border-bottom pb-3">
                              <div
                                onClick={() =>
                                  router.push("/notifi/notification")
                                }
                              >
                                <div className="white">{data?.type}</div>
                                <div className="white">
                                  Sender: {data?.sender?.fname}
                                </div>
                                <div className="white">
                                  Receiver: {data?.receiver?.fname}
                                </div>
                                <div className="white">
                                  Date:{" "}
                                  {moment(data?.createdAt).format(
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div
                            className="white text-right py-2 cp"
                            onClick={() => clearAllNotification()}
                          >
                            Clear All
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="white">No Notification Found</div>
                        </>
                      )}
                    </div>
                  </div>
                </OutsideAlerter>
              )}
              <div
                className="pr-4 cursor-pointer"
                onClick={() => router.push("/profile/profile")}
              >
                {localData.fname
                  ? localData.fname
                  : localData?.payload?.admin?.fname}
              </div>
              <div onClick={() => logout()} className={Styles.logout}>
                <i className="fas fa-sign-out-alt"></i>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
