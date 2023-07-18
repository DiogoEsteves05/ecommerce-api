import jwt from "jsonwebtoken";

// usamos o id do user para gerar o token
const generateToken = (id) => {
    // gera um token que expira em 3 dias
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "3d" });
};

export default generateToken;
