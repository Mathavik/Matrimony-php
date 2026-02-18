<?php
header("Content-Type: application/json");
require("../../config/db.php");

$userId = $_GET['userId'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["message" => "User ID required"]);
    exit;
}

// ✅ Correct table name
$userResult = $conn->query("SELECT id, fullName, email, isPremium 
FROM users WHERE id = $userId");

if ($userResult->num_rows == 0) {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
    exit;
}

$user = $userResult->fetch_assoc();

// ✅ Correct payment table
$paymentResult = $conn->query("
    SELECT * FROM premiumpayments 
    WHERE userId = $userId 
    ORDER BY createdAt DESC 
    LIMIT 1
");

$lastPayment = $paymentResult->num_rows > 0 ? 
    $paymentResult->fetch_assoc() : null;

echo json_encode([
    "user" => $user,
    "lastPayment" => $lastPayment,
    "isPremium" => (bool)$user['isPremium']
]);
?>