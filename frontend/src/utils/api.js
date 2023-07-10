import {apiData} from "./utils";  
  
  class Api {
    constructor({ link}) {
        this._link = link;
    }

    _checkResponce(res) {
      if (res.ok) {
        return res.json()
      } else {
        return Promise.reject(`Ошибка: ${res.status}`)
      }
    }

    addNewCard(name, link) {
      const token = localStorage.getItem('token');
      return fetch(`${this._link}/cards`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({ name, link})
      })
      .then(res => {
        return this._checkResponce(res)
      })
    }

    getInitialCards() {
      const token = localStorage.getItem('token');
        return fetch(`${this._link}/cards`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
          }
        })
          .then(res => { return this._checkResponce(res) })
    }

    deleteCard(cardId) {
      const token = localStorage.getItem('token');
        return fetch(`${this._link}/cards/${cardId}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
          },
          method: 'DELETE',
        })
          .then(res => { return this._checkResponce(res) })
    }

    getUserData() {
      const token = localStorage.getItem('token');
        return fetch(`${this._link}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
          }
        })
          .then(res => { return this._checkResponce(res) })
    }

    sendUserData(profileData) {
      const token = localStorage.getItem('token');
        return fetch(`${this._link}/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
          method: 'PATCH',
          body: JSON.stringify({ name: profileData.name, about: profileData.job })
        })
          .then(res => { return this._checkResponce(res) })
      }

    sendAvatarData(avatarLink) {
      const token = localStorage.getItem('token');
        return fetch(`${this._link}/users/me/avatar`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
          },
          method: 'PATCH',
          body: JSON.stringify({ avatar: avatarLink.avatar })
        })
          .then(res => { return this._checkResponce(res) })
      }

    changeLikeCardStatus(cardId, isLiked) {
      const token = localStorage.getItem('token');
      if (isLiked) {
        return fetch(`${this._link}/cards/${cardId}/likes`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
          },
          method: 'PUT',
        })
          .then(res => { return this._checkResponce(res) })
      } else {
        return fetch(`${this._link}/cards/${cardId}/likes`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
          },
          method: 'DELETE',
        })
          .then(res => { return this._checkResponce(res) })
      }
    }
}

export const apiJoin = new Api(apiData);