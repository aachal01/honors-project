const bcrypt = require('bcryptjs');

async function generateHash(data, salt) {
    return bcrypt.hash(data, salt);
}

// Function to calculate the final hash based on nested data structure
async function treeHash(obj) {
    let hash = "";

    if (typeof obj !== 'object' || obj === null || obj === undefined)
        throw new Error('Invalid Certificate Entry')

    if (obj.isMasked) {
        hash = obj.hash;
    }
    else if (Array.isArray(obj.value)) {
        const hashes = await Promise.all(obj.value.map(treeHash));
        const concatenatedHash = hashes.join('#');
        hash = await generateHash(concatenatedHash, obj.id);
    } else {
        const value = obj.value;
        const key = obj.key ?? '';
        const salt = obj.id;
        hash = await generateHash(key + value, salt);
    }
    return hash;
}

const certificateObject = {
    "id": "$2a$10$3Yy/1s.Vh8i6QbaJ/C6nYO",
    "issuedTo": "ethereum address",
    "data": {
        "isMasked": false,
        "type": "map",
        "value": [
            {
                "key": "string_key",
                "isMasked": false,
                "type": "string",
                "value": "string_value",
                "id": "$2a$10$H02rcFkKs5Hrya9gQQK.9O"
            },
            {
                "key": "number_key",
                "isMasked": false,
                "type": "number",
                "value": 12345678,
                "id": "$2a$10$6DIlqjCr14LPybq5K936se"
            },
            {
                "key": "boolen_key",
                "isMasked": false,
                "type": "boolean",
                "value": true,
                "id": "$2a$10$4fDk6wLAszceh.bEfzfUa."
            },
            {
                "key": "map_key",
                "isMasked": false,
                "type": "map",
                "value": [
                    {
                        "key": "key1",
                        "isMasked": false,
                        "type": "string",
                        "value": "value1",
                        "id": "$2a$10$JEKHhhlAno3Nv.pZFh9lL."
                    },
                    {
                        "key": "key2",
                        "isMasked": false,
                        "type": "string",
                        "value": "value2",
                        "id": "$2a$10$VjjYjt3klKYJsixzsfdyCu"
                    }
                ],
                "id": "$2a$10$gzIdDq4KjcHigjccjZds9O"
            },
            {
                "key": "array_key",
                "isMasked": false,
                "type": "array",
                "value": [
                    {
                        "key": "0",
                        "isMasked": false,
                        "type": "string",
                        "value": "val1",
                        "id": "$2a$10$4EIjZnYUMk35FO751qLe5e"
                    },
                    {
                        "key": "1",
                        "isMasked": false,
                        "type": "number",
                        "value": 12345678,
                        "id": "$2a$10$Shewyz1NG1PF68FG/SNUx."
                    },
                    {
                        "key": "2",
                        "isMasked": false,
                        "type": "boolean",
                        "value": true,
                        "id": "$2a$10$ZFqzfpjzmkU.01ArAj36wu"
                    },
                    {
                        "hash": "$2a$10$FhMRK8HyIUziSDr.T2SpJuz8qa8Ih/FnCOIZshijE6o2zAjKAjVyG",
                        "isMasked": true,
                        "id": "$2a$10$FhMRK8HyIUziSDr.T2SpJu"
                    },
                    {
                        "key": "4",
                        "isMasked": false,
                        "type": "array",
                        "value": [
                            {
                                "key": "0",
                                "isMasked": false,
                                "type": "number",
                                "value": 1,
                                "id": "$2a$10$IxTz/VlsExsSPJmgNaedze"
                            }
                        ],
                        "id": "$2a$10$wKdHQzSOtidBKZjl5MTnTe"
                    }
                ],
                "id": "$2a$10$4QWAC.tjVFDyyZ4Y5vwL0e"
            }
        ],
        "id": "$2a$10$4glORIQP6RoVNRAdeY69ne"
    }
}

// async function main() {
//     console.time('hash');
//     const hash = await treeHash(certificateObject.data)
//     console.timeEnd('hash');
//     console.log("Final Hash: ", hash);
// }

// main()

