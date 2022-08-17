
const vaultCredentials = require("../config/secret-bind-config");
const infoMessages = require("../config/info-messages");
var adminConfig = require('../config/adminConf');
const logger = require("../logger");
const vault = require("node-vault")({
  apiVersion: adminConfig.vault_secrets_version,
  endpoint: adminConfig.vault_secrets_service,
});

const runSecretFetcher = async () => {
  const result = await vault.approleLogin({
    role_id: vaultCredentials.ROLE_ID,
    secret_id: vaultCredentials.SECRET_ID,
  });


  vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.
  const dataSecrets = {
    dbConfigSecret : (await vault.read("kv-v1/data/mysql/webapp")).data, // Retrieve the secret stored in previous steps.
    authConfigSecret : (await vault.read("kv-v1/data/config/auth")).data // Retrieve the secret stored in previous steps.
  }

  
  logger.info(infoMessages.SUCCESS_SECRET_FETCHED, { service : "IntSec" });
  return dataSecrets;
};
module.exports = runSecretFetcher();
