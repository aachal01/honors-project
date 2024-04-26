const { log } = require("./common/utils");
const { readCertificate, readMaskedCertificate } = require("./common/fs");
const { certificateHash } = require("./common/utils");

async function main() {
  // const certificate = await readCertificate();
  const certificate = await readMaskedCertificate();
  const hash = await certificateHash(certificate)
  log({
    certificateHash: hash,
  })
}

main()