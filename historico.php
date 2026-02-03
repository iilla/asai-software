
        <style ="text/css">
			table.dataTable tbody>tr.selected,
			table.dataTable tbody>tr>.selected {
			  background-color: #A2D3F6;
			}

			#newTimestamp {
			  color: #66afe9;
			  animation-name: parpadeo;
			  animation-duration: 1s;
			  animation-timing-function: linear;
			  animation-iteration-count: infinite;

			  -webkit-animation-name:parpadeo;
			  -webkit-animation-duration: 1s;
			  -webkit-animation-timing-function: linear;
			  -webkit-animation-iteration-count: infinite;
			}
		</style>
	</head>
	<body>
		<div class="container">
		  	<table cellpadding="0" cellspacing="0" border="0" class="dataTable table table-striped" id="invoices"></table> 
		</div>
		<div class="container">
		  	<table cellpadding="0" cellspacing="0" border="0" class="dataTable table table-striped" id="movements"></table> 
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
		  <!-- /.modal -->
		  <!-- <button id="redraw-table" type="button">CLICK ME</button> -->

