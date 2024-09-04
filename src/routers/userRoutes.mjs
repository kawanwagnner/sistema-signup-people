// routes/index.mjs
import { Router } from "express";
import {
  getUsers,
  deleteUser,
  update,
  getUserProfile, // Adicionando a importação para getUserProfile
} from "../Controllers/userController.mjs"; // Corrigido para o diretório correto
// import { authMiddleware } from "../middleware/token_auth.mjs";

const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.delete("/users/:id", deleteUser);
userRouter.put("/users/update/:id", update);
userRouter.get("/users/profile/:id", getUserProfile);

export default userRouter;