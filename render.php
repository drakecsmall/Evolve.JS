<?php
  if (isset($_GET['content'])) {
    $varr = $_GET['content'];
    $varr = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($varr)); 
    $varr = html_entity_decode($varr,null,'UTF-8');
    echo $varr;
  }
  else { echo "nothing to parse"; }
?>
