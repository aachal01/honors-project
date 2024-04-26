const { certificateHash } = require("./common/utils");

async function verifyCertificate(certificate, originalHash) {
    const calculatedHash = certificateHash(certificate);
    return calculatedHash === originalHash;
}

module.exports = {
    verifyCertificate
}

