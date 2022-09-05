require('dotenv').config({path: './lookmate.env'})
module.exports = {
    ROLE_ID:process.env.ROLE_ID,
    SECRET_ID:process.env.SECRET_ID,
    VAULT_VERSION:process.env.VAULT_VERSION,
    VAULT_HOST:process.env.VAULT_HOST
};