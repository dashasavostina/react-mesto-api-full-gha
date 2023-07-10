import React from "react";

export default function Login(props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleEmail(e) {
      setEmail(e.target.value)
    }

    function handlePassword(e) {
        setPassword(e.target.value)
    }

    function handleSubmitButton(e) {
        e.preventDefault();
        props.handleLogin(password, email);
    }

    return(
          <div className="auth">
            <h3 className="auth__title">Вход</h3>
            <form className="auth__form" onSubmit={handleSubmitButton}>
                <label className="auth__label">
                    <input 
                    required 
                    type="email"
                    name="email"
                    id="email-input"
                    placeholder="Email" 
                    minLength="8"
                    maxLength="40"
                    onChange={handleEmail} 
                    value={email || ''}
                    className="auth__input" />
                    <span className="email-input-error auth__input-error"/>
                </label>
                <label className="auth__label">
                    <input 
                    required 
                    type="password"
                    name="password"
                    id="password-input"
                    placeholder="Пароль" 
                    minLength="6"
                    maxLength="18"
                    onChange={handlePassword} 
                    value={password || ''}
                    className="auth__input" />
                    <span className="password-input-error auth__input-error"/>
                </label>
                <button className="auth__submit-button" type="submit">Войти</button>
            </form>
          </div>
    )
}