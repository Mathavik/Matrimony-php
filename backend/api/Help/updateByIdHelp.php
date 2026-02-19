<?php
header("Content-Type: application/json");
require_once "../../config/db.php";

$conn = getDBConnection();

$id = $_GET['id'] ?? null;
$data = json_decode(file_get_contents("php://input"), true);
$status = $data['status'] ?? '';

$validStatus = ['Pending', 'Resolved', 'Closed'];

if (!$id || !in_array($status, $validStatus)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid id or status value"]);
    exit;
}

try {

    $stmt = $conn->prepare("
        UPDATE help_requests
        SET status = ?
        WHERE id = ?
    ");

    $stmt->bind_param("si", $status, $id);

    $stmt->execute();

    echo json_encode([
        "message" => "Help request status updated successfully",
        "id" => $id,
        "status" => $status
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Internal server error",
        "error" => $e->getMessage()
    ]);
}
?>