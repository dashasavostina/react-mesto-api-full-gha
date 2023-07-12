import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import React, { useEffect, useState} from "react";
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import PopupWithForm from "./PopupWithForm";
import { apiJoin } from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import { apiAuth } from "../utils/apiAuth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [email, setEmail] = useState('');
  const [isLogged, setLogged] = useState(false);
  const [isSuccessInfoTooltipStatus, setIsSuccessInfoTooltipStatus] = useState(false);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const userToken = localStorage.getItem('token');
      if (userToken) {
        Promise.all([apiJoin.getUserData(), apiJoin.getInitialCards()])
        .then(([userData, cardObject]) => {
        setCurrentUser(userData);
        setCards(cardObject);
      })
      .catch((err) => {
        console.log(`Возникла глобальная ошибка: ${err}`);
      });
      }
  }, [isLogged]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((id) => id === currentUser._id);

    apiJoin
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`При лайке карточки возникла ошибка: ${err}`);
      });
  }

  function handleCardDelete(card) {
    apiJoin
      .deleteCard(card._id)
      .then(() => {
        setCards((arrayOfCards) =>
          arrayOfCards.filter((item) => item._id !== card._id)
        );
      })
      .catch((err) => {
        console.log(`Ошибка при удалении карточки: ${err}`);
      });
  }

  function handleCardClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: card.name,
      link: card.link,
    });
  }

  function handleConfirmClick() {
    setIsConfirmPopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setInfoTooltipOpen(false);
  }

  function handleUpdateUser(userData) {
    apiJoin
      .sendUserData(userData)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`При редактировании профиля произошла ошибка: ${err}`);
      });
  }

  function handleUpdateAvatar(link) {
    apiJoin
      .sendAvatarData(link)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка обновления аватара: ${err}`);
      });
  }

  function handleAddPlaceSubmit(card) {
    apiJoin
      .addNewCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`При добавлении новой карточки возникла ошибка: ${err}`);
      });
  }

  useEffect( () => {
    const userToken = localStorage.getItem('token');
    if (userToken) { 
      apiAuth.checkToken(userToken)
        .then( (res) => { 
          setEmail(res.email); 
          setLogged(true); 
          history.push('/') })
        .catch( (err) => { 
          localStorage.removeItem('token');
          console.log(`Возникла ошибка верификации токена: ${err}`) })
    }
  }, [history, isLogged])

  function handleRegister(password, email) {
    apiAuth.register(password, email) 
    .then(() => {
      setInfoTooltipOpen(true);
      setIsSuccessInfoTooltipStatus(true);
      history.push('/sign-in');
    })
    .catch((err) => {
      console.log(`Возникла ошибка при регистрации: ${err}`);
      setInfoTooltipOpen(true);
      setIsSuccessInfoTooltipStatus(false);
    })
  }

  function handleLogin(password, email) {
    apiAuth.authorize(password, email)
    .then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        setEmail(email);
        setLogged(true);
        history.push('/');
      }
    })
    .catch((err) => {
      console.log(`Возникла ошибка при авторизации: ${err}`);
      setInfoTooltipOpen(true);
      setIsSuccessInfoTooltipStatus(false);
    })
  }

  function handleLogout () { 
    localStorage.removeItem('token'); 
    setLogged(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header 
          isLogged = {isLogged}
          email = {email}
          logOut = {handleLogout}
        />
        <Switch>
          <ProtectedRoute exact path="/"
            isLogged = {isLogged}
            component = {Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />
          <Route path="/sign-in">
            <Login 
              handleLogin = {handleLogin}
              isOpen = {infoTooltipOpen}
              onClose = {closeAllPopups}
              status = {isSuccessInfoTooltipStatus}
            />
          </Route>
          <Route path="/sign-up">
            <Register 
              handleRegister = {handleRegister}
              isOpen = {infoTooltipOpen}
              onClose = {closeAllPopups}
              status = {isSuccessInfoTooltipStatus}
            />
          </Route>
          <Route path="/*">{<Redirect to={isLogged ? "/" : "/sign-in"}/>}</Route>
        </Switch>
        <Footer />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ImagePopup
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          card={selectedCard}
        />
        <InfoTooltip 
          isOpen ={infoTooltipOpen}
          onClose = {closeAllPopups}
          status = {isSuccessInfoTooltipStatus}
        />
        <PopupWithForm
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          title="Вы уверены?"
          name="confirm"
          children={
            <button className="popup__submit popup__submit_confirm" type="submit">
              Да
            </button>
          }
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
