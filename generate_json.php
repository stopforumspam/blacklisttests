<?php

$domains = json_decode(file_get_contents('blacklists_api.json'), true);

const KEY_CHAR = 2;
const PRECISION = 8; // 64 bits

function topBytesToBase64(string $sha256Hash) {
    $result = strtr(base64_encode($sha256Hash), '+/', '-_');  // replace characters that json encoding will escape
    
    // try the first digit as the key but random distribution here sucks
    $k = substr($result, 0, KEY_CHAR);
    $v = substr($result, KEY_CHAR, PRECISION - KEY_CHAR);

    // or try the last digit as the key for more random distribution
    // $k = substr($result, PRECISION - KEY_CHAR, KEY_CHAR);
    // $v = substr($result, 0, PRECISION - KEY_CHAR);

    return ['k' => $k , 'v' => $v ] ;
}

foreach($domains as $domain) {
	$hash = hash('sha512', $domain, true);
	$chunk = topBytesToBase64($hash);
    $key = $chunk['k'];

	if (!isset($result[$key])) {
		$result[$key] = ''; // populate with empty string
	}
	$result[$key] = $result[$key] . $chunk['v']; 
    echo "domain $domain Key: $key, Value: " . $chunk['v'] . "\n";
}

$data['d'] = $result;
$data['p'] = PRECISION;
$data['c'] = KEY_CHAR;

$j = json_encode($data);
file_put_contents("domain_blacklist_b64_test1.json", $j);

$x = strlen($j) / count($domains) * 8;
echo "\n\n" .strlen($j) . " $x bits per record \n";

