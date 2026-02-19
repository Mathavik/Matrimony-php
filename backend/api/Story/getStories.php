<?php
header("Content-Type: application/json");

require_once(__DIR__ . "/../../config/db.php");

if (!isset($conn)) {
    echo json_encode(["error" => "Database connection not initialized"]);
    exit;
}

$sql = "SELECT * FROM success_stories ORDER BY createdAt DESC";
$result = $conn->query($sql);

$stories = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $stories[] = $row;
    }
}

echo json_encode($stories);
$conn->close();
?>
