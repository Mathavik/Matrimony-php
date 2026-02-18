<?php
header("Content-Type: application/json");
require("../../config/db.php");

$input = json_decode(file_get_contents("php://input"), true);

$userId = $input['userId'] ?? null;
$amount = $input['amount'] ?? null;
$duration = $input['duration'] ?? null;
$paymentMethod = $input['paymentMethod'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["message" => "User ID required"]);
    exit;
}

// ✅ Use correct table name: users
$userCheck = $conn->query("SELECT * FROM users WHERE id = $userId");

if ($userCheck->num_rows == 0) {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
    exit;
}

// Generate transaction ID
$transactionId = uniqid("txn_");

// ✅ Use correct table name: premiumpayments
$stmt = $conn->prepare("INSERT INTO premiumpayments 
(userId, amount, duration, paymentMethod, transactionId, status, createdAt) 
VALUES (?, ?, ?, ?, ?, 'success', NOW())");

$stmt->bind_param("idsss", $userId, $amount, $duration, $paymentMethod, $transactionId);
$stmt->execute();

// ✅ Update correct table
$conn->query("UPDATE users SET isPremium = 1 WHERE id = $userId");

echo json_encode([
    "message" => "Payment successful, Premium activated!"
]);
?>