<?php
require_once __DIR__ . '/../../config/db.php';

$filename = isset($_GET['filename']) ? basename($_GET['filename']) : null;
if (!$filename) {
	http_response_code(400);
	echo json_encode(['status' => false, 'message' => 'Filename required']);
	exit;
}

$path = UPLOAD_DIR . $filename;
if (!file_exists($path)) {
	http_response_code(404);
	echo json_encode(['status' => false, 'message' => 'File not found']);
	exit;
}

$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
$mime = 'application/octet-stream';
switch ($ext) {
	case 'jpg': case 'jpeg': $mime = 'image/jpeg'; break;
	case 'png': $mime = 'image/png'; break;
	case 'gif': $mime = 'image/gif'; break;
}

header('Content-Type: ' . $mime);
header('Cache-Control: public, max-age=86400');
readfile($path);

?>
