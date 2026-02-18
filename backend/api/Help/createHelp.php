<?php
header("Content-Type: application/json");
require_once "../../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$subject = $data['subject'] ?? '';
$message = $data['message'] ?? '';

if (!$name || !$email || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(["message" => "All fields are required."]);
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
        "message" => "Help request submitted successfully",
        "request" => [
            "name" => $name,
            "email" => $email,
            "subject" => $subject,
            "message" => $message
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Internal server error",
        "error" => $e->getMessage()
    ]);
}
?>