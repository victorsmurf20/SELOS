import { create, readAll, read, update, deleteRecord } from '../../config/database.js';

const listarUsuarios = async () => {
  try {
    return await readAll('usuarios');
  } catch (error) {
    console.error('Erro ao listar os usuários:', error);
    throw error;
  }
};


const obterUsuarioPorId = async (id) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    const where = `id = ?`; // Define a condição
    const result = await read('usuarios', where, [id]); // Passa a tabela, a condição e os parâmetros
    return result;
  } catch (error) {
    console.error('Erro ao obter o usuário por ID:', error);
    throw error;
  }
};

const criarUsuario = async (UsuarioData) => {
  try {
    await create('usuarios', UsuarioData);
    return ("O usuário criado com sucesso!")
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
    throw error;
  }
};

const atualizarUsuario = async (id, UsuarioData) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    const fields = Object.keys(UsuarioData).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(UsuarioData);
    const query = `UPDATE usuarios SET ${fields} WHERE id = ?`;
    const result = update(query, [...values, id]);
    return result.affectedRows
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    throw error;
  }
};



const excluirUsuario = async (id) => {
  try {
  return await deleteRecord('usuarios', `id = ${id}`)
  } catch (error) {
    console.error('Erro ao excluir o o usuário', error)
  }
};

export { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, excluirUsuario };