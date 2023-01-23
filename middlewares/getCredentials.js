const crypto = require("crypto");
const fs = require("fs");
var privateKey = fs.readFileSync("./config/pem/auth/fabricbas.pem", "ascii");
// const environment = process.env.NODE_ENV || "development";

//*------------------------------Middleware For Decryption---------------------------------
 
module.exports = (req, res, next) => {
  const { cloudCreds } = req.body;

  if (!cloudCreds) {
    res.status(404).json({ message: "Access Denied: => Restricted Access" });
  }

  try {
    const test_mode = false; //Encryption Disabled
    if (test_mode) {
      const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          oaepHash: "sha256",
          passphrase: "Ch@nge20201",
        },
        cloudCreds
      );
      console.log("Decrypted Data => ", JSON.parse(decryptedData));
    }

    req.body.cloudCreds = cloudCreds;
    next();
  } catch (err) {
    res.status(404).send("Access Denied => ", err.message);
  }
};
