# blacklist tests

This is strictly for testing how domain lists can be reduced to hashes with a specific precision so that theycan be tested against the blacklists

The resultant file is built in a larger source file so can only be imported with require()

The imported file can only be a JSON object

The data cannot be parsed as runtime as it impacts the speed at which the isolate can instantiate, so no loops to add a domain to a Set etc

Precision cant be under 48 bits as this causes collisions, look up the Birthday Paradox

generate_json.php - this generates the JSON from domains listed in blacklists_api.json

import_and_test.js - this is the basic bootstrap for how the blacklist is imported into the API.  It runs tests

blacklists_api.json - sample blacklisted domains

domain_blacklist_b64_test1.json - the JSON that is built/compile in the API runtime

Target 
- an O(log n) speed target
- the resultant file MUST be importable via javascript require() so must not be binary
- only a SINGLE hash operation.  They're expensive and looping them is as well.  You can slice up a SHA256/512 into segments and use those for when more hashes are required (bloom/cuckoo etc) but doing bitwise operations of 16 hashes in a loop is expensive, and must have an error rate of under 1% chance PER YEAR of both false positive and false negative, ie, if tests run 100 billion iterations without a collision then that works

