import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { menuService } from "services";
import Styles from "../Question/questionSet.module.scss";

function ViewQuestionSet() {
  const { query } = useRouter();
  const [comments, setComments] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const getData = async () => {
    showLoader();
    await menuService.viewResponse(query.id).then((response) => {
      hideLoader();
      setComments(response.payload.all);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className=" w-100 p-5 heightAuto">
        <h2>View Question Set</h2>
        <div className="card">
          <div>
            <div className={Styles.heading}>
              Name: <span> {comments?.name}</span>
            </div>
            <div className={Styles.heading}>
              Phone: <span> {comments?.phone}</span>
            </div>
            <div className={Styles.heading}>
              Email: <span> {comments?.email}</span>
            </div>
            <div className={Styles.heading}>
              Current Profession: <span> {comments?.currentProfession}</span>
            </div>
            <div className={Styles.heading}>List Of Question:</div>

            <div className={Styles.cardGrid}>
              {comments.loq?.map((data, key) => (
                <>
                  <div className={Styles.cardGridItems}>
                    <div className={(Styles.cardBoxAlign, Styles.Cenetr)}>
                      <div className={Styles.circle} key={key}>
                        {key + 1}
                      </div>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Name: <span>{data.Question}</span>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Type: <span>{data.type}</span>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Right / Wrong:{" "}
                      <span>{data.isRight ? "Right" : "Wrong"}</span>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Option:{" "}
                      <span>
                        {data?.Option.map((record, i) => (
                          <>
                            <div>
                              {data?.Answer?.findIndex(
                                (e) => e === record?.no
                              ) !== -1 ? (
                                <div >
                                 {
                                record?.istrue ? <div className={Styles.green}>{record?.name}</div> : <div className={Styles.red}>{record?.name}</div>
                              }
                              
                                </div>
                              ) : (
                                <div >{record?.name}</div>
                              )}
                            
                            
                          
                            </div>
                          </>
                        ))}
                      </span>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewQuestionSet;
