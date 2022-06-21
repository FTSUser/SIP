import { Router, useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "../Change/changePassword.module.scss";
import { Link } from "components";
import { Layout } from "components/account";
import { userService, alertService } from "services";
import classNames from "classnames";
export default ChangePassword;
import Head from "next/head";
import { useEffect, useState } from "react";
import { questionService } from "services";
import { async } from "rxjs";
import moment from "moment";

function ChangePassword() {
  const router = useRouter();
  const role = JSON.parse(localStorage.getItem("user"));
  const [localData, setRole] = useState(role);
  const [notificationData, setNotificationData] = useState();

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
          getData();
        }
      });
  };
  useEffect(() => {
    getData(localData?.payload?.admin?._id);
    setRole(JSON.parse(localStorage.getItem("user")));
  }, []);
  return (
    <>
      <Head>
        <title>SIP Interview - Notification</title>
        <meta
          name="description"
          content="Meta description for the Chane Password Page"
        />
      </Head>

      <div className="heightAuto ">
        <div className="  p-5 ">
          <div className=" py-4 ">
            <h2>Notification</h2>
          </div>
          {notificationData?.length > 0 ? (
            <>
              {notificationData?.map((data) => (
                <div className="card">
                  <div className="">{data?.type}</div>
                  <div className="">Sender: {data?.sender?.fname}</div>
                  <div className="">Receiver: {data?.receiver?.fname}</div>
                  <div className="">
                    Date: {moment(data?.createdAt).format("YYYY-MM-DD hh:mm A")}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="card">No Notification Found</div>
            </>
          )}
          <div
            className="clear text-right py-3 cp"
            onClick={() => clearAllNotification()}
          >
            Clear All
          </div>
        </div>
      </div>
    </>
  );
}
