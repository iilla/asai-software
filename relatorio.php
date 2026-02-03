<?php
	include("./config/dbconn.php");
	$sqlQuery = "SELECT * FROM usuarios";
	$sellers = mysqli_query($sqlConn,$sqlQuery);
	$sqlQuery = "SELECT * FROM clientes";
	$clients = mysqli_query($sqlConn,$sqlQuery);

	//Fecha actual +6 horas
	$currentTime = new DateTime('NOW');
	$currentTime->add(new DateInterval('PT6H'));

	$dayMonthRelation = array (
		0 => array("Año entero",0),
		1 => array("Enero",31),
		2 => array("Febrero",28),
	 	3 => array("Marzo",31),
		4 => array("Abril",30),
		5 => array("Mayo",31),
		6 => array("Junio",30),
		7 => array("Julio",31),
		8 => array("Agosto",31),
		9 => array("Septiembre",30),
		10 => array("Octubre",31),
		11 => array("Noviembre",30),
		12 => array("Diciembre",31)
	);

	$sqlQuery = "SELECT MIN(mindate) AS mindate FROM (SELECT MIN(timestamp) AS mindate FROM gastos UNION SELECT MIN(timestamp) AS mindate FROM facturas) AS newtable";
	$previousTime = mysqli_query($sqlConn,$sqlQuery);
	$previousTime = new DateTime($previousTime->fetch_row()[0]);
	$yearRelation = array();
	if (intVal($currentTime->Format("Y")) >= intVal($previousTime->Format("Y"))) {
		for ($i = intVal($currentTime->Format("Y"));$i>=intVal($previousTime->Format("Y"));$i--) {
			$yearRelation[] = $i;
		}
	} else {
		$yearRelation[] = array(intVal($currentTime->Format("Y")));
	}
?>

<script type="text/javascript">
	function refillDateDay(monthIndex,firstCall) {
		var currentDay = <?=intVal($currentTime->Format("d"));?>;
		var totalDays = 0;
		//console.log(typeof(monthIndex)+" "+currentDay);
		switch (monthIndex) {
			case "00":
				totalDays = 0;
				break;
			case "01":
			case "03":
			case "05":
			case "07":
			case "08":
			case "10":
			case "12": 
				totalDays = 31;
				break;
			case "04":
			case "06":
			case "09":
			case "11": 
				totalDays = 30;
				break;
			case "02": 
				if(isInt($("#filter-date-year").val()/4)) {
					totalDays = 29;
				} else {
					totalDays = 28;
				}
				break;
		}
		$("#filter-date-day").empty();
		var appendValue = "";
		for (var i=0;i<=totalDays;i++) {
			if (i==0) {
				$("#filter-date-day").append("<option value='0"+i+"'>Todo</option>");
			} else {
				if (i<10) { appendValue = "0"+i; } else { appendValue = i; }
				if(firstCall && i==currentDay) {
					$("#filter-date-day").append("<option value='"+appendValue+"' selected>"+appendValue+"</option>");
				} else {
					$("#filter-date-day").append("<option value='"+appendValue+"'>"+appendValue+"</option>");
				}
			}
		}
	}
</script>

<style type="text/css">
	.subContainer { padding: 5px 15px; }

	.filters-date,.filters-extra {
		border: 1px solid #ccc;
		height: 34px;
		padding: 6px 12px;
		font-size:14px;
	}

	.relatorio-labels {
		font-style: bold;
		font-size: 14px;
	}
	.outputRow-titles {
		border-top: 2px solid #7030a0;
		border-bottom: 2px solid #7030a0;
	}
	.outputRow-totals {
		border-top: 2px solid #7030a0;
		border-bottom: none;
	}
	.table-striped > tbody > tr:nth-of-type(2n+1) {
		background-color:#e7d8f3;
	}

	.clearfix:before,
	.clearfix:after {
	    content: "";
	    display: table;
	}

	.clearfix:after { clear: both; }
	.clearfix { *zoom: 1; }
</style>

<div class="container">
	<div id="relatorio-filters" class="container">
		<h2>Filtros</h2>
		<form id="filter-form" name="filter-form">
			<!-- Triple select with a picking date -->
			<div id="relatorio-filters-date" class="subContainer">
				<label class="relatorio-labels">Fecha: </label>
				<select id="filter-date-day" class="filters-date" name="filter-date-day"></select>
				<select id="filter-date-month" class="filters-date" name="filter-date-month">
					<?php 
						foreach($dayMonthRelation as $monthOptionIndex => $monthOption) {
							if ($monthOptionIndex<10) {
								echo "<option value='0".$monthOptionIndex."'";
							} else {
								echo "<option value='".$monthOptionIndex."'";
							}
							if($monthOptionIndex==intVal($currentTime->Format("m"))) echo " selected";
							echo ">".$monthOption[0]."</option>";
						}
					?>
				</select>
				<select id="filter-date-year" class="filters-date" name="filter-date-year">
					<?php 
						foreach($yearRelation as $yearOption) {
							echo "<option value='".$yearOption."'";
							if($yearOption==intVal($currentTime->Format("Y"))) echo " selected";
							echo ">".$yearOption."</option>";
						}
					?>
				</select>
			</div>
			<!-- extra philter for earning data type -->
			<div id="relatorio-filters-extra" class="subContainer">
				<input type="radio" id="radio-extra-earnings" name="radio-extra" value="earnings" checked /> 
				<label class="relatorio-labels">Ingresos: </label>
				<select id="filter-extra-usuario" class="filters-extra" name="filter-extra-usuario">
					<option value="0">Todos los usuarios</option>
					<?php
						foreach($sellers as $sellerRow) {
							echo "<option value='".$sellerRow['usuario']."'>".$sellerRow['usuario']."</option>";
						}
					?>
				</select>
				<select id="filter-extra-idcliente" class="filters-extra" name="filter-extra-idcliente">
					<option value="0">Todos los clientes</option>			
					<?php
						foreach($clients as $clientRow) {
							echo "<option value='".$clientRow['id']."'>".$clientRow['nombre']."</option>";
						}
					?>		
				</select>				
				<select id="filter-extra-metododepago" class="filters-extra" name="filter-extra-metododepago">
					<option value="0">Cualquier método de pago</option>
					<option value="efectivo">Efectivo</option>
					<option value="tarjeta">Tarjeta</option>
					<option value="pendiente">Pendiente</option>
					<option value="cortesía">Cortesía</option>
				</select>
				<select id="filter-extra-tipodeventa" class="filters-extra" name="filter-extra-tipodeventa">
					<option value="0">Cualquier tipo de venta</option>
					<option value="en tienda">En tienda</option>
					<option value="envío">Envío</option>
				</select>				
				<br />
	  			<input type="radio" id="radio-extra-benefits" name="radio-extra" value="benefits" /> 
	  			<label class="relatorio-labels">Beneficios: </label>
			</div>
			<div id="relatorio-filters-button" class="subContainer">
				<input id="filter-submit" name="filter-submit" class="btn btn-primary" type="button" value="Filtrar"/>
			</div>
		</form>
	</div>
	<!-- output table -->
	<div id="relatorio-output" class="container">
		<div id="relatorio-output-title"></div>
		<div id="relatorio-output-filters" style="width:45%;float:left;"></div>
		<div id="relatorio-output-totals" style="width:50%;float:right;"></div>
		<div class="clearfix"></div>
		<div id="relatorio-output-firstTable"></div>
		<div id="relatorio-output-secondTable"></div>
		<div class="clearfix"></div>
		<input id="sendmail-submit" name="sendmail-submit" class="btn btn-primary" type="button" value="Informe" disabled/>
	</div>
</div>

<!-- FLOATING WINDOW FOR EDIT,ADD AND DELETE REQUESTS -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Modal title</h4>
			</div>
			<div class="modal-body">
				<p>One fine body&hellip;</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button> 
			</div> 
		</div>		  
	<!-- /.modal-content -->
	</div>		
<!-- /.modal-dialog -->		    
</div>

<?php mysqli_close($sqlConn); ?>