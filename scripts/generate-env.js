const fs = require("fs");
const path = require("path");
const successColor = "\x1b[32m%s\x1b[0m";
const checkSign = "\u{2705}";
require("dotenv").config();

const envVars = {
  production: process.env.NODE_ENV === "prod",
  apiUrl: process.env.API_URL,
};

console.log("Loaded environment variables:", envVars);

let envFile = `export const environment = {
    production: ${envVars.production},
    apiUrl: '${envVars.apiUrl}',
  };`;

const targetPath = path.join(__dirname, `./environments`);
const targetFile = path.join(targetPath, `/environment.ts`);

if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });

fs.writeFile(targetFile, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.info(
      successColor,
      `${checkSign} Successfully generated environment file`
    );
  }
});