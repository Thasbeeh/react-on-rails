import { useState } from 'react';
import './list_users.css';
import avatarImg from '../../assets/react.svg';
import appLogo from '../../assets/appLogo.png';
import LogOutUser from './log_out.jsx'

function ListUser(props) {
  const [search, setSearch] = useState('');

  const filteredUsers = props.users
    ? props.users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const usersToDisplay = search ? filteredUsers : props.users;

  return (
    <div className="left-pane">
      <div className="logo-container">
        <img  className="app-logo" src={appLogo} alt="App Logo" />
        <LogOutUser />
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
          <div key={user.id} className="user-item" onClick={() => props.onUserClick(user)}>
            <img className="avatar" src={avatarImg} alt="avatar" />
            <div className="box-item">{user.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListUser;