<?php
     header('Content-Type: text/html; Charset="UTF-8"');

    session_start();
    //var_dump($_SESSION);
    if(isset($_GET['section']) && $_GET['section']=='exit') {
      unset($_SESSION);
      session_destroy();
      header ("Location: ./login.php");
    } else {
      if (isset($_POST['logonSwitch']) && $_POST['logonSwitch']==1) {
        require('./config/dbconn.php');

        $sqlSentence = "SELECT * FROM usuarios WHERE pass='".$_POST['logonPwd']."' AND usuario='".$_POST['logonUser']."'";
        $sessionData = mysqli_query($sqlConn,$sqlSentence);
        //var_dump($sessionData);
        if (!empty($sessionData->num_rows)) {
          //echo "CREADA";
          $sessionData = mysqli_fetch_array($sessionData);
          //session_id($sessionData['id']);
          //session_name("USER:".$sessionData['usuario']);
          //Fabricar la cookie!

          $_SESSION['id'] = $sessionData['id'];
          $_SESSION['usr'] = $sessionData['usuario'];
          $_SESSION['usrType'] = $sessionData['categoria'];
          $_SESSION['active'] = 1;
        } else {
          unset($_SESSION);
          session_destroy();
          header ("Location: ./login.php?err=1");
        }
        mysqli_close($sqlConn);
      } elseif (!isset($_SESSION['active']) && $_SESSION['active']!=1) {
          //echo "NO ACTIVA";
          unset($_SESSION);
          session_destroy();
          header ("Location: ./login.php");
      } else {
          //echo "ACTIVA";
          //session_id($_SESSION['id']);
          //session_name("USER:".$_SESSION['usr']);
      }
    }

    //COMENTAR HASTA AQUI!
    //echo session_id()." ".session_name();
    if (isset($_GET['section'])) {
        define("Titulo", $_GET['section']);
    } else {
        define("Titulo", "venta");
    }

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Açai <?php echo Titulo;?>.</title>

    <!-- Bootstrap Styles -->
   <link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css"/>
    <!-- Datatables Styles -->
	 <link rel="stylesheet" type="text/css" href="./scripts/buttons.datatables.min.css"/>
	 <link rel="stylesheet" type="text/css" href="./scripts/datatables.min.css"/>
	 <link rel="stylesheet" type="text/css" href="./scripts/responsive.datatables.min.css"/>
	 <link rel="stylesheet" type="text/css" href="./scripts/select.datatables.min.css"/>
    <!-- Main Styles -->
   <link type="text/css" href="./fonts/stylesheet.css" rel="stylesheet"> 
	 <link type="text/css" href="./css/menu.css" rel="stylesheet">
	 <link type="text/css" href="./css/global.css" rel="stylesheet">
	  
    <!-- Datatables & Bootstrap scripts -->
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="./scripts/bootstrap.min.js"></script>   
    <script type="text/javascript" src="./scripts/datatables.min.js"></script>
    <script type="text/javascript" src="./scripts/datatables.buttons.min.js"></script>	
    <script type="text/javascript" src="./scripts/datatables.responsive.min.js"></script>
    <script type="text/javascript" src="./scripts/datatables.select.min.js"></script>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-1LD68LTBRZ"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());

	  gtag('config', 'G-1LD68LTBRZ');
	</script>
    
  </head>
  <body>
  	<ul class="navigation">
        <li class="nav-item"><a href="index.php?section=venta">Venta</a></li>
        <li class="nav-item"><a href="index.php?section=gastos">Gastos</a></li>
        <li class="nav-item"><a href="index.php?section=clientes">Clientes</a></li>
        <li class="nav-item"><a href="index.php?section=stock">Stock</a></li>
        <li class="nav-item"><a href="index.php?section=caja">Cuadrar Caja</a></li>
        <li class="nav-item"><a href="index.php?section=historico">Histórico</a></li>
        <li class="nav-item"><a href="index.php?section=relatorio">Relatorio</a></li>
        <li class="nav-item"><a href="index.php?section=exit">Salir</a></li>
    <!--<li class="nav-item"><a href="index.php?section=ventas">Estudio de ventas</a></li>-->
    </ul>

    <input type="checkbox" id="nav-trigger" class="nav-trigger" />
    <label for="nav-trigger"></label>
  
    <div class="site-wrap <?php echo Titulo;?>">
	      <div class="backimage"></div>
        <img src="./img/logo.png" class="logo" alt="Logo">
        <h1><?php echo Titulo;?></h1>
        <div class="container">
  	       <?php include Titulo.".php";?>
        </div>
    </div>
    <script type="text/javascript">
        var logedUser = '<?=$_SESSION['usr']?>';
    </script>
    <script src="./js/<?php echo Titulo;?>.js"></script>
  </body>
</html>
