import { getTokenFromHeader } from "../utils/GetTokenFromHeader.js";
import { verifyToken } from "../utils/VerifyToken.js";

// verifica se o utilizador esta autenticado através do seu token 
export const isLoggedIn = (req, res, next) => {
  // obter o token da header
  const token = getTokenFromHeader(req);
  // verifica o token
  const decodedUser = verifyToken(token);
  
  if (!decodedUser) {
    throw new Error("Please login again");
  } else {
    // se o utilizador está autenticado, guarda o utilizador no objecto req
    req.userAuthId = decodedUser?.id;
    next();
  }
};
