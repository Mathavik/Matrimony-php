<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require_once("../../config/db.php"); // db connection correct path check panniko

if ($conn->connect_error) {
    echo json_encode(["message" => "Connection failed"]);
    exit;
}

// URL la id varum (example: getUserById.php?id=1)
$id = $_GET['id'] ?? '';

if (!$id) {
    echo json_encode(["message" => "User ID required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        id,
        profileFor,
        fullName,
        gender,
        dob,
        age,
        religion,
        motherTongue,
        maritalStatus,
        caste,
        height,
        education,
        occupation,
        annualIncome,
        country,
        state,
        city,
        email,
        mobile,
        profilePhoto,
        isPublic,
        createdAt
    FROM users
    WHERE id = ?
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["message" => "User not found"]);
    exit;
}

// Profile photo full URL create pannrom
if ($user['profilePhoto']) {
    $baseUrl = "http://localhost/matrimony-php/backend/uploads/";
    $user['profilePhoto'] = $baseUrl . $user['profilePhoto'];
} else {
    $user['profilePhoto'] = null;
}

echo json_encode([
    "message" => "User fetched successfully",
    "user" => $user
]);

$conn->close();
?>
