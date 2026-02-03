		<style type="text/css">
			.container > form {
				max-width: 70%;
				margin: 0 auto;
			}
			.container label { margin:10px 0; }
			.form-control { margin:5px 0; }
			.till_error { color:#b30000; margin:0 5px;display:none;font-size:12px;}
		</style>

		<div class="container">
		  	<!-- TILL BOX FORM -->
			<form id="till_form" role="form">
				<div class="form-group">
					<label for="till_last_value">Valores de caja anterior</label>
					<input type="text" class="form-control" id="till_last_value" value="" disabled />
					<input type="text" class="form-control" id="till_last_date" value="" disabled />
				    <label for="till_sales_value">Ventas desde fecha anterior</label><br />
				    <label for="till_sales_value_cash" style="font-size:0.8em;margin:2px 0">Efectivo</label>
					<input type="text" class="form-control" id="till_sales_value" value="" disabled />
					<label for="till_sales_value_card" style="font-size:0.8em;margin:2px 0">Tarjeta</label>
				    <input type="text" class="form-control" id="till_sales_card" value="" disabled />
					<label for="till_actual_value">Valor Actual</label><label id="currentValueErr" class="till_error"> * Este campo debe ser un número entero o decimal</label>
				    <input type="text" class="form-control" id="till_current_value" placeholder="" />
					<input type="hidden" class="form-control" id="till_hidden_current_value" value="" />
				    <input type="text" class="form-control" id="till_current_datetime" value="" disabled/>
					<input type="hidden" class="form-control" id="till_hidden_currentdatetime" value=""/>
					<label for="till_notes">Observación</label>
				    <textarea class="form-control" id="till_notes" placeholder="Observaciones y excepciones"></textarea>
				</div>
				<div class="form-group">
			      	<button type="submit" class="btn btn-primary">Cuadrar Caja</button>
			      	<button id="showLastMoves" style="float:right" type="button" class="btn btn-primary">Últimos movimientos</button>
			    </div>
			</form>
		</div>

		<!-- FLOATING WINDOW FOR REQUEST CONFIRMATION -->
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
		<!-- /.modal -->
		<!-- <button id="redraw-table" type="button">CLICK ME</button> -->

