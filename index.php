<html>
<head>
<script src="res/sorttable.js" type="text/javascript"></script>
<style>
.navbar {
	background-color: #cacaca;
	display: flex;
}
.col {
	display:inline-block;
	margin: auto 10px;
}
#search {
	width: 400px;
	float:right;
	margin-left: auto;
	input {
		width: 300px;
	}
}
</style>
</head>
<body style="font-family: arial; font-size: 14px; width: 100vw; padding: 0px; margin: 0px;">
<div class="navbar">
  <div class="col">
	<img src="/res/stoat.png" style="height: 50px; width:auto;">
  </div>
  <div class="col">
  	<a href="http://evolvejs.tk" style="font-size:16px; text-decoration: none;">
		<h1 style="color: black;margin: 5px 0;">Evolve.js<br>Adaptive web standard</h1>
	</a>
  </div>
  <div class="col">
	<h3 style="text-align:center; font-size:16px;"><a href='http://evolvejs.tk/editor.html'>Create New Design Spec</a></h3>
  </div>
  <div class="col" id="search">
	<form action="#" onsubmit="alert('todo')">
	<img src="https://azure.microsoft.com/svghandler/search/?width=50&height=40" style="    height: 40px; position: relative; top: 15px;"  onclick="alert('todo')">
	<input type="text" name="search" style="width: 50%; height: 40px; font-size: 15px; border-radius: 5px;"  placeholder="search for design" ></td>
	</form>
  </div>
</div>

<!---
<table style=" width: 100vw; height: 50px; background-color: #fafafb; box-shadow: 0 1px 0 rgba(12,13,14,0.15); border-top: 3px solid #F48024; position:fixed; top:0;" >
<tr style=" width: 100vw; height: 50px; background-color: #fafafb; box-shadow: 0 1px 0 rgba(12,13,14,0.15); border-top: 3px solid #F48024;">
<td><img src="/res/stoat.png" style="height: 50px; width:auto;"></td>
<td style="margin-top:auto; margin-bottom:auto; text-align:center;">
	<a href="http://evolvejs.tk" style="font-size:16px; text-decoration: none;">
		<h1 style="color: black;margin: 5px 0;">Evolve.js<br>Adaptive web standard</h1></a></td>
<td><h3 style="text-align:center; font-size:16px;"><a href='http://evolvejs.tk/editor.html'>Create New Design Spec</a></h3></td>
<td style="width:50%; text-align: center">
<form action="#" onsubmit="alert('todo')">
<img src="https://azure.microsoft.com/svghandler/search/?width=50&height=40" style="    height: 40px; position: relative; top: 15px;"  onclick="alert('todo')">
<input type="text" name="search" style="width: 50%; height: 40px; font-size: 15px; border-radius: 5px;"  placeholder="search for design" ></td>
</form>
</tr></table>
-->
<div style="width: 66%; margin-top: 75px; margin-left: auto; margin-right: auto;">
<h2>Current Design Spec Submissions:</h2><hr><br><br>
<table id="main" class="sortable">
<thead>
Sort by
<tr style="height: 50px"><th><button><strong>Score:</strong></button></th><th style="text-align: left;"><button><strong>User - Title:</strong></button></th></tr>
</thead>
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
        echo "<tr style='padding-bottom: 1em;'><td align='center'><span style='display:none;'>".array_sum(explode(',',$votes))."</span><a href='http://evolvejs.tk/?file=".$file."&up=true'>";
        echo "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Human-go-up.svg/128px-Human-go-up.svg.png' height='20' width='20'></a>";
        echo "<p style='font-size:20px; line-height: 0px;'>".array_sum(explode(',',$votes));
        echo "</p>";
        echo "<a href='http://evolvejs.tk/?file=".$file."&up=false'>";
        echo "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Human-go-down.svg/128px-Human-go-down.svg.png' height='20' width='20'></a></td><td>";
        echo "<span style='display:none;'>".$name.$title."</span><strong style='height: 100px;'>Submitted by: ".$name." - ".$title."</strong>";
        echo "<div style='background-color: #eff0f1;'><iframe width='1024' height='768' style='border-radius: 10px;' src='/render.php?content=".urlencode($css)."'></iframe></div></td><tr>";
        fclose($entry);
}

?>
</table>
</div>
</body>
</html>
