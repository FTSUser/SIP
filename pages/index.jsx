import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import React, { useEffect, useState, useMemo } from "react";
import { adminService, alertService, userService } from "services";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import AddAdmin from "./admin/addAdmin/addAdmin";
import Head from "next/head";
export default Home;

const Menu = "/assets/images/menu.png";
const SubMenu = "/assets/images/submenu.png";
const Question = "/assets/images/question.png";
const Admins = "/assets/images/admin.png";

function Home() {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [comments, setComments] = useState([]);
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin?.role;
  const email = JSON.parse(localStorage.getItem("user"))?.payload?.admin?.email;
  const [localData, setRole] = useState(role);
  useEffect(() => {
    getData();
  }, [localData]);
  const getData = async () => {
    showLoader();
    await adminService.getCount(email).then((response) => {
      hideLoader();
      setComments(response.payload);
    });
  };
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>SIP Interview - Dashboard</title>
        <meta
          name="description"
          content="Meta description for the Dashboard Page"
        />
      </Head>

      <div className="p-4 heightAuto">
        <div className="row mb-4">
          {localData?.roleName == "superadmin" && (
            <>
              <div className="col-md-3 mb-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-users"></i> */}
                  <img src={Admins} alt="Admin" />
                  <h4>Total Admin</h4>
                  <h3>
                    <b>{comments?.admindata}</b>
                  </h3>
                </div>
              </div>
              <div className="col-md-3 mb-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={Menu} alt=" Menu" />
                  <h4>Total Menu</h4>
                  <h3>
                    <b>{comments?.Menu}</b>
                  </h3>
                </div>
              </div>
              <div className="col-md-3 mb-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={SubMenu} alt=" Menu" />
                  <h4>Total Sub Menu</h4>
                  <h3>
                    <b>{comments?.Submenu}</b>
                  </h3>
                </div>
              </div>
              <div className="col-md-3 mb-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={Question} alt="Question" />
                  <h4>Total Question</h4>
                  <h3>
                    <b>{comments?.Question}</b>
                  </h3>
                </div>
              </div>
              <div className="col-md-3 mb-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={Question} alt="Question" />
                  <h4>Total Interview Guide</h4>
                  <h3>
                    <b>{comments?.InterviewGuide}</b>
                  </h3>
                </div>
              </div>
            
            </>
          )}

          {localData?.roleName == "admin" && (
            <>
              <div className="col-md-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={Menu} alt=" Menu" />
                  <h4>Total Menu</h4>
                  <h3>
                    <b>{comments?.menu}</b>
                  </h3>
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={SubMenu} alt="sub Menu" />
                  <h4>Total Sub Menu</h4>
                  <h3>
                    <b>{comments?.submenu}</b>
                  </h3>
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div className="card">
                  {/* <i className="fas fa-universal-access"></i> */}
                  <img src={Question} alt="Question" />
                  <h4>Total Question</h4>
                  <h3>
                    <b>{comments?.question}</b>
                  </h3>
                </div>
              </div>
            </>
          )}
        </div>
        {/* <div className="row">
        <div className="col-md-6 text-center">
          <div className="card">
            <div className="chart">
              <Pie data={data} width={100} height={100} />
            </div>
          </div>
        </div>
        <div className="col-md-6 text-center">
          <div className="card">
            <div className="chart">
              <Pie data={data} width={100} height={100} />
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
}
