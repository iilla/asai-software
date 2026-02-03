<form id="frmventa" name="frmventa">

	<div class='optioncontainer' id='productoscont'>
	  <?php
	  /*
		$arrayproductos = array (
		  array(1,"Açaí 120ml",5,21),
		  array(2,"Açaí 900ml",15,21),
		  array(3,"Açaí 3,6L",45,21),
		  array(4,"Polpa açaí 1kg",13,21),
		  array(5,"Pao de queijo 400gr",6.9,21),
		  array(6,"Pao de queijo 1Kg",14,21)
		  );	
		foreach ($arrayproductos as $row) {
		   // echo $row[0];
		   // echo $row[1];
		   // echo $row[2];
			echo "<div class='prodsection'><img id='producto" . $row[0] . "' src='/img/producto" . $row[0] . ".jpg'/>"; 
			echo "Cant.: <input type='text' value='1' id='cant" . $row[0] . "' size='3'/> ";
			echo "IVA:<input type='text' value='". $row[3] . "' id='iva" . $row[0] . "'  maxlength='3' size='1'/></div>";
			echo "<input type='text' value='". $row[4] . "' id='precio" . $row[0] . "'  maxlength='3' size='1' style='display:none;' type="hidden"/></div>";
		}
		 
		unset($row); // rompe la referencia con el último elemento
	   * <input type='text' id='nextfactid' style='display:none;' type="hidden"/> 
		*/
		?>
	</div>
		
		<div class="bottomdiv"></div>
		<div class='optioncontainer'>
			<div class='extrasection'>
				<div class="textoventa">Gastos de envío
					<span id="errControlEnvio" class="sellingErrorControl" style="color:red;">*</span>
				</div>
					Precio.: <input type='text' value='0' id='cantenvio' size='3'/> 
					IVA:<input type='text' value='21' id='ivaenvio'  maxlength='3' size='1'/>
			</div>
			
			<div class='extrasection'>
				<div class="textoventa">Extras
					<span id="errControlExtra" class="sellingErrorControl" style="color:red;">*</span>
				</div>
					Precio.: <input type='text' value='0' id='cantextras' size='3'/> 
					IVA:<input type='text' value='21' id='ivaextras'  maxlength='3' size='1'/>
			</div>
			
			<div class='extrasection'>
				<div class="textoventa">Descuento					
					<span id="errControlDiscount" class="sellingErrorControl" style="color:red;">*</span>
				</div>
				<input type='radio' name="discountType" class="radioDiscount" value="porcentaje" checked> Porcentaje: 
				<input type='text' value='0' id='descpercent' size='3'> <br>
				<input type='radio' name="discountType" class="radioDiscount" value="euros"> Euros: 
				<input type='text' value='0' id='desceuros' class="inactiveDiscount" size='3' disabled> <br>
			</div>

			<div class='extrasection'>
				<div class="textoventa">Comercial
					<span id="errControlComercial" class="sellingErrorControl" style="color:red;">*</span>
				</div>
				Nombre: <input type='text' value='' id='comercial' style="max-width:70%;"/>
			</div>	

			<div class='extrasection'><div class="textoventa">Venta desde</div>
				<select id="recinto" name="recinto">
					<option value="tienda">Tienda</option>
					<option value="almacen">Almacén</option>
				</select>
			</div>
		</div>
		<div class="bottomdiv"></div>
	<div class='optioncontainer'>
		<div>
			<select name="clientlist" id="clientlist">
			</select>
			<div id="nuevoCli"><div class="textoventa">Nuevo Cliente</div></div>
		</div>
	</div>
	<div class="bottomdiv"></div>
	<div class='optioncontainer'>
		<div class='pagosection'><div class="textoventa" id="efectivo">Efectivo</div></div>		
		<div class='pagosection'><div class="textoventa" id="tarjeta">Tarjeta</div></div>		
		<div class='pagosection'><div class="textoventa" id="cortesía">Cortesía</div></div>
		<div class='pagosection'><div class="textoventa" id="pendiente">Pendiente</div></div>		
	</div>
	<div class="bottomdiv"></div>
	</form>
	
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