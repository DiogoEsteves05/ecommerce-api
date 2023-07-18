import asyncHandler from "express-async-handler";
import Brand from "../model/BrandModel.js";
import Category from "../model/CategoryModel.js";
import Product from "../model/ProductModel.js";


// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    // obter parametros
    const { name, description, category, price, totalQty, brand } = req.body;
    // converte imagem
    const convertedImgs = req.files.map((file) => file?.path);
    
    // procura se ja existe um produto com o mesmo nome
    const productExists = await Product.findOne({ name });
    // se existir da erro
    if (productExists) {
        throw new Error("Product Already Exists");
    }
    // procura pela marca
    const brandFound = await Brand.findOne({
        name: brand,
    });
    // se marca nao existir da erro
    if (!brandFound) {
        throw new Error("Brand not found, please create brand first");
    }
    // procura pela categoria
    const categoryFound = await Category.findOne({
        name: category,
    });
    // se categoria nao existir da erro
    if (!categoryFound) {
        throw new Error("Category not found, please create category first");
    }
    // cria um produto
    const product = await Product.create({
        name,
        description,
        category,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
        images: convertedImgs,
    });
    // coloca o produto na categoria
    categoryFound.products.push(product._id);
    await categoryFound.save();
    // coloca o produto na marca
    brandFound.products.push(product._id);
    await brandFound.save();

    //envia resposta de sucesso ao utilizador
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    // procura produtos existentes
    let productQuery = Product.find();

    // se procura por nome filtra por nome
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i" },
        });
    }

    // se existir filtro de marca
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" },
        });
    }

    // se existir filtro de categoria
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: "i" },
        });
    }
    
    /// se existir filtro de preco minimo e maximo
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] },
        });
    }
    // como podem existir muitos produtos para mostrar e' necessario usar paginacao
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    // resultados por pagina
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    // join reviews a produtos
    const products = await productQuery.populate("reviews");
    // envia resposta de sucesso
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
    // procura produto por id
    const product = await Product.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "user",
            select: "fullname",
        },
    });
    // se nao encontra da' erro
    if (!product) {
        throw new Error("Prouduct not found");
    }
    // envia mensagem de sucesso com produto encontrado
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    });
});

// @desc    update  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    // obter parametros
    const { name, description, category, user, price, totalQty, brand} = req.body;
    // procura produto por id e atualiza com novos parametros
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            category,
            user,
            price,
            totalQty,
            brand,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    // envia mensagem de sucesso
    res.json({
        status: "success",
        message: "Product updated successfully",
        product,
    });
});

// @desc    delete  product
// @route   DELETE /api/products/:id/delete
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    // procura produto por id e apaga
    await Product.findByIdAndDelete(req.params.id);
    // envia mensagem de sucesso
    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
});
