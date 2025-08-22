// models/Chamado.js
import { create, readAll, read, update, deleteRecord } from '../../config/database.js';

const listarChamado = async () => {
  try {
    return await readAll('chamado');
  } catch (error) {
    console.error('Erro ao listar os chamados:', error);
    throw error;
  }
};


const obterChamadoPorId = async (id) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    const where = `id = ?`; // Define a condição
    const result = await read('chamado', where, [id]); // Passa a tabela, a condição e os parâmetros
    return result;
  } catch (error) {
    console.error('Erro ao obter o chamado por ID:', error);
    throw error;
  }
};

const criarChamado = async (ChamadoData) => {
  try {
    await create('chamado', ChamadoData);
    return ("Chamado criado com sucesso!")
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
};

const atualizarChamado = async (id, ChamadoData) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    const fields = Object.keys(ChamadoData).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(ChamadoData);
    const query = `UPDATE chamado SET ${fields} WHERE id = ?`;
    const result = update(query, [...values, id]);
    return result.affectedRows
  } catch (error) {
    console.error('Erro ao atualizar o chamado:', error);
    throw error;
  }
};



const excluirChamado = async (id) => {
  try {
    return await deleteRecord('chamado', `id = ${id}`)
  } catch (error) {
    console.error('Erro ao excluir o chamado', error)
  }
};

export { listarChamado, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado };