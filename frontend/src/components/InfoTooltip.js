import React from "react";
import success from "../images/success.svg";
import error from "../images/error.svg";

export default function InfoTooltip(props) {

  return (
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`} id={props.id}>
        <div className="popup__container">
            <button type="button" className="popup__close" onClick={props.onClose} />
            <div className="auth__info">
              <img src={props.status ? success : error} alt="иконка" className="auth__status-icon"/>
              <p className="auth__status-text">
                {props.status ? "Вы успешно зарегистрировались!" 
                : "Что-то пошло не так! Попробуйте ещё раз."}</p>
            </div>
        </div>
    </div>
  )
}