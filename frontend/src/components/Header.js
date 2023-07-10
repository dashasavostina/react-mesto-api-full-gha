import {Link, Route} from "react-router-dom";

export default function Header(props) {
  return (
    <header className="header">
      <a
        href="https://dashasavostina.github.io/mesto-react/"
        className="header__logo"
      ></a>
      <div className="header__logged">
        {props.isLogged ? (
          <>
            <p className="header__menu">{props.email}</p>
            <Link to="/sign-in" className="header__menu" onClick={props.logOut}>Выйти</Link>
          </>
        ) : (
          <>
            <Route path="/sign-up">
              <Link to="/sign-in" className="header__menu">Вход</Link>
            </Route>
            <Route path="/sign-in">
              <Link to="/sign-up" className="header__menu">Регистрация</Link>
            </Route>
          </>
        )}
      </div>
    </header>
  );
}
