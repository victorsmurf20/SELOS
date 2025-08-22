import React, { useState, useEffect, useRef } from 'react';
import './sidebar.css';
// Se você for usar ícones, importe-os. Ex: import { FiUsers } from 'react-icons/fi';

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userData = {
    firstName: 'Roberto',
    fullName: 'Roberto da Silva',
    role: 'Administrador',
    ra: '123456789',
    avatarUrl: 'https://i.pravatar.cc/150'
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img 
            src="/Senai.png" 
            alt="Logo SENAI"
          />
        </div>

        {/* ÁREA ADICIONADA */}
        <nav className="sidebar-nav">
          <a href="/admin" className="nav-link">
            {/* <FiUsers />  Exemplo com ícone */}
            <span>Dashbord</span>
          </a>
          <a href="/admin/usuarios" className="nav-link">
            {/* <FiUsers />  Exemplo com ícone */}
            <span>Usuários</span>
          </a>
          {/* Adicione outros links aqui, por exemplo:
          <a href="/Admin/cursos" className="nav-link">
            <span>Cursos</span>
          </a>
          */}
        </nav>
        
      </div>

      <div className="sidebar-bottom" ref={dropdownRef}>
        {isDropdownOpen && (
          <div className="profile-dropdown-sidebar">
            <div className="dropdown-info">
              <h4>{userData.fullName}</h4>
              <p>{userData.role}</p>
              <p>RA: {userData.ra}</p>
            </div>
            <a href="/" className="dropdown-logout-btn">
              {/* <FiLogOut /> */}
              <span>Sair</span>
            </a>
          </div>
        )}

        <button onClick={toggleDropdown} className="profile-trigger-sidebar">
          <img src={userData.avatarUrl} alt="Avatar do usuário" className="profile-avatar" />
          <span className="profile-name">{userData.firstName}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;