import React from 'react';
import './Header.scss';

// import UserImg from '../../assets/ava.jpg';
import TriangleSvg from '../../assets/yield1.svg';

export default function Header({ userInfo, signOut }) {
  const [isVisibleForm, setFormVisibility] = React.useState(false);

  function showMenu() {
    setFormVisibility(!isVisibleForm);
  }

  function inter() {
    signOut();
    showMenu();
  }

  return (
    <>
      <div className="header">
        <p className="header__logo">On Time</p>
        <div className="header__user">
          {!userInfo && (
            <div
              style={{ background: '#cbcbcb' }}
              alt="user"
              className="user-image"
            />
          )}
          {!!userInfo && (
            <img src={userInfo.imgUrl} alt="user" className="user-image" />
          )}
          <img
            src={TriangleSvg}
            alt="menu"
            className="menu-image"
            onClick={showMenu}
          />
        </div>
      </div>
      {isVisibleForm && (
        <div className="menu">
          <ul className="menu__ul">
            <li onClick={inter}>Sign Out</li>
          </ul>
        </div>
      )}
    </>
  );
}
