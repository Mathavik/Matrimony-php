<?php
header("Content-Type: application/json");
require_once "../../config/db.php";


try {

    $query = "
        SELECT id, name, email, subject, message, status, created_at
        FROM help_requests
        ORDER BY created_at DESC
    ";

    $result = $conn->query($query);

    $rows = [];

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode([
        "message" => "Help requests fetched successfully",
        "data" => $rows
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Internal server error",
        "error" => $e->getMessage()
    ]);
}
?>