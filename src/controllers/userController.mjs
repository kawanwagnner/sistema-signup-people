// controllers/userController.mjs
import { generateToken } from "../middleware/token_auth.mjs";
import bcrypt from "bcrypt";
import User from "../models/user.mjs";

// Função para atualizar o perfil do usuário
const update = async (req, res, next) => {
  try {
    // Obter o ID do usuário a partir dos parâmetros da rota
    const userId = req.params.id;

    // Verifica se o ID do usuário foi fornecido e é válido
    if (!userId) {
      return res.status(400).json({ msg: "ID do usuário inválido." });
    }

    // Procura o usuário pelo ID
    const user = await User.findById(userId);

    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    // Atualiza os campos do usuário com os valores fornecidos
    const { name, payOrNot, email, password } = req.body;

    if (name) user.name = name;
    if (payOrNot) user.payOrNot = payOrNot;
    if (email) user.email = email;

    // Se a senha for fornecida, criptografa antes de salvar
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Salva as alterações no banco de dados
    const updatedUser = await user.save();

    // Remove informações sensíveis do usuário antes de enviar a resposta
    updatedUser.password = undefined;

    // Retorna o perfil atualizado do usuário com uma mensagem de sucesso
    return res
      .status(200)
      .json({ msg: "Perfil atualizado com sucesso!", profile: updatedUser });
  } catch (err) {
    // Em caso de erro, retorna uma mensagem de erro detalhada
    return res
      .status(500)
      .json({ msg: `Erro ao atualizar o perfil: ${err.message}` });
  }
};

// Função para deletar o usuário
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id; // Obter o ID do usuário a ser excluído

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Função para obter todos os usuários
const getUsers = async (req, res, next) => {
  try {
    // Busca todos os usuários no banco de dados
    const users = await User.find();

    // Mapeia os usuários, gerando um token para cada um
    const usersWithTokens = users.map((user) => {
      // Gera um token com base no ID do usuário
      const token = generateToken(user._id);

      // Remove a senha antes de retornar os dados
      user.password = undefined;

      // Retorna o usuário junto com o token
      return {
        user,
        token,
      };
    });

    // Retorna a lista de usuários com tokens
    return res.status(200).json(usersWithTokens);
  } catch (err) {
    // Em caso de erro, retorna uma mensagem de erro detalhada
    return res
      .status(500)
      .json({ msg: `Erro ao obter os usuários: ${err.message}` });
  }
};

// Função para obter o perfil de um único usuário
const getUserProfile = async (req, res, next) => {
  try {
    // Obter o ID do usuário a partir dos parâmetros da rota
    const userId = req.params.id;

    // Verificar se o ID do usuário foi fornecido
    if (!userId) {
      return res.status(400).json({ msg: "ID do usuário não fornecido." });
    }

    // Procurar o usuário pelo ID fornecido
    const user = await User.findById(userId);

    // Se o usuário não for encontrado, retornar uma resposta 404
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    // Remover a senha e outros dados sensíveis das informações retornadas
    user.password = undefined;
    user.posts = undefined;

    // Pegando token
    const token = generateToken(userId);

    // Retornar o perfil do usuário na resposta
    return res.status(200).json({ profile: user, token });
  } catch (err) {
    // Se ocorrer um erro, retornar uma resposta de erro 500 com detalhes do erro
    return res.status(500).json({ msg: err.message });
  }
};

export { getUsers, update, deleteUser, getUserProfile };
