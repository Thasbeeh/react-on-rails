import { useState } from 'react';
import './list_users.css';
import avatarImg from '../../assets/react.svg';
import appLogo from '../../assets/appLogo.png';
import LogOutUser from './log_out.jsx';
import TextType from '../animations/TextType';

function ListUser(props) {
  const [search, setSearch] = useState('');
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const [activeUserId, setActiveUserId] = useState(false);
  const filteredUsers = props.users
    ? props.users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const usersToDisplay = search ? filteredUsers : props.users;

  const handleClick = (user) => {
    props.onUserClick(user);
    setActiveUserId(user.id);
  }

  return (
    <div className="left-pane">
      <div className="logo-container">
        <img  className="app-logo" src={appLogo} alt="App Logo" />
        <TextType
          text={[
            `Hi, ${currentUser.username} 👋`,
            "Hope you’re having an amazing day 🌞",
            "Ready for some action? 🔥",
            "Let’s get things rolling 🚀"
          ]}
          typingSpeed={80}
          deletingSpeed={40}
          pauseDuration={1500}
          className="my-text"
          textColors={["#ffffff"]}
        />
      </div>
      <div className="search-user-field">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="scrollable-box">
        {usersToDisplay.map((user) => (
          <div key={user.id} className={`user-item ${activeUserId === user.id ? 'active' : ''}`} onClick={() => handleClick(user)}>
            <img className="avatar" src={avatarImg} alt="avatar" />
            <div className="box-item">{user.username}</div>
          </div>
        ))}
      </div>
      <div className="logo-container user-panel">
        <LogOutUser />
      </div>
    </div>
  );
}

export default ListUser;