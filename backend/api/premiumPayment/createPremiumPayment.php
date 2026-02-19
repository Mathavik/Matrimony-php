<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require("../../config/db.php");

$input = json_decode(file_get_contents("php://input"), true);

$userId = $input['userId'] ?? null;
$amount = $input['amount'] ?? null;
$duration = $input['duration'] ?? null;
$paymentMethod = $input['paymentMethod'] ?? null;

if (!$userId || !$amount || !$duration || !$paymentMethod) {
    http_response_code(400);
    echo json_encode(["message" => "All fields required"]);
    exit;
}

/* ✅ Check User */
$stmtUser = $conn->prepare("SELECT id FROM users WHERE id = ?");
$stmtUser->bind_param("i", $userId);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();

if ($resultUser->num_rows == 0) {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
    exit;
}

/* ✅ Generate Transaction ID */
$transactionId = uniqid("txn_");

/* ✅ Insert Payment */
$stmt = $conn->prepare("INSERT INTO premiumpayments 
(userId, amount, duration, paymentMethod, transactionId, status, createdAt) 
VALUES (?, ?, ?, ?, ?, 'success', NOW())");

$stmt->bind_param("idsss", $userId, $amount, $duration, $paymentMethod, $transactionId);
$stmt->execute();

/* ✅ Update Premium */
$stmtUpdate = $conn->prepare("UPDATE users SET isPremium = 1 WHERE id = ?");
$stmtUpdate->bind_param("i", $userId);
$stmtUpdate->execute();

echo json_encode([
    "success" => true,
    "message" => "Payment successful, Premium activated!"
]);
?>
