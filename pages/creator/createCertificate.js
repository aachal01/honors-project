const bcrypt = require('bcryptjs');

const jsonDataInput = {
    "string_key": "string_value",
    "number_key": 12345678,
    "boolen_key": true,
    "map_key": {
        "key1": "value1",
        "key2": "value2"
    },
    "array_key": [
        "val1",
        12345678,
        true,
        {
            "key1": "value1"
        },
        [1]
    ]
};

// const jsonDataInput = 3

async function generateSalt() {
    return bcrypt.genSalt(10);
}

async function createCertificate(jsonObj) {
    
    const certificateId = await generateSalt() // Generate a random id

    async function transformData(obj) {
        const id = await generateSalt(); // Generate a random id
        if (typeof obj === 'string') {
            return {
                isMasked: false,
                type: 'string',
                value: obj,
                id
            };
        } else if (typeof obj === 'number') {
            return {
                isMasked: false,
                type: 'number',
                value: obj,
                id
            };
        } else if (typeof obj === 'boolean') {
            return {
                isMasked: false,
                type: 'boolean',
                value: obj,
                id
            };
        } else if (Array.isArray(obj)) {
            const transformedArray = await Promise.all(obj.map(async (item, key) => ({
                key: String(key),
                ...(await transformData(item))
            })));
            return {
                isMasked: false,
                type: 'array',
                value: transformedArray,
                id
            };
        } else if (typeof obj === 'object' && obj !== null) {
            const transformedMap = await Promise.all(Object.entries(obj).map(async ([key, value]) => ({
                key,
                ...(await transformData(value))
            })));
            return {
                isMasked: false,
                type: 'map',
                value: transformedMap,
                id
            };
        } else {
            throw new Error('Unsupported data type');
        }
    }

    const transformedData = await transformData(jsonObj);
    
    const certificate = {
        id: certificateId,
        issuedTo: 'ethereum address',
        data: transformedData
    };

    return certificate;
}

// Usage example
createCertificate(jsonDataInput)
    .then(certificate => {
        console.log(JSON.stringify(certificate, null, 2));
    })
    .catch(err => {
        console.error('Error creating certificate:', err);
    });