<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'maha');
define('DB_NAME', 'matrimonydb');
define('DB_PORT', 3306);

// INTHA LINE-AH ADD PANNUNGA (Idhu dhaan missing)
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Connection-ah check panna
if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

// Server Configuration
define('SERVER_URL', 'http://localhost:8000');
define('FRONTEND_URL', 'http://localhost:3000');

// JWT Secret Key
define('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production-2024');

// Upload Directory
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', SERVER_URL . '/uploads/');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB

// CORS Headers
header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Set JSON response header
header('Content-Type: application/json');

// Database Connection Function
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

        if ($conn->connect_error) {
            throw new Exception("Database connection failed: " . $conn->connect_error);
        }

        $conn->set_charset("utf8mb4");

        return $conn;

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => false,
            "message" => "Database connection failed"
        ]);
        exit();
    }
}

// Note: do not run a direct connection test here — include and call getDBConnection() where needed.
?>