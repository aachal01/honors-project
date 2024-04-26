const { readCertificate } = require("./common/fs");
const { certificateHash, log } = require("./common/utils");
const { readCertificateHashFromBlockchain } = require("./common/web3");

async function verifyCertificate(certificate) {
    const calculatedHash = await certificateHash(certificate);
    const originalHash = await readCertificateHashFromBlockchain(certificate.id)
    console.log({
        calculatedHash,
        originalHash,
    })
    return calculatedHash === originalHash;
}

async function main() {
    const certificate = await readCertificate();
    const isVerified = await verifyCertificate(certificate);
    log({
        isVerified
    })
}

main();