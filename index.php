<html>
<head>
</head>
<body style="width: 100vw; padding: 0px; margin: 0px;">
<table style=" width: 100vw; height: 50px; background-color: #fafafb; box-shadow: 0 1px 0 rgba(12,13,14,0.15); border-top: 3px solid #F48024; position:fixed; top:0;" >
<tr style=" width: 100vw; height: 50px; background-color: #fafafb; box-shadow: 0 1px 0 rgba(12,13,14,0.15); border-top: 3px solid #F48024;">
<td><img src="/res/stoat.png" style="height: 50px; width:auto;"></td>
<td style="margin-top:auto; margin-bottom:auto; text-align:center;"><a href="http://evolvejs.tk"><h1 style="color: black">Evolve.js - The collective web standard</h1></a></td>
<td><h3 style="text-align:center;"><a href='http://evolvejs.tk/editor.html'>Create New Design Spec</a></h3></td>
<td style="width:50%; text-align: center">
<form action="#" onsubmit="alert('todo')">
<img src="https://azure.microsoft.com/svghandler/search/?width=25&height=20" onclick="alert('todo')">
<input type="text" name="search" style="width:50%"  placeholder="search for design" ></td>
</form>
</tr></table>
<div style="width: 66%; margin-top: 75px; margin-left: auto; margin-right: auto;">
<h2>Current Design Spec Submissions:</h2><hr><br><br>
<table>
<?php

function vote($filename,$up)
{
$entry = fopen($filename,"a");
if ($up == "false") {
	fwrite($entry,"-1,");
	}
else { fwrite($entry,"1,");}
fclose($entry);
header("Location: http://evolvejs.tk");
die();
}

if (isset($_GET['file']) && isset($_GET['up'])) {
    vote($_GET['file'],$_GET['up']);
}

$files = glob('designs/*.ddb', GLOB_BRACE);
foreach($files as $file) {
        $entry = fopen($file,"r");
        $css = fgets($entry);
        $name = fgets($entry);
        $title = fgets($entry);
        $votes = fgets($entry);
        echo "<tr style='padding-bottom: 1em;'><td align='center'><a href='http://evolvejs.tk/?file=".$file."&up=true'>";
        echo "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Human-go-up.svg/128px-Human-go-up.svg.png' height='20' width='20'></a>";
        echo "<p style='font-size:20px; line-height: 0px;'>".array_sum(explode(',',$votes));
        echo "</p>";
        echo "<a href='http://evolvejs.tk/?file=".$file."&up=false'>";
        echo "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Human-go-down.svg/128px-Human-go-down.svg.png' height='20' width='20'></a></td><td>";
        echo "<strong style='height: 100px;'>Submitted by: ".$name." - ".$title."</strong>";
        echo "<div style='background-color: #eff0f1;'><iframe width='1024' height='768' src='/render.php?content=".urlencode($css)."'></iframe></div></td><tr>";
        fclose($entry);
}

?>
</table>
</div>
</body>
</html>
