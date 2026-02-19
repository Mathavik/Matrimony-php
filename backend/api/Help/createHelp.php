<?php
header("Content-Type: application/json");
require_once "../../config/db.php";

$conn = getDBConnection(); // ✅ important

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$subject = $data['subject'] ?? '';
$message = $data['message'] ?? '';

if (!$name || !$email || !$subject || !$message) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required."
    ]);
    exit;
}

try {

    $stmt = $conn->prepare("
        INSERT INTO help_requests (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->bind_param("ssss", $name, $email, $subject, $message);

    $stmt->execute();

    http_response_code(201);
    echo json_encode([
        "status" => "success", // ✅ frontend expects this
        "message" => "Help request submitted successfully"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal server error"
    ]);
}
?>
