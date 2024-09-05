// controllers/userController.mjs
import User from "../models/user.mjs";
import { generateToken } from "../middleware/token_auth.mjs";

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe com o e-mail fornecido
    const user = await User.findOne({ email });

    // Se o usuário não existe, retornar uma mensagem de erro
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    // Verificar se a senha fornecida corresponde à senha armazenada no banco de dados
    if (password !== user.password) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }

    // Se as credenciais estiverem corretas, gerar um novo token de autenticação
    const token = generateToken(user._id);

    // Remover a senha do usuário das informações retornadas
    user.password = undefined;

    // Retornar as informações do usuário junto com o token de autenticação
    return res.status(200).json({ user, token });
  } catch (error) {
    // Se ocorrer um erro, retornar uma resposta de erro 500 com detalhes do erro
    return res.status(500).json({ status: "error", error: error.message });
  }
};

const signUp = async (req, res) => {
  const { name, payOrNot, endereco, quantidade } = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ msg: "Digite um valor diferente de null para o nome." });
    }

    if (!payOrNot) {
      return res
        .status(400)
        .json({ msg: "Digite um valor diferente de null para o payOrNot." });
    }

    if (!endereco) {
      return res
        .status(400)
        .json({ msg: "Digite um valor diferente de null para o endereco." });
    }

    // Criar um novo usuário com os dados fornecidos
    const newUser = new User({
      name,
      payOrNot,
      endereco,
      quantidade,
    });

    // Salvar o novo usuário no banco de dados
    const userSaved = await newUser.save();

    // Retornar o novo usuário na resposta (sem token)
    return res.status(200).json({ newUser: userSaved });
  } catch (error) {
    // Se ocorrer um erro, retornar uma resposta de erro 500 com detalhes do erro
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export { signIn, signUp };
