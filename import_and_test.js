const fs = require('fs');
const crypto = require('crypto');

// this is how the data has to be loaded.  no other method is allowed
const domainData = require('./domain_blacklist_b64_test1.json');

// load the blacklisted domains from the JSON file to validate against
// this is allowed to load via fs as its only for testing purposes
const DOMAINS = JSON.parse(fs.readFileSync('blacklists_api.json', 'utf8'));
const KEY_CHAR = domainData.c || 2; // characters for the key
const PRECISION = domainData.p || 8; // total binary precision (64 bits)

function topBytesFromBase64(sha256Hash) {
    // Convert to base64 backup and replace '+/' with '-_'
    let result = Buffer.from(sha256Hash).toString('base64').replace(/[+/]/g, (c) => (c === '+' ? '-' : '_'));
    const k = result.slice(0, KEY_CHAR);
    const v = result.slice(KEY_CHAR, PRECISION);
    return { k, v };
}

function isSubstringAligned(str, substr) {
    let index = str.indexOf(substr);
    while (index !== -1) {
        if (index % (PRECISION - KEY_CHAR) === 0) {
            return index;
        }
         // Continue searching for next occurrence if not boundary aligned
        index = str.indexOf(substr, index + 1);
    }
    return false;
}

// validate the domains against the precomputed hashes
for (let i = 0; i < DOMAINS.length; i++) {
    const input = crypto.createHash('sha512').update(DOMAINS[i]).digest();
    const { k: key, v: value } = topBytesFromBase64(input);
    index = isSubstringAligned(domainData.d[key], value);
    if (index !== false) {
        console.log(`Domain found: ${DOMAINS[i]} at ${index}`);
    } else {
        console.log(`ERROR Domain not found: ${DOMAINS[i]} ${index}`);
    }
}
console.log("FALSE DOMAIN CHECK");
var input = crypto.createHash('sha512').update("lsaidfba8sdbfaysdbnfyasndfyasdf").digest();
var { k: key, v: value } = topBytesFromBase64(input);
index = isSubstringAligned(domainData.d[key], value);
if (index !== false) {
    console.log(`ERROR Domain found: lsaidfba8sdbfaysdbnfyasndfyasdf at ${index}`);
} else {
    console.log(`FALSE CHECK PASSED Domain not found: lsaidfba8sdbfaysdbnfyasndfyasdf`);
}

console.log("Running collison test...");
start = performance.now();
var j = 0;
for (let d = 0; d < DOMAINS.length; d++) {
    // inner loop as randomise the domain for collision detection
    for (let i = 0; i < 10000000; i++) {
        var domain = DOMAINS[d] + i
        var input = crypto.createHash('sha512').update(domain).digest();
        var { k: key, v: value } = topBytesFromBase64(input);
        var index = isSubstringAligned(domainData.d[key], value);
        if (index !== false) {
            console.log(`Domain ${DOMAINS[d]} collisionDomain: ${domain} ${key} ${value} found at index ${index}`);
        } 
        j++;
    }
    console.log(`Iteration ${j} completed`);
}
