export const getTokenFromHeader = (req) => {
  // obtem o token da header do pedido http
    const token = req?.headers?.authorization?.split(" ")[1];
  // verifica se encontrou o token
  if (token === undefined) {
    return "No token found in the header";
  } else {
    return token;
  }
};
