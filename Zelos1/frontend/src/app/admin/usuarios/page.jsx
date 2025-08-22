'use client'
import React, { useState, useMemo } from 'react';
import './admin.css';
import Sidebar from '../../components/layout/sidebar_admin/Sidebar';
import Footer from '../../components/layout/footer/footer';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// --- COMPONENTES DOS POP-UPS ---

// NOVO: Pop-up de Alerta customizado
function AlertPopup({ message, onClose }) {
  return (
    <div className="popup-overlay">
      <motion.div 
        className="popup-content alert-popup" 
        initial={{ scale: 0.7, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.7, opacity: 0 }}
      >
        <div className="alert-popup-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
        </div>
        <h2>Aviso</h2>
        <p>{message}</p>
        <div className="popup-actions">
          <button type="button" className="btn-alert-ok" onClick={onClose}>OK</button>
        </div>
      </motion.div>
    </div>
  );
}


// Pop-up de Criação de Usuário (Modificado para usar o novo alerta)
function CreateUserPopup({ onSave, onCancel, onValidationError }) {
  const [nome, setNome] = useState('');
  const [ra, setRa] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('Usuário');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z\s]+$/.test(nome)) {
      onValidationError('O campo Nome deve conter apenas letras e espaços.');
      return;
    }
    if (!/^\d+$/.test(ra)) {
      onValidationError('O campo RA deve conter apenas números.');
      return;
    }
    if (senha.length < 4) {
      onValidationError('A senha deve ter no mínimo 4 caracteres.');
      return;
    }
    onSave({ nome, ra, senha, cargo });
  };

  return (
    <div className="popup-overlay">
      <motion.div className="popup-content" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
        <h2>Criar Novo Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label htmlFor="create-nome">Nome</label><input type="text" id="create-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Apenas letras e espaços" required /></div>
          <div className="form-group"><label htmlFor="create-ra">RA</label><input type="text" id="create-ra" value={ra} onChange={(e) => setRa(e.target.value)} placeholder="Apenas números" required /></div>
          <div className="form-group"><label htmlFor="create-senha">Senha</label><input type="password" id="create-senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 4 caracteres" required /></div>
          <div className="form-group"><label htmlFor="create-cargo">Cargo</label><select id="create-cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}><option value="Usuário">Usuário</option><option value="Técnico">Técnico</option></select></div>
          <div className="popup-actions"><button type="button" className="btn-action" onClick={onCancel}>Cancelar</button><button type="submit" className="btn-add-user">Criar Usuário</button></div>
        </form>
      </motion.div>
    </div>
  );
}

// Pop-up de Edição de Usuário (Modificado para usar o novo alerta)
function EditUserPopup({ user, onSave, onCancel, onValidationError }) {
  const [nome, setNome] = useState(user.nome);
  const [ra, setRa] = useState(user.ra);
  const [cargo, setCargo] = useState(user.cargo);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z\s]+$/.test(nome)) {
      onValidationError('O campo Nome deve conter apenas letras e espaços.');
      return;
    }
    if (!/^\d+$/.test(ra)) {
      onValidationError('O campo RA deve conter apenas números.');
      return;
    }
    onSave({ ...user, nome, ra, cargo });
  };

  return (
    <div className="popup-overlay">
      <motion.div className="popup-content" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
        <h2>Editar Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label htmlFor="edit-nome">Nome</label><input type="text" id="edit-nome" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
          <div className="form-group"><label htmlFor="edit-ra">RA</label><input type="text" id="edit-ra" value={ra} onChange={(e) => setRa(e.target.value)} required /></div>
          <div className="form-group"><label htmlFor="edit-cargo">Cargo</label><select id="edit-cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}><option value="Usuário">Usuário</option><option value="Técnico">Técnico</option></select></div>
          <div className="popup-actions"><button type="button" className="btn-action" onClick={onCancel}>Cancelar</button><button type="submit" className="btn-save">Salvar Alterações</button></div>
        </form>
      </motion.div>
    </div>
  );
}

// Pop-up de Confirmação para Deletar
function DeleteConfirmPopup({ user, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay">
      <motion.div className="popup-content" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
        <h2>Confirmar Exclusão</h2>
        <p>Você tem certeza que deseja deletar o usuário <strong>{user.nome}</strong> (RA: {user.ra})?</p>
        <p>Essa ação não pode ser desfeita.</p>
        <div className="popup-actions"><button type="button" className="btn-action" onClick={onCancel}>Cancelar</button><button type="button" className="btn-delete-confirm" onClick={onConfirm}>Sim, Deletar</button></div>
      </motion.div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const usuariosIniciais = [
    { id: 1, nome: 'Administrador', ra: '0000', cargo: 'Admin' },
    { id: 2, nome: 'Fulano Técnico', ra: '12345', cargo: 'Técnico' },
    { id: 3, nome: 'Ciclano de Tal', ra: '67890', cargo: 'Usuário' },
    { id: 4, nome: 'Beltrano Silva', ra: '11223', cargo: 'Usuário' },
];
const shapesData = [...Array(6)].map((_, i) => ({ id: i, top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`, size: Math.random() * 20 + 10, parallaxFactor: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1), animate: { rotate: [0, Math.random() * 360 - 180, 0], scale: [1, Math.random() * 0.5 + 0.8, 1], }, transition: { duration: Math.random() * 20 + 15, repeat: Infinity, ease: "easeInOut", } }));

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isAlertPopupOpen, setAlertPopupOpen] = useState(false);
  
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAdicionarUsuario = (novoUsuarioData) => {
    const novoUsuario = { id: Date.now(), ...novoUsuarioData };
    setUsuarios(prevUsuarios => [...prevUsuarios, novoUsuario]);
    setCreatePopupOpen(false);
  };
  
  const handleSalvarEdicao = (updatedUser) => {
    setUsuarios(usuarios.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditPopupOpen(false);
    setCurrentUserToEdit(null);
  };

  const handleConfirmDelete = () => {
    setUsuarios(usuarios.filter(user => user.id !== userToDelete.id));
    setDeletePopupOpen(false);
    setUserToDelete(null);
  };
  
  const handleAbrirPopupEditar = (user) => { setCurrentUserToEdit(user); setEditPopupOpen(true); };
  const handleAbrirPopupDeletar = (user) => { setUserToDelete(user); setDeletePopupOpen(true); };

  const handleValidationError = (message) => {
    setAlertMessage(message);
    setAlertPopupOpen(true);
  };
  
  const handleClosePopups = () => {
    setCreatePopupOpen(false);
    setEditPopupOpen(false);
    setDeletePopupOpen(false);
    setAlertPopupOpen(false);
  };

  // Lógica da pesquisa
  const usuariosFiltrados = useMemo(() => 
    usuarios.filter(user => 
      user.ra.toLowerCase().includes(termoPesquisa.toLowerCase())
    ), [usuarios, termoPesquisa]
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const parallaxX = useTransform(x, (latest) => latest * 0.05);
  const parallaxY = useTransform(y, (latest) => latest * 0.05);
  const handleMouseMove = (event) => { const rect = event.currentTarget.getBoundingClientRect(); x.set(event.clientX - rect.width / 2); y.set(event.clientY - rect.height / 2); };

  return (
    <div className="user-management-layout-container">
      <Sidebar />
      <main className="main-content-area">
        <motion.div className="page-wrapper" onMouseMove={handleMouseMove}>
          <motion.div className="background"><div className="shapes-container">{shapesData.map(shape => <motion.div key={shape.id} className={`shape shape${shape.id % 3 + 1}`} style={{ top: shape.top, left: shape.left, width: shape.size, height: shape.size, x: useTransform(parallaxX, v => v * shape.parallaxFactor), y: useTransform(parallaxY, v => v * shape.parallaxFactor), }} animate={shape.animate} transition={shape.transition} />)}</div></motion.div>
          <div className="content-wrapper">
            <div className="user-management-container">
              <div className="admin-header">
                <h1>Gerenciar Usuários</h1>
                <button className="btn-open-create-popup" onClick={() => setCreatePopupOpen(true)}>+ Adicionar Novo Usuário</button>
              </div>
              
              {/* BARRA DE PESQUISA */}
              <div className="search-bar-container">
                <input type="search" placeholder="Pesquisar por RA..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} className="search-input" />
              </div>

              <div className="lista-usuarios-container">
                <div className="lista-usuarios-header">
                  <div className="col-nome">Nome</div><div className="col-ra">RA</div><div className="col-cargo">Cargo</div><div className="col-acoes-user">Ações</div>
                </div>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map(user => (
                    <div key={user.id} className="usuario-item">
                      <div className="col-nome">{user.nome}</div><div className="col-ra">{user.ra}</div><div className="col-cargo">{user.cargo}</div>
                      <div className="col-acoes-user">
                        <button className="btn-action edit" onClick={() => handleAbrirPopupEditar(user)} disabled={user.cargo === 'Admin'}>Editar</button>
                        <button className="btn-action delete" onClick={() => handleAbrirPopupDeletar(user)} disabled={user.cargo === 'Admin'}>Deletar</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results-message">Nenhum usuário encontrado.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
            {isCreatePopupOpen && <CreateUserPopup onSave={handleAdicionarUsuario} onCancel={handleClosePopups} onValidationError={handleValidationError} />}
            {isEditPopupOpen && <EditUserPopup user={currentUserToEdit} onSave={handleSalvarEdicao} onCancel={handleClosePopups} onValidationError={handleValidationError} />}
            {isDeletePopupOpen && <DeleteConfirmPopup user={userToDelete} onConfirm={handleConfirmDelete} onCancel={handleClosePopups} />}
            {isAlertPopupOpen && <AlertPopup message={alertMessage} onClose={handleClosePopups} />}
        </AnimatePresence>
        
        <Footer />
      </main>
    </div>
  );
}