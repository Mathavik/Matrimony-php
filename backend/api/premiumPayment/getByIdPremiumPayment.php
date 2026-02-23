<?php
require_once "../../config/db.php"; // your DB file

$conn = getDBConnection();

if (!isset($_GET['userId'])) {
    http_response_code(400);
    echo json_encode(["message" => "User ID is required"]);
    exit();
}

$userId = intval($_GET['userId']);

// ✅ Get User
$userQuery = "SELECT id, fullName, email, isPremium FROM users WHERE id = ?";
$stmt = $conn->prepare($userQuery);
$stmt->bind_param("i", $userId);
$stmt->execute();
$userResult = $stmt->get_result();

if ($userResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
    exit();
}

$user = $userResult->fetch_assoc();

// ✅ Get Last Premium Payment
$paymentQuery = "SELECT * FROM premiumPayments 
                 WHERE userId = ? 
                 ORDER BY createdAt DESC 
                 LIMIT 1";

$stmt2 = $conn->prepare($paymentQuery);
$stmt2->bind_param("i", $userId);
$stmt2->execute();
$paymentResult = $stmt2->get_result();

$lastPayment = null;
if ($paymentResult->num_rows > 0) {
    $lastPayment = $paymentResult->fetch_assoc();
}

// ✅ Response
echo json_encode([
    "user" => $user,
    "lastPayment" => $lastPayment,
    "isPremium" => (bool)$user['isPremium']
]);

$conn->close();
?>