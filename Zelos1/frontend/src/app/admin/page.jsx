'use client'
import React, { useState } from 'react';
import './admin.css';
import Sidebar from '../components/layout/sidebar_admin/Sidebar';
import Footer from '../components/layout/footer/footer'; // <- FOOTER IMPORTADO AQUI
import { motion, useMotionValue, useTransform } from 'framer-motion';

const chamadosAdmIniciais = [
  { id: 1, protocolo: '#2025-0158', assunto: 'Computador do laboratório 3 não liga', categoria: 'Manutenção de Equipamento', data: '28/07/2025', status: 'Aberto', descricao: 'O computador da bancada 3 no laboratório de informática não está apresentando nenhum sinal de energia ao ser ligado.' },
  { id: 2, protocolo: '#2025-0159', assunto: 'Não consigo acessar o Wi-Fi', categoria: 'Problemas com Wi-Fi', data: '30/07/2025', status: 'Em Andamento', descricao: 'A rede Wi-Fi da biblioteca está conectando mas não fornece acesso à internet.' },
  { id: 3, protocolo: '#2025-0160', assunto: 'Problema ao acessar o Portal do Aluno que possui um nome muito longo para testar a funcionalidade de quebra de linha e ver mais', categoria: 'Acesso ao Portal', data: '15/07/2025', status: 'Concluído', descricao: 'O portal do aluno estava apresentando erro 503, mas o problema já foi resolvido pela equipe de TI. A descrição também pode ser muito longa e precisa quebrar a linha corretamente dentro do modal para não estragar o layout, como por exemplo: umtextomuitolongosemespaçosprecisaquebrar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.' },
  { id: 4, protocolo: '#2025-0161', assunto: 'Projetor da sala 5 não funciona', categoria: 'Manutenção de Equipamento', data: '01/08/2025', status: 'Aberto', descricao: 'A lâmpada do projetor da sala 5 parece ter queimado, pois não emite mais luz.' },
];

const shapesData = [...Array(6)].map((_, i) => ({ id: i, top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`, size: Math.random() * 20 + 10, parallaxFactor: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1), animate: { rotate: [0, Math.random() * 360 - 180, 0], scale: [1, Math.random() * 0.5 + 0.8, 1], }, transition: { duration: Math.random() * 20 + 15, repeat: Infinity, ease: "easeInOut", } }));

export default function ChamadosAdm() {
  const [chamados, setChamados] = useState(chamadosAdmIniciais);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('details');
  const [currentChamado, setCurrentChamado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [chamadoToDelete, setChamadoToDelete] = useState(null);
  const [isReadyToDelete, setIsReadyToDelete] = useState(false);

  const MAX_ASSUNTO_LENGTH = 50;

  const handleOpenModal = (mode, chamado = null) => {
    setModalMode(mode);
    setCurrentChamado(chamado || { assunto: '', categoria: '', status: 'Aberto', descricao: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentChamado(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentChamado(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      const newChamado = {
        ...currentChamado,
        id: Date.now(),
        protocolo: `#${new Date().getFullYear()}-0${Math.floor(Math.random() * 1000)}`,
        data: new Date().toLocaleDateString('pt-BR'),
      };
      setChamados(prev => [newChamado, ...prev]);
    } else if (modalMode === 'edit') {
      setChamados(prev => prev.map(c => c.id === currentChamado.id ? currentChamado : c));
    }
    handleCloseModal();
  };

  const openDeleteConfirm = (chamado) => {
    setChamadoToDelete(chamado);
    setIsConfirmModalOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmModalOpen(false);
    setIsReadyToDelete(false);
    setChamadoToDelete(null);
  };

  const handleConfirmDelete = () => {
    setChamados(chamados.filter(c => c.id !== chamadoToDelete.id));
    closeDeleteConfirm();
  };

  const filteredChamados = chamados.filter(c => {
      const term = searchTerm.toLowerCase();
      return c.protocolo.toLowerCase().includes(term) ||
             c.assunto.toLowerCase().includes(term) ||
             c.categoria.toLowerCase().includes(term) ||
             c.status.toLowerCase().includes(term);
  });

  const stats = {
    total: chamados.length,
    abertos: chamados.filter(c => c.status === 'Aberto').length,
    emAndamento: chamados.filter(c => c.status === 'Em Andamento').length,
    concluidos: chamados.filter(c => c.status === 'Concluído').length,
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const parallaxX = useTransform(x, (latest) => latest * 0.05);
  const parallaxY = useTransform(y, (latest) => latest * 0.05);
  const handleMouseMove = (event) => { const rect = event.currentTarget.getBoundingClientRect(); x.set(event.clientX - rect.width / 2); y.set(event.clientY - rect.height / 2); };
  const getStatusClass = (status) => { if (status === 'Aberto') return 'aberto'; if (status === 'Em Andamento') return 'em-andamento'; if (status === 'Concluído') return 'concluido'; return ''; };

  return (
    <div className="admin-layout-container">
      <Sidebar />
      <main className="main-content-area">
        <motion.div className="page-wrapper" onMouseMove={handleMouseMove}>
          <motion.div className="background">
            <div className="shapes-container">
              {shapesData.map(shape => <motion.div key={shape.id} className={`shape shape${shape.id % 3 + 1}`} style={{ top: shape.top, left: shape.left, width: shape.size, height: shape.size, x: useTransform(parallaxX, v => v * shape.parallaxFactor), y: useTransform(parallaxY, v => v * shape.parallaxFactor), }} animate={shape.animate} transition={shape.transition} />)}
            </div>
          </motion.div>

          <div className="content-wrapper">
            <div className="admin-container">
              <div className="admin-header"><h1>Painel Administrativo</h1></div>
              
              <div className="stats-container">
                <div className="stat-card total"><h4>Total de Chamados</h4><p>{stats.total}</p></div>
                <div className="stat-card aberto"><h4>Abertos</h4><p>{stats.abertos}</p></div>
                <div className="stat-card em-andamento"><h4>Em Andamento</h4><p>{stats.emAndamento}</p></div>
                <div className="stat-card concluido"><h4>Concluídos</h4><p>{stats.concluidos}</p></div>
              </div>
              
              <div className="controls-container">
                <input type="search" placeholder="🔎 Buscar por protocolo, assunto, status..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="btn-create" onClick={() => handleOpenModal('create')}>Criar Novo Chamado</button>
              </div>

              <div className="chamados-list-container">
                <div className="chamados-list-header">
                  <div className="col-protocolo">Protocolo</div>
                  <div className="col-assunto">Assunto</div>
                  <div className="col-data">Data</div>
                  <div className="col-status">Status</div>
                  <div className="col-acoes">Ações</div>
                </div>
                
                {filteredChamados.map(c => (
                  <div key={c.id} className="chamado-list-item">
                    <div className="col-protocolo" data-label="Protocolo">{c.protocolo}</div>
                    <div className="col-assunto" data-label="Assunto">
                      {c.assunto.length > MAX_ASSUNTO_LENGTH ? (
                        <span>
                          {`${c.assunto.substring(0, MAX_ASSUNTO_LENGTH)}...`}
                          <span 
                            className="ver-mais-text" 
                            onClick={() => handleOpenModal('details', c)}
                          > 
                            Ver mais...
                          </span>
                        </span>
                      ) : (
                        c.assunto
                      )}
                    </div>
                    <div className="col-data" data-label="Data">{c.data}</div>
                    <div className="col-status" data-label="Status"><span className={`status-badge ${getStatusClass(c.status)}`}>{c.status}</span></div>
                    <div className="col-acoes" data-label="Ações">
                      <button className="btn-action details" onClick={() => handleOpenModal('details', c)}>Ver</button>
                      <button className="btn-action edit" onClick={() => handleOpenModal('edit', c)}>Editar</button>
                      <button className="btn-action delete" onClick={() => openDeleteConfirm(c)}>Deletar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{modalMode === 'create' ? 'Criar Novo Chamado' : modalMode === 'edit' ? 'Editar Chamado' : 'Detalhes do Chamado'}</h2>
                  <button className="btn-close-modal" onClick={handleCloseModal}>&times;</button>
                </div>
                {modalMode === 'details' ? (
                  <div className="details-view">
                    <p><strong>Protocolo:</strong> {currentChamado.protocolo}</p>
                    <p><strong>Data:</strong> {currentChamado.data}</p>
                    <p><strong>Status:</strong> {currentChamado.status}</p>
                    <p><strong>Categoria:</strong> {currentChamado.categoria}</p>
                    <p><strong>Assunto:</strong> {currentChamado.assunto}</p>
                    <p><strong>Descrição:</strong> {currentChamado.descricao}</p>
                  </div>
                ) : (
                  <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group"><label htmlFor="assunto">Assunto</label><input type="text" id="assunto" name="assunto" value={currentChamado.assunto} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label htmlFor="categoria">Categoria</label><input type="text" id="categoria" name="categoria" value={currentChamado.categoria} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label htmlFor="status">Status</label><select id="status" name="status" value={currentChamado.status} onChange={handleInputChange}><option value="Aberto">Aberto</option><option value="Em Andamento">Em Andamento</option><option value="Concluído">Concluído</option></select></div>
                    <div className="form-group"><label htmlFor="descricao">Descrição</label><textarea id="descricao" name="descricao" value={currentChamado.descricao} onChange={handleInputChange} rows="4"></textarea></div>
                    <div className="modal-footer"><button type="submit" className="btn-save">Salvar</button></div>
                  </form>
                )}
              </div>
            </div>
          )}

          {isConfirmModalOpen && (
            <div className="modal-overlay" onClick={closeDeleteConfirm}>
              <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Confirmar Deleção</h3>
                <p>Você tem certeza que deseja deletar o chamado <strong>{chamadoToDelete?.protocolo}</strong>? Esta ação não pode ser desfeita.</p>
                <div className="confirm-modal-footer">
                  <button className="confirm-modal-btn cancel" onClick={closeDeleteConfirm}>Cancelar</button>
                  <button 
                    className={`confirm-modal-btn delete ${isReadyToDelete ? 'confirm' : ''}`}
                    onClick={() => {
                      if (isReadyToDelete) {
                        handleConfirmDelete();
                      } else {
                        setIsReadyToDelete(true);
                      }
                    }}
                  >
                    {isReadyToDelete ? 'Confirmar Deleção?' : 'Deletar Chamado'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* FOOTER ADICIONADO AQUI */}
        <Footer />
      </main>
    </div>
  );
}