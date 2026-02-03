<html>
	<head> 
		<title>Açai Login</title>
		<meta charset="utf-8">
		<link href="./css/bootstrap.min.css" rel="stylesheet">
		<link href="./css/global.css" rel="stylesheet">	
		<link href="./css/menu.css" rel="stylesheet">
		<style type="text/css">
			.modal-content {border: 2px solid #7030a0;}
			.input-lg {border:2px solid #7030a0;}
			#loginButton {
				background-color:#7030a0;
				border-color:#7030a0;
			}
			#loginButton.focus,#loginButton:active,#loginButton:focus,#loginButton:hover {
				background-color:#954eca;
				border-color:#954eca;
			}			
			.modal-dialog {
				margin:100px auto;
			}
			.form-control:focus {
				border-color:#954eca;
			}
			.errlog {
				color:#b30000;
			}
		</style>
	</head>
	<body>
		<div class="site-wrap">
			<img alt="Logo" class="logo" src="./img/logo.png">
			<div id="loginModal" class="modal show" tabindex="-1" role="dialog" aria-hidden="true">
			  <div class="modal-dialog">
			  <div class="modal-content">
			      <div class="modal-header">
			          <h2 class="text-center" style="color:#7030a0;">Casa do Açaí</h2>
			      </div>
			      <div class="modal-body">
			          <form class="form col-md-12 center-block" action="./index.php" method="post">
			            <div class="form-group">
			              <input id="logonSwitch" name="logonSwitch" type="hidden" class="form-control input-lg" value="1">
			              <input id="logonUser" name="logonUser" type="text" class="form-control input-lg" placeholder="Usuario" value="sample">
			            </div>
			            <div class="form-group">
			              <input id="logonPwd" name="logonPwd" type="password" class="form-control input-lg" placeholder="Contraseña" value="sample">
			            </div>
			            <div class="form-group">
			              <button id="loginButton" class="btn btn-primary btn-lg btn-block">Identificarse</button>
			            </div>
			          </form>
			      </div>
			      <div class="modal-footer">
			        <div class="form-group errlog"><?echo isset($_REQUEST['err'])?"Combinación de usuario y contraseña incorrectos":"";?></div>
			      </div>
			  </div>
			  </div>
			</div>
		</div>
	</body>
</html>

