'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/sidebar/Sidebar.jsx';
import Footer from '../components/layout/footer/footer';
import './usuario.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import axios from 'axios';

// Instância do Axios com token do login
const api = axios.create({
  baseURL: 'http://localhost:3001', // ajuste para a porta do seu backend
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Função para formatar datas do MySQL
const formatarData = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString.replace(' ', 'T')); // converte para ISO
  const opcoesData = { day: '2-digit', month: 'long', year: 'numeric' };
  const opcoesHora = { hour: '2-digit', minute: '2-digit' };
  const dataFormatada = data.toLocaleDateString('pt-BR', opcoesData);
  const horaFormatada = data.toLocaleTimeString('pt-BR', opcoesHora);
  return `${dataFormatada} às ${horaFormatada}`;
};

export default function ChamadosUsuario() {
  const [chamados, setChamados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [servico, setServico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [detalheAberto, setDetalheAberto] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const numberOfPoints = 6;
  const shapesData = [...Array(numberOfPoints)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    size: Math.random() * 20 + 10,
    parallaxFactor: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
    animate: { rotate: [0, Math.random() * 360 - 180, 0], scale: [1, Math.random() * 0.5 + 0.8, 1] },
    transition: { duration: Math.random() * 20 + 15, repeat: Infinity, ease: "easeInOut" }
  }));

  // Buscar chamados do usuário
  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await api.get('/pool');
        setChamados(response.data);
      } catch (error) {
        console.error('Erro ao buscar chamados:', error);
        alert('Erro ao carregar chamados');
      }
    };
    fetchChamados();
  }, []);

  // Criar novo chamado
  const abrirChamado = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !servico.trim() || !descricao.trim()) {
      alert('Por favor, preencha todos os campos do chamado.');
      return;
    }

    try {
      const novoChamado = { titulo, servico, descricao };
      const response = await api.post('/pool', novoChamado);
      setChamados([...chamados, response.data]);
      setTitulo('');
      setServico('');
      setDescricao('');
      setIsFormVisible(false);
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      alert('Erro ao criar chamado.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Aberto': return 'status-badge aberto';
      case 'Em Andamento': return 'status-badge em-andamento';
      default: return 'status-badge concluido';
    }
  };

  // Efeito parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const parallaxX = useTransform(x, latest => latest * 0.05);
  const parallaxY = useTransform(y, latest => latest * 0.05);
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.width / 2);
    y.set(event.clientY - rect.height / 2);
  };

  return (
    <div className="usuario-layout-container">
      <Sidebar />

      <main className="main-content-area">
        <motion.div className="page-wrapper" onMouseMove={handleMouseMove}>
          <motion.div className="background">
            {shapesData.map(shape => (
              <motion.div
                key={shape.id}
                className="shape"
                style={{ top: shape.top, left: shape.left, width: shape.size, height: shape.size }}
                animate={shape.animate}
                transition={shape.transition}
              />
            ))}
          </motion.div>

          <div className="content-wrapper">
            <div className="chamados-container">
              <h2 className="chamados-title">Abrir Chamados</h2>
              <p className="chamados-intro">
                Bem-vindo à nossa central de ajuda. Para registrar uma nova solicitação ou relatar um problema, clique no botão abaixo e preencha o formulário.
              </p>

              <div className="novo-chamado-container">
                {!isFormVisible ? (
                  <button className="abrir-chamado-btn" onClick={() => setIsFormVisible(true)}>
                    Abrir Novo Chamado
                  </button>
                ) : (
                  <form onSubmit={abrirChamado} className={`novo-chamado-form ${isFormVisible ? 'visible' : ''}`}>
                    <div className="form-header">
                      <h3>Abrir Novo Chamado</h3>
                      <button type="button" className="close-btn" onClick={() => setIsFormVisible(false)}>&times;</button>
                    </div>

                    <div className="linha-dupla">
                      <div className="input-group">
                        <label htmlFor="titulo">Título</label>
                        <input id="titulo" type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required maxLength={35} />
                      </div>
                      <div className="input-group">
                        <label htmlFor="servico">Serviço</label>
                        <select id="servico" value={servico} onChange={e => setServico(e.target.value)} required>
                          <option value="" disabled>Selecione um tipo</option>
                          <option value="Externo">Externo</option>
                          <option value="Manutenção">Manutenção</option>
                          <option value="Apoio Técnico">Apoio Técnico</option>
                          <option value="Limpeza">Limpeza</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="descricao">Descrição</label>
                      <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required rows="4" maxLength={250}></textarea>
                    </div>

                    <button type="submit" className="submit-button">Enviar Chamado</button>
                  </form>
                )}
              </div>

              <div className="meus-chamados-grid">
                {chamados.map(c => (
                  <div key={c.id} className="meus-chamado-card">
                    <div className="meus-card-header">
                      <span className="protocolo">{c.protocolo || `#${c.id}`}</span>
                      <span className={getStatusClass(c.status || 'Aberto')}>{c.status || 'Aberto'}</span>
                    </div>

                    <h3>{c.assunto}</h3>
                    <p><strong>Serviço:</strong> {c.servico}</p>
                    <p><strong>Data:</strong> {formatarData(c.criado_em)}</p>
                    <p><strong>Descrição:</strong> {c.descricao}</p>

                    <button className="detalhes-btn" onClick={() => setDetalheAberto(c)}>Ver Detalhes</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <Footer />
      </main>

      {detalheAberto && (
        <div className="modal-overlay" onClick={() => setDetalheAberto(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{detalheAberto.assunto}</h3>
              <button className="close-btn" onClick={() => setDetalheAberto(null)}>&times;</button>
            </div>
            <p><strong>Protocolo:</strong> {detalheAberto.protocolo}</p>
            <p><strong>Serviço:</strong> {detalheAberto.servico}</p>
            <p><strong>Data:</strong> {formatarData(detalheAberto.data)}</p>
            <p><strong>Status:</strong> {detalheAberto.status}</p>
            <hr />
            <p><strong>Descrição:</strong> {detalheAberto.descricao}</p>
          </div>
        </div>
      )}
    </div>
  );
}
