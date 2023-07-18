import User from "../model/UserModel.js";
// expressAsyncHandler e' usado envolta (wrapper) da funcao para lidar (handle) com os erros
import asyncHandler from "express-async-handler";
// bcrypt e' usado para encriptar a senha
import bcrypt from "bcryptjs";
// generateToken funcao auxiliar para gerar tokens
import generateToken from "../utils/GenerateToken.js"

// @desc Register user
// @route POST /api/users/register
// @acess Private/Admin
export const registerUser = asyncHandler(async(req, res) => {
    // parametros a receber
    const { name, email, password } = req.body;

    // verificar se o email do utilizador ainda não existe
    const userExist = await User.findOne({ email });
    if(userExist) {
        // devolve erro de utilizador já registado
        throw new Error("User already exists");
    }
    // encriptar a password a ser guardada na base de dados
    // getSalt dannos uma sequência de caracteres randon por default 10
    // (quando maior o valor mais seguro mas mais lento)
    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(password, salt);

    // caso o utilizador ainda não exista, vamos criar o utilizador
    const user = await User.create({
        name,
        email,
        password: encriptedPassword,
    });
    // enviamos uma resposta com o estado de sucesso 201
    res.status(201).json({
        status: "success",
        message: "User registered with success.",
        data: user,
    });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    // parametros a receber
    const { email, password } = req.body;

    //procura user pelo email
    const userFound = await User.findOne({
      email,
    });
    // se o utilizador existe e a senha estiver correta
    // usamos bcrypt porque a senha esta encriptada
    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
      res.json({
        status: "success",
        message: "User logged in successfully",
        userFound,
        token: generateToken(userFound?._id),
      });
    } else {
        // caso utilizador nao exista ou a senha esteja incorreta
        throw new Error("Invalid login credentials");
    }
  });


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  // procura o utilizador
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});
  
  // @desc    Update user shipping address
  // @route   PUT /api/users/update/shipping
  // @access  Private
  export const updateShippingAddres = asyncHandler(async (req, res) => {
    // parametros a receber
    const {
      name,
      address,
      city,
      postalCode,
      phone,
    } = req.body;
    
    // procura utilizador e atualiza
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        shippingAddress: {
          name,
          address,
          city,
          postalCode,
          phone,
        },
        hasShippingAddress: true,
      },
      {
        new: true,
      }
    );
    
    res.json({
      status: "success",
      message: "User shipping address updated successfully",
      user,
    });
  });
  