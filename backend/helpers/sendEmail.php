<?php

require_once __DIR__ . '/phpMailer/PHPMailer.php';
require_once __DIR__ . '/phpMailer/SMTP.php';
require_once __DIR__ . '/phpMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($to, $subject, $text = "", $html = "")
{
    $mail = new PHPMailer(true);

    try {
        // SMTP Settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'majesticjesi@gmail.com';  // change this
        $mail->Password   = 'kiyx kxuo ojbb ljjc';    // Gmail App Password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('yourgmail@gmail.com', 'WedAura');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = !empty($html) ? $html : nl2br($text);
        $mail->AltBody = $text;

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Email Error: " . $mail->ErrorInfo);
        return false;
    }
}
