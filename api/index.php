<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use GuzzleHttp\Client;

$port = 9000;
$jwksUrl = 'https://app.dynamic.xyz/api/v0/sdk/8005230e-7f6f-472e-bf7b-b0e26b270698/.well-known/jwks';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only handle the /api endpoint
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($uri !== '/api') {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}

// Extract the JWT from the Authorization header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = null;

if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
} else {
    http_response_code(401);
    echo json_encode(['error' => 'No token provided']);
    exit;
}

try {
    // Fetch the JWKS from Dynamic's endpoint
    $client = new Client();
    $jwksResponse = $client->get($jwksUrl);
    $jwks = json_decode($jwksResponse->getBody(), true);
    
    // Verify the JWT 
    $decoded = JWT::decode($token, JWK::parseKeySet($jwks));
    
    // JWT is valid - return user info
    echo json_encode([
        'verified' => true,
        'user_id' => $decoded->sub,
        'email' => $decoded->email ?? 'Not provided'
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'verified' => false,
        'error' => $e->getMessage()
    ]);
}