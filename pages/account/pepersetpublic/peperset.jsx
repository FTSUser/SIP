import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Styles from "../PepersetPublic/peperset.module.scss";
import { alertService, menuService, questionService } from "services";
import classNames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import HTMLFlipBook from "react-pageflip";
import GaugeChart from "react-gauge-chart";
import Swal from "sweetalert2";
function Peperset() {
  const { query } = useRouter();
  const [comments, setComments] = useState([]);
  const [thankYouData, setThankyouData] = useState([]);
  const [instructionData, setInstructionData] = useState([]);
  const [defaultData, setDefautData] = useState([]);
  const [dataMenu, setDataForMenu] = useState([]);
  const [dataSubMenu, setDataForSubMenu] = useState([]);
  const [resultData, setResult] = useState([]);

  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const getData = async () => {
    showLoader();
    await questionService.getQuestionSetByID(query.id).then((response) => {
      hideLoader();
      response.payload.Propertys?.ListofQuestion?.map((e, index) => {
        e.Answer = [];
        return e;
      });
      setComments(response.payload.Propertys);
      setDataForMenu(response?.payload?.menuData);
      setDataForSubMenu(response?.payload?.submenuData);
    });
  };

  const getThankyou = () => {
    menuService.getAllThankyouByID(comments?.Aid).then((response) => {
      setThankyouData(response.payload.Thank[0]);
    });
  };
  const getInstruction = () => {
    menuService.getAllinstruction(comments?.Aid).then((response) => {
      setInstructionData(response.payload.Instruction[0]);
    });
  };

  const getResult = async () => {
    showLoader();
    await questionService.getResult(query?.email).then((response) => {
      hideLoader();
      setResult(response.payload?.result);
    });
  };
  useEffect(() => {
    let mainData = query.id + "";
    let Data = query && mainData.split("&email=");
    setDefautData(Data);
   
  }, []);
  useEffect(() => {
    if (comments?.Aid) {
      getInstruction();
    }
  }, [comments?.Aid]);
  useEffect(() => {
    if (query.id) {
      getData();
    }
  }, [query.id]);
  const chartStyle = {
    height: 250,
  };
  const [inputs, setInputs] = useState({ email: "" });

  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));
  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .strict(true)
      .required(" Name is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),

    phone: Yup.string().required("Phone is required"),
    currentProfession: Yup.string()
      .strict(true)
      .required(" Profession is required")
      .matches(/^\S.*$/gm, "* This field cannot contain only blankspaces"),

    // currentProfession: Yup.string().required("Current Profession is required"),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return createUser(data);
  }

  function createUser(data) {
    let checkData = [];
    comments.ListofQuestion.map((e) => {
      e.Option.map((o) => {
        delete o._id;
        return o;
      });
      let a = {
        Question: e?.Qname,
        Option: e.Option,
        Answer: e.Answer,
        type: e.type,
      };
      checkData.push(a);
    });
    let success = true;
    comments.ListofQuestion?.map((ans) => {
      if (!ans.Answer.length) {
        success = false;
      }
    });
    if (!success) {
      alertService.error("Please Select Answer");
    } else {
      const datas = {
        email: query?.email && query?.email,
        name: data.name,
        phone: data?.phone,
        currentProfession: data?.currentProfession,
        Qsetid: defaultData[0] && defaultData[0],
        ListofQA: checkData,
        isExamDone: true,
      };
      questionService
        .addRsponse(datas)
        .then((data) => {
          alertService.success(data.message, { keepAfterRouteChange: false });
          Swal.fire({
            title: "Good Job!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Continue",
          }).then((result) => {
            if (result.isConfirmed) {
              if (data) {
                getResult();
                setTab("thankyou");
                setTimeout(() => {
                  getThankyou();
                }, 1000);
                // handleOnClick(e, "thankyou")
              }
              // Swal.fire("Saved!", "Check Your Mail", "success");

              // window.close();
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });
        })
        .catch(alertService.error);
    }
  }

  const handleQuestion = (data, record, index) => {
    if (record.type == "mcq") {
      let index1 = record.Answer.findIndex((e) => e === index + 1);
      if (index1 === -1) {
        record.Answer = [index + 1];
      } else {
        record.Answer.splice(index1, 1);
      }
    } else if (record.type == "checkbox") {
      let index1 = record.Answer.findIndex((e) => e === index + 1);
      if (index1 === -1) {
        record.Answer.push(index + 1);
      } else {
        record.Answer.splice(index1, 1);
      }
    }
    let index2 = comments.ListofQuestion.findIndex((e) => e._id == record._id);
    if (index !== -1) {
      comments.ListofQuestion[index2] = record;
    }
    setComments(comments);
  };

  const role = localStorage.getItem("Key");
  useEffect(() => {
    if (role) {
      setTab(role);
    }
  }, [role]);

  const [tab, setTab] = useState("book");

  const handleOnClick = (e, key) => {
    e.preventDefault();
    if (key === "menu") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "insttruction") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "question") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "thankyou") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "graph") {
      setTab(key);
      // localStorage.setItem("Key", key);
    } else {
      setTab(key);
      localStorage.setItem("Key", key);
    }
  };

  const previousClick = (e, key) => {
    if (key === "book") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "menu") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "insttruction") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "question") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "thankyou") {
      setTab(key);
      localStorage.setItem("Key", key);
    } else if (key === "graph") {
      setTab(key);
      // localStorage.setItem("Key", key);
    }
  };

  return (
    <>
      {tab === "book" && (
        <>
          <div style={{ margin: "30px 0" }}>
            <HTMLFlipBook
              showCover={true}
              width={500}
              height={500}
              style={{ margin: "0 auto" }}
            >
              <div className="demoPage">
                <div className={Styles.width50}>Page 1</div>
              </div>
              <div className="demoPage">
                <div className={Styles.width50}>Page 2</div>
              </div>
              <div className="demoPage">
                <div className={Styles.width50}>Page 3</div>
              </div>
              <div className="demoPage">
                <div className={Styles.width50}>Page 4</div>
              </div>
              <div className="demoPage">
                <div className={Styles.width50}>Page 5</div>
              </div>
              <div className="demoPage">
                <div className={Styles.width50}>Page 6</div>
              </div>
            </HTMLFlipBook>
          </div>
          <div className={Styles.group}>
            <button
              className={Styles.rightButton}
              onClick={(e) => handleOnClick(e, "menu")}
            >
              Next
            </button>
          </div>
        </>
      )}
      {tab === "menu" && (
        <div className="card">
          <div className="row">
            <div className="col-md-12 py-3">
              <h4>
                <b>Menu</b>
              </h4>

              {dataMenu?.map((data, key) => (
                <div key={key}>{data?.name}</div>
              ))}
            </div>
            <div className="col-md-12 py-3">
              <h4>
                <b>SubMenu</b>
              </h4>
              {dataSubMenu?.map((data, key1) => (
                <div key={key1}>{data?.name}</div>
              ))}
            </div>
          </div>
          <div className={Styles.group}>
            <button onClick={(e) => previousClick(e, "book")}>Prev</button>
            <button onClick={(e) => handleOnClick(e, "insttruction")}>
              Next
            </button>
          </div>
        </div>
      )}
      {tab === "insttruction" && (
        <div className="card">
          <div className="card-body">
            <div className="">
              <h4>
                <b>Instruction</b>
                <p
                  dangerouslySetInnerHTML={{
                    __html: instructionData.title,
                  }}
                  className=""
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: instructionData.description,
                  }}
                  className=""
                />
              </h4>
            </div>
          </div>
          <div className={Styles.group}>
            <button onClick={(e) => previousClick(e, "menu")}>Prev</button>
            <button onClick={(e) => handleOnClick(e, "question")}>Next</button>
          </div>
        </div>
      )}
      {tab === "question" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" w-100 p-5 heightAuto">
            <h2>Question Set</h2>
            <div className="card">
              <div className="form-group col-md-3">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  disabled
                  defaultValue={query?.email}
                  className={`form-control `}
                />
              </div>
              <div className="form-group col-md-3">
                <label>
                  Name <span>*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  {...register("name")}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.name?.message}</div>
              </div>
              <div className="form-group col-md-3">
                <label>
                  Phone <span>*</span>
                </label>
                <input
                  name="phone"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  maxLength={10}
                  type="text"
                  {...register("phone")}
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.phone?.message}</div>
              </div>
              <div className="form-group col-md-3">
                <label>
                  Current Profession <span>*</span>
                </label>
                <input
                  name="currentProfession"
                  type="text"
                  {...register("currentProfession")}
                  className={`form-control ${
                    errors.currentProfession ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.currentProfession?.message}
                </div>
              </div>
              <div>
                <div className={Styles.heading}>
                  Name: <span> {comments?.name}</span>
                </div>
                <div className={Styles.heading}>
                  Description: <span> {comments?.description}</span>
                </div>
                <div className={Styles.heading}>list of Questions:</div>

                <div className={Styles.cardGrid}>
                  {comments.ListofQuestion?.map((data, key) => (
                    <>
                      <div className={Styles.cardGridItems}>
                        <div className="d-flex align-items-center">
                          <div className={(Styles.cardBoxAlign, Styles.Cenetr)}>
                            <div className={Styles.circle} key={key}>
                              {key + 1}
                            </div>
                          </div>

                          <div
                            className={classNames(Styles.cardBoxAlign, "pl-2")}
                          >
                            <span>{data.Qname}</span>
                          </div>
                        </div>

                        <div className={Styles.cardBoxAlign}>
                          <div className="p-2">
                            {data?.Option.map((record, i) => (
                              <>
                                {data.type === "mcq" ? (
                                  <>
                                    <div
                                      className="d-flex align-items-baseline"
                                      key={i}
                                    >
                                      <input
                                        type="radio"
                                        name={key}
                                        id="radio"
                                        defaultChecked={data.istrue}
                                        onChange={(e) =>
                                          handleQuestion(e, data, i)
                                        }
                                      />
                                      <span className="pl-2">
                                        {" "}
                                        {record?.name}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="d-flex align-items-baseline"
                                      key={i}
                                    >
                                      <input
                                        type="checkbox"
                                        id={record?.name}
                                        onChange={(e) =>
                                          handleQuestion(e, data, i)
                                        }
                                      />

                                      <span className="pl-2">
                                        {" "}
                                        {record?.name}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              {/* <div className="py-2">
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="btn btn-primary mr-2"
                >
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Save
                </button>
              </div> */}
            </div>
            <div className={Styles.group}>
              <button onClick={(e) => previousClick(e, "insttruction")}>
                Prev
              </button>
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className=" mr-2"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Next
              </button>
              {/* <button onClick={(e) => handleOnClick(e, "thankyou")}>Next</button> */}
            </div>
          </div>
        </form>
      )}
      {tab === "thankyou" && (
        <div className="card">
          <div className="card-body">
            <div className="text-center">
              <h4>
                <p
                  dangerouslySetInnerHTML={{
                    __html: thankYouData.title,
                  }}
                  className=""
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: thankYouData.description,
                  }}
                  className=""
                />
              </h4>
            </div>
          </div>
          <div className={Styles.group}>
            <button onClick={(e) => previousClick(e, "question")}>Prev</button>
            <button onClick={(e) => handleOnClick(e, "graph")}>Next</button>
          </div>
        </div>
      )}
      {tab === "graph" && (
        <div className="card">
          Graph
          <div className="row">
            <div className="col-md-5 mb-5">
              {resultData && (
                <GaugeChart
                  id="gauge-chart1"
                  style={chartStyle}
                  animate={true}
                  nrOfLevels={15}
                  percent={resultData?.percentage}
                  needleColor="#345243"
                  textColor="#000"
                />
              )}
            </div>
          </div>
          <div className={Styles.group}>
            {/* <button>Thank You</button> */}
            <button onClick={() => router.push(`/`)}>Done</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Peperset;
