'use client'

import React, { useState } from "react";
import './components/login/login.css';
import { motion } from "framer-motion"; // Importe motion

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
  
    if (!username || !password) {
      setErro('Todos os campos devem ser preenchidos');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Salva o token e os dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
  
  // Redirecionamento baseado na role
switch (data.user.role) {
  case 'admin':
    window.location.href = '/admin';
    break;
  case 'tecnico':
    window.location.href = '/tecnico';
    break;
  case 'usuario':
  default:
    window.location.href = '/usuario';
    break;
}

  
      } else {
        alert(data.error);
      }
  
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao conectar com o servidor');
    }
  };
  
  const numberOfPoints = 15; // Define o número de pontos flutuantes

  return (
    // Removi a definição de fundo gradiente do 'login-page' para o CSS abaixo
    <div className="login-page">

      {/* 1. Container do Background Animado */}
      <div className="background">
        {/* Elementos geométricos flutuantes */}
        {/* Adicionei a classe 'shapes-container' para melhor organização do CSS */}
        <div className="shapes-container">
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="shape shape1"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="shape shape2"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="shape shape3"
          />

          {/* Linhas conectoras animadas */}
          <svg className="connecting-lines">
            <motion.line
              x1="10%"
              y1="20%"
              x2="90%"
              y2="80%"
              stroke="#d32f2f"
              strokeWidth="1"
              strokeDasharray="5,5"
              animate={{
                strokeDashoffset: [0, 20]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.line
              x1="80%"
              y1="10%"
              x2="20%"
              y2="90%"
              stroke="#d32f2f"
              strokeWidth="1"
              strokeDasharray="8,8"
              animate={{
                strokeDashoffset: [0, -16]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>

          {/* Pontos flutuantes */}
          {[...Array(numberOfPoints)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 3 + (i * 0.5),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="floating-point"
              style={{
                left: `${10 + (i * 5)}%`,
                top: `${15 + (i * 4)}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo principal (Formulário, Header, Footer) */}
      <div className="content">
        <header className="login-header">
          <div className="logo">
            <strong>SENAI</strong> | CHAMADOS ONLINE
          </div>
        </header>
        {/* ... (Restante do conteúdo principal) */}
        <main className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <p className="login-subtitle">Bem-vindo(a) ao Portal Online SENAI-SP!</p>

            <div className="input-group">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Insira seu RA"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                maxLength={25}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button type="submit">Avançar</button>
          </form>
        </main>

        <footer className="login-footer">
          © SENAI-SP - 2025
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;