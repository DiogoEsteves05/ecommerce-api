import User from "../model/UserModel.js";

// verificar se utilizador tem o cargo de administrador
const isAdmin = async (req, res, next) => {
  // procura o utilizador através do id
  const user = await User.findById(req.userAuthId);
  // se o utilizador existir confirma se e' admin
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error("Access denied, admin only"));
  }
};

export default isAdmin;
