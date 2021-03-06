const jwt = require('jsonwebtoken');
const config = require('../../config/auth');
const { promisify } = require('util');

/*
    Middleware Recebe 3 parametros:
    1° req = requisição
    2° res = resposta
    3° next = continuar a requisição
*/
module.exports = async (req, res, next) => {
    const token = req.body.token;

    // Se não existir um header de autorização, vai retornar um erro.
    if(!token){
        return res.status(401).json({
            error: true,
            message: 'Token de autenticação não existe!'
        })
    }


    //Decodificando o Token.
    try {
        const decoded = await promisify(jwt.verify)(token, config.secret);

        if(!decoded){
            return res.status(401).json({
                error: true,
                message: 'O Token está expirado'
            })
        }else{
            req.user_id = decoded.id;
            next();
        }
    } catch {
        return res.status(401).json({
            error: true,
            message: 'O Token está inválido. Autentique novamente para gerar um novo token!'
        })
    }

}