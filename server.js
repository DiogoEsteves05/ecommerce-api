// o proposito deste ficheiro e' corre a aplicacao
// qualquer outra logica deve ficar dentro da pasta app
import http from 'http';
import app from './app/app.js'

// constante com o port definido no ambiente caso exista, ou o 8080
const PORT = process.env.PORT || 8080;
// criar o servidor - recebe como parametro a aplicacao express
const server = http.createServer(app);
// para ficar a ouvir o servidor na porta
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
