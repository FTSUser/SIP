import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { questionService } from "services";
import Styles from "../Question/questionSet.module.scss";

function ViewQuestionSet() {
  const { query } = useRouter();
  const [comments, setComments] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const getData = async () => {
    showLoader();
    await questionService.getQuestionSetByID(query.id).then((response) => {
      hideLoader();
      setComments(response.payload.Propertys);
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
              Description: <span> {comments?.description}</span>
            </div>
            <div className={Styles.heading}>List Of Question:</div>

            <div className={Styles.cardGrid}>
              {comments.ListofQuestion?.map((data, key) => (
                <>
                  <div className={Styles.cardGridItems}>
                    <div className={(Styles.cardBoxAlign, Styles.Cenetr)}>
                      <div className={Styles.circle} key={key}>
                        {key + 1}
                      </div>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Name: <span>{data.Qname}</span>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Type: <span>{data.type}</span>
                    </div>
                    <div className={Styles.cardBoxAlign}>
                      Option:{" "}
                      <span>
                        {data?.Option.map((record, i) => (
                          <>
                            {record?.istrue ? (
                              <div className={Styles.green}>{record?.name}</div>
                            ) : (
                              <div className={Styles.red}>{record?.name}</div>
                            )}
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
