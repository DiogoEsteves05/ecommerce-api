export const errorHandler = (err, req, res, next) => {
    // obter a propriedade stack do erro
    const stack = err?.stack;
    // obter o status de erro se houver, caso não esteja definido o erro default é 500
    const statusCode = err?.statusCode ? err?.statusCode : 500;
    // obter a propriedade mensagem do erro
    const message = err?.message;
    
    // resposta de erro
    res.status(statusCode).json({
      stack,
      message,
    });
  };
  
  // 404 error handler
  // caso o utilizador tente aceder a uma página não existente recebe o erro de página não encontrada
  export const notFound = (req, res, next) => {
    const err = new Error(`${req.originalUrl} not found`);
    // definir o estado do erro como sendo 404 Not Found
    err.statusCode = 404;
    next(err);
  };
  