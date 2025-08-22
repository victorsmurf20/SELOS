'use client';
import React, { useState } from 'react';
import './tecnico.css';
import Sidebar from '../components/layout/sidebar/Sidebar.jsx';
import Footer from '../components/layout/footer/footer';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// --- As constantes de dados iniciais permanecem as mesmas ---
const chamadosIniciais = [
  { id: 1, protocolo: '#2025-0158', assunto: 'Computador do laboratório 3 não liga', categoria: 'Manutenção de Equipamento', data: '28/07/2025', status: 'PENDENTE', ownerId: 1, checklist: ['Verificar fonte de energia', 'Testar cabo de força', 'Analisar conexões da placa-mãe'], descricao: 'O computador da bancada 3 no laboratório de informática não está apresentando nenhum sinal de energia ao ser ligado. Nenhuma luz acende e a ventoinha não gira.' },
  { id: 2, protocolo: '#2025-0159', assunto: 'Manutenção Preventiva Torno CNC', categoria: 'Oficina Mecânica', data: '27/07/2025', status: 'EM ANDAMENTO', ownerId: 2, checklist: ['Limpeza geral da máquina', 'Lubrificação dos eixos e barramentos', 'Verificação do painel de controle e software'], descricao: 'Manutenção preventiva periódica agendada para o Torno CNC. O técnico já iniciou o procedimento de limpeza e lubrificação.' },
  { id: 3, protocolo: '#2025-0160', assunto: 'Formatar Computador da Recepção', categoria: 'Infraestrutura TI', data: '26/07/2025', status: 'CONCLUÍDO', ownerId: 1, checklist: ['Realizar backup de arquivos importantes', 'Instalar Sistema Operacional e drivers', 'Instalar softwares essenciais (Office, etc)'], descricao: 'O computador da recepção foi formatado com sucesso. Todos os programas necessários foram reinstalados e o backup restaurado.' },
  { id: 4, protocolo: '#2025-0161', assunto: 'Rede Wi-Fi instável na biblioteca', categoria: 'Infraestrutura TI', data: '29/07/2025', status: 'PENDENTE', ownerId: 2, checklist: ['Verificar roteador', 'Testar cabos de rede', 'Analisar sinal'], descricao: 'A rede Wi-Fi na área da biblioteca está caindo constantemente.' },
];
const shapesData = [...Array(6)].map((_, i) => ({ id: i, top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`, size: Math.random() * 20 + 10, parallaxFactor: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1), animate: { rotate: [0, Math.random() * 360 - 180, 0], scale: [1, Math.random() * 0.5 + 0.8, 1], }, transition: { duration: Math.random() * 20 + 15, repeat: Infinity, ease: "easeInOut", } }));

export default function PainelChamados() {
  const [chamados, setChamados] = useState(chamadosIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInProgressOnly, setShowInProgressOnly] = useState(false);

  // --- As funções de manipulação de estado permanecem as mesmas ---
  const handleAssignToMe = (chamadoId) => { setChamados(prevChamados => prevChamados.map(chamado => chamado.id === chamadoId ? { ...chamado, status: 'EM ANDAMENTO' } : chamado)); };
  const handleConcluirChamado = (chamadoId) => { setChamados(prevChamados => prevChamados.map(chamado => chamado.id === chamadoId ? { ...chamado, status: 'CONCLUÍDO' } : chamado)); };
  const abrirModalDetalhes = (chamado) => { setChamadoSelecionado(chamado); setModalAberto(true); };
  const fecharModal = () => { setModalAberto(false); setChamadoSelecionado(null); };

  const filteredChamados = chamados
    .filter(chamado => !showInProgressOnly || chamado.status === 'EM ANDAMENTO')
    .filter(chamado => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        chamado.assunto.toLowerCase().includes(lowerSearchTerm) ||
        chamado.protocolo.toLowerCase().includes(lowerSearchTerm) ||
        chamado.categoria.toLowerCase().includes(lowerSearchTerm)
      );
    });

  const chamadosPendentes = filteredChamados.filter(c => c.status === 'PENDENTE');
  const chamadosEmAndamento = filteredChamados.filter(c => c.status === 'EM ANDAMENTO');
  const chamadosConcluidos = filteredChamados.filter(c => c.status === 'CONCLUÍDO');

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const parallaxX = useTransform(x, (latest) => latest * 0.05);
  const parallaxY = useTransform(y, (latest) => latest * 0.05);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.width / 2);
    y.set(event.clientY - rect.height / 2);
  };

  return (
    // <!-- ESTRUTURA CORRIGIDA: Início do container principal -->
    <div className="tecnico-layout-container">
      <Sidebar />

      {/* <!-- ESTRUTURA CORRIGIDA: Área de conteúdo principal que ficará ao lado da sidebar --> */}
      <main className="main-content-area">
        <motion.div className="page-wrapper" onMouseMove={handleMouseMove}>
          <motion.div className="background">
            {/* O conteúdo do background animado permanece aqui */}
          </motion.div>

          <div className="content-wrapper">
            <div className="painel-container">
              <div className="painel-header">
                <div><h1>Painel de Chamados</h1></div>
                <div className="mostrar-meus-chamados">
                  <span>Mostrar apenas "Em Andamento"</span>
                  <label className="switch">
                    <input type="checkbox" checked={showInProgressOnly} onChange={(e) => setShowInProgressOnly(e.target.checked)} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div className="filtros-container">
                <input type="search" placeholder="🔎 Buscar por título, ID, setor..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="colunas-wrapper">
                {/* Coluna PENDENTE */}
                <div className="coluna-chamados">
                  <div className="coluna-header"><h2>PENDENTE</h2><span className="contador">{chamadosPendentes.length}</span></div>
                  {chamadosPendentes.map(c => (
                    <div key={c.id} className="chamado-card">
                      <div className="card-header"><span className="chamado-id">{c.protocolo}</span></div>
                      <h3 className="card-title">{c.assunto}</h3>
                      <p className="card-category pendente">{c.categoria}</p>
                      <p className="card-data">Data: {c.data}</p>
                      <div className="card-footer">
                        <button className="btn-atribuir" onClick={() => handleAssignToMe(c.id)}>Adicionar a trabalho</button>
                        <button className="btn-detalhes" onClick={() => abrirModalDetalhes(c)}>Detalhes</button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Coluna EM ANDAMENTO */}
                <div className="coluna-chamados">
                   <div className="coluna-header"><h2>EM ANDAMENTO</h2><span className="contador">{chamadosEmAndamento.length}</span></div>
                   {chamadosEmAndamento.map(c => (
                    <div key={c.id} className="chamado-card">
                       <div className="card-header"><span className="chamado-id">{c.protocolo}</span></div>
                       <h3 className="card-title">{c.assunto}</h3>
                       <p className="card-category em-andamento">{c.categoria}</p>
                       <p className="card-data">Data: {c.data}</p>
                       <div className="card-footer">
                         <button className="btn-concluir" onClick={() => handleConcluirChamado(c.id)}>Concluir</button>
                         <button className="btn-detalhes" onClick={() => abrirModalDetalhes(c)}>Detalhes</button>
                       </div>
                     </div>
                   ))}
                </div>
                {/* Coluna CONCLUÍDO */}
                <div className="coluna-chamados">
                   <div className="coluna-header"><h2>CONCLUÍDO</h2><span className="contador">{chamadosConcluidos.length}</span></div>
                   {chamadosConcluidos.map(c => (
                     <div key={c.id} className="chamado-card">
                       <div className="card-header"><span className="chamado-id">{c.protocolo}</span></div>
                       <h3 className="card-title">{c.assunto}</h3>
                       <p className="card-category concluido">{c.categoria}</p>
                       <p className="card-data">Data: {c.data}</p>
                       <div className="card-footer">
                         <button className="btn-detalhes" onClick={() => abrirModalDetalhes(c)}>Detalhes</button>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* O Footer fica dentro do <main>, mas fora do .page-wrapper */}
        <Footer />
      </main>

      {/* O Modal pode ficar fora do fluxo principal */}
      {modalAberto && chamadoSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{chamadoSelecionado.assunto}</h3>
            <p><strong>Protocolo:</strong> {chamadoSelecionado.protocolo}</p>
            <p><strong>Categoria:</strong> {chamadoSelecionado.categoria}</p>
            <p><strong>Data:</strong> {chamadoSelecionado.data}</p>
            <h4>Descrição:</h4>
            <p>{chamadoSelecionado.descricao}</p>
            <h4>Checklist:</h4>
            <ul className="checklist">
              {chamadoSelecionado.checklist.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
            <button className="btn-fechar-modal" onClick={fecharModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}