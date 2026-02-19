<?php

function sendEmail($to, $subject, $text, $html = null) {

    // 🔴 DIRECT GMAIL DETAILS (App Password use pannu)
    $gmailEmail = "mahalakshmivelu508@gmail.com";
    $gmailPassword = "qmflzdlpledeclpm"; // space illaama podu

//     SMTP_USER=mahalakshmivelu508@gmail.com
// SMTP_PASS=qmflzdlpledeclpm
    if (empty($to) || empty($subject) || empty($text)) {
        return ['success' => false, 'error' => 'Missing parameters'];
    }

    $eol = "\r\n";
    $body = $html ?: $text;

    $headers = "MIME-Version: 1.0".$eol;
    $headers .= "Content-Type: text/html; charset=UTF-8".$eol;
    $headers .= "From: Matrimony <$gmailEmail>".$eol;

    $message = $body;

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);

    $socket = stream_socket_client("tcp://smtp.gmail.com:587", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);

    if (!$socket) {
        return ['success'=>false, 'error'=>$errstr];
    }

    $getResponse = function($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        return $response;
    };

    $getResponse($socket);

    fwrite($socket, "EHLO localhost".$eol);
    $getResponse($socket);

    fwrite($socket, "STARTTLS".$eol);
    $getResponse($socket);

    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

    fwrite($socket, "EHLO localhost".$eol);
    $getResponse($socket);

    fwrite($socket, "AUTH LOGIN".$eol);
    $getResponse($socket);

    fwrite($socket, base64_encode($gmailEmail).$eol);
    $getResponse($socket);

    fwrite($socket, base64_encode($gmailPassword).$eol);
    $getResponse($socket);

    fwrite($socket, "MAIL FROM:<$gmailEmail>".$eol);
    $getResponse($socket);

    fwrite($socket, "RCPT TO:<$to>".$eol);
    $getResponse($socket);

    fwrite($socket, "DATA".$eol);
    $getResponse($socket);

    fwrite($socket, "Subject: $subject".$eol);
    fwrite($socket, $headers.$eol);
    fwrite($socket, $message.$eol.".".$eol);

    $result = $getResponse($socket);

    fwrite($socket, "QUIT".$eol);
    fclose($socket);

    if (strpos($result, "250") !== false) {
        return ['success'=>true];
    } else {
        return ['success'=>false, 'error'=>'Mail send failed'];
    }
}
