<?php
  function newDesign() {
    $tag = explode(" ", microtime())[1];
    $myfile = fopen($tag.".ddb", "w") or die("Unable to open file! ".$tag.".ddb");
    fwrite($myfile, $_GET['content']."\n");
    fwrite($myfile, $_GET['un']."\n");
    fwrite($myfile, $_GET['title']."\n");
    fwrite($myfile, "0,");
    fclose($myfile);
    header("Location: http://evolvejs.tk");
    die();
  }

  if (isset($_GET['content'])) {
    newDesign();
  }
  else {
      echo "The design spec is in another POST!";
  }
?>
