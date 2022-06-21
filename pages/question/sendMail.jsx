import React, { useState } from "react";
import { useEffect } from "react";
import Styles from "../Question/sendmail.module.scss";
import { adminService, alertService } from "services";
import router, { useRouter } from "next/router";

function SendMail() {
  const { query } = useRouter();
  
  const [state, setState] = useState({
    items: [],
    value: "",
    error: null,
  });
  const handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      var value = state.value.trim();

      if (value && isValid(value)) {
        setState({
          ...state,
          items: [...state.items, state.value],
          value: "",
        });
      }
    }
  };

  const handleChange = (evt) => {
    setState({
      ...state,
      value: evt.target.value,
      error: null,
    });
  };

  const handleDelete = (item) => {
    setState({
      ...state,
      items: state.items.filter((i) => i !== item),
    });
  };

  const handlePaste = (evt) => {
    evt.preventDefault();

    var paste = evt.clipboardData.getData("text");
    var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      var toBeAdded = emails.filter((email) => !this.isInList(email));
      setState({
        ...state,
        items: [...state.items, ...toBeAdded],
      });
    }
  };

  const isValid = (email) => {
    let error = null;

    if (isInList(email)) {
      error = `${email} has already been added.`;
    }

    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      setState({ ...state, error });

      return false;
    }
    return true;
  };

  const isInList = (email) => {
    return state.items.includes(email);
  };

  const isEmail = (email) => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  const sendPeperSet = () => {
    const data = {
      email: state.items,
      Qsetid: query?.id,
      // link: `http://localhost:3000/account/pepersetpublic/peperset?id=${query.id}`,
      link: `https://sip-demo.netlify.app/account/pepersetPublic/peperset?id=${query.id}`,
    };

    return adminService
      .sendMail(data)
      .then((datas) => {
       
        alertService.success(datas.message, { keepAfterRouteChange: true });
        setState({
          ...state,
          items: [],
          value: "",
        });
        router.push("/question/questionSet");
      })
      .catch(alertService.error);
  };

  return (
    <>
      <div className="heightAuto p-5">
        <h2>Send Link to Interviewer</h2>
        <div className="col-md-5">
          <div className="card">
            {state.items.map((item) => (
              <div className={Styles.tagItem} key={item}>
                {item}
                <button
                  type="button"
                  className={Styles.button}
                  onClick={() => handleDelete(item)}
                >
                  &times;
                </button>
              </div>
            ))}

            <input
              className={Styles.inputs}
              value={state.value}
              placeholder="Type or paste email addresses and press `Enter`..."
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => handleChange(e)}
              onPaste={(e) => handlePaste(e)}
            />

            <div className="py-2">
              {state.error && <p className={Styles.error}>{state.error}</p>}
            </div>
            <div className="py-2">
              {state.items.length ? (
                <>
                  <button
                    type="submit"
                    onClick={() => sendPeperSet()}
                    className="btn btn-primary mr-2"
                  >
                    Send Mail
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SendMail;
