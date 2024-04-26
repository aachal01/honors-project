const fs = require('fs/promises')
const path = require('path')

async function saveObject(obj, fileName) {
    await fs.writeFile(path.resolve(__dirname, "../data", fileName), JSON.stringify(obj, null, 2));
}

async function readObject(fileName) {
    return JSON.parse(
        await fs.readFile(path.resolve(__dirname, "../data", fileName), { encoding: 'utf-8' })
    )
}

async function saveMaskedCertificate(certificate) {
    return saveObject(certificate, '02.certificate-masked.json')
}

async function saveCertificate(certificate) {
    return saveObject(certificate, '01.certificate.json')
}

async function readMaskedCertificate() {
    return readObject('02.certificate-masked.json')
}

async function readCertificate() {
    return readObject('01.certificate.json')
}

async function readCertificateData() {
    return readObject('00.certificate-data.json')
}

module.exports = {
    saveMaskedCertificate,
    saveCertificate,
    readMaskedCertificate,
    readCertificate,
    readCertificateData
}
