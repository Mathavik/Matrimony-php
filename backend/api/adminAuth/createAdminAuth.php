<?php
header("Content-Type: application/json");

// Hardcoded admin credentials
$ADMIN_USERNAME = "admin";
$ADMIN_PASSWORD = "admin123@gmail.com";

$input = json_decode(file_get_contents("php://input"), true);

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if ($username === $ADMIN_USERNAME && $password === $ADMIN_PASSWORD) {

    $secret_key = "your-secret-key";

    // JWT Header
    $header = [
        "alg" => "HS256",
        "typ" => "JWT"
    ];

    // JWT Payload
    $payload = [
        "isAdmin" => true,
        "username" => $ADMIN_USERNAME,
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24) // 24 hours
    ];

    // Encode function
    function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '=');
    }

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);

    $signature = hash_hmac(
        'sha256',
        $base64UrlHeader . "." . $base64UrlPayload,
        $secret_key,
        true
    );

    $base64UrlSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    echo json_encode([
        "success" => true,
        "message" => "Admin login successful",
        "token" => $jwt,
        "admin" => [
            "username" => $ADMIN_USERNAME
        ]
    ]);

} else {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Invalid admin credentials"
    ]);
}
?>