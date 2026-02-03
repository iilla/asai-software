$(document).ready(function() {
				
	var columnDefs = [
		{ title: "Id." },
		{ title: "Nombre" },
		{ title: "Unidades en tienda" },
		{ title: "Unidades en almacén" },
		{ title: "Precio de Compra" },
		{ title: "Precio de Venta" }
	];

	var myTable;

	/*myTable = $('#example').DataTable({
		"ajax": "./ajax.script.php"
	});*/

	//This creates the table with all buttons and specifications
	myTable = $('#stockControl').DataTable({
		"sPaginationType": "full_numbers",
		"ajax": {
			"url":"./ajax.script.stock.php"
			//"dataType":"json"
			//"dataSrc": ""
			//"columns": columnDefs
		},
					    "language": {
					    	"url": "./datatables.spanish.txt"
					    },
					    columns: columnDefs, 
				        /*"columnDefs": [
				            {
				                "targets": [0],
				                "visible": false,
				                "searchable": false
				            }	
				        ],*/
					    //data: dataSet, 
					    dom: 'Bt',
					    responsive: true,
					    select: 'single',
					    buttons: [{
					      extend: 'selected',
					      text: 'Control de Stock',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        incomingStock(this, dt, node, config)
					      }
					    }, {
					      extend: 'selected',
					      text: 'Mover inventario',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        stockSwap(this, dt, node, config)
					   	  }
					    } , {
					      extend: 'selected',
					      text: 'Editar Precios',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        stockPrices(this, dt, node, config)
					      }
					    }],
					    "initComplete": function(settings, json) {
					      $('#example').DataTable()
					        .columns.adjust()
					        .responsive.recalc()
					    }
					}
				);

				function stockAjaxRequest(id,action,data) {
					$.ajax({
						data:{"id":id,"action":action,"dataset":data},
					  	dataType:"text",
					  	url: "./ajax.script.stock.php",
					  	error: function(XMLHttpRequest, errorType, errorThrown){
							//Comentarlo para su salida en produccion
							alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
						},
					  	success: function (result) {
					  		//console.log(result);
					  		myTable.ajax.reload(null, false);
						}
					});
				}

				$(window).resize(function() {
					$('#example').DataTable()
					.columns.adjust()
					.responsive.recalc()
					.responsive.rebuild()
				});


				function isInt(number) {
					if(Math.floor(number) == number && $.isNumeric(number) && number>=0) {
						return true;
					} else {
						return false;
					}
				}

				function isIntOrNeg(number) {
					if(Math.floor(number) == number && $.isNumeric(number)) {
						return true;
					} else {
						return false;
					}
				}

				function isNumeric(number) {
					if (!/^([0-9])*[.,]?[0-9]*$/.test(number)) {
					  return false;
					} else {
					  return true;
					}
				}
				function stockPrices(pointer, oTT, button, conf) {
				    var adata = oTT.rows({
				      selected: true
				    });
				    var currentId = adata.data()[0][0];
				    var data = "";
				    var myTable = pointer;
				    data += "<form name='incomingStockForm' role='form'>";
				    data += "<div class='form-group'><label for='id'>Id: </label>"+ adata.data()[0][0]+"</br>";
				    data += "<input id='stockId' type='hidden' class='form-control' value='"+ adata.data()[0][0] +"'/>";
				    data += "<label for='Producto'>Producto: </label>"+ adata.data()[0][1] +"</div>";			    
				    data += "<div class='form-group'><label>Precio de compra: </label><label class='stockErrorControl' id='errControl1'> * Debe ser un valor de precio válido</label>";
				    data += "<input type='text' id='priceBuy"+ adata.data()[0][0]+"' name='priceBuy"+ adata.data()[0][0]+"' placeholder='"+ adata.data()[0][4] +"' style='overflow:hidden'  class='form-control'></div>";
				    data += "<div class='form-group'><label>Precio de venta: </label><label class='stockErrorControl' id='errControl2'> * Debe ser un valor de precio válido</label>";
				    data += "<input type='text' id='priceSell"+ adata.data()[0][0]+"' name='priceSell"+ adata.data()[0][0]+"' placeholder='"+ adata.data()[0][5] +"' style='overflow:hidden' class='form-control'></div>";
			    	data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      $('#myModal').find('.modal-title').html('Editar Precios de Stock');
				      $('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      $('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='stockPrices'>Confirmar</button>");
				    });

				    $('#myModal').modal('show');
				    $('#myModal input[0]').focus();
				}

				$(document).on('click', '#stockPrices', function() {
				    // edit row function needs to go here
				    var elements = $(".form-control");
				    var dataArray = [];
				    for (var i=0;i<elements.length;i++) {
				    	dataArray.push(elements[i].value);
				    }

				    //Control de errores
				    $(".stockErrorControl").hide();
				    var errClear = true;
				    if (!isNumeric(dataArray[1]) || dataArray[1].length==0) {
				    	$("#errControl1").show(); 
				    	errClear = false;
				    }
				    if (!isNumeric(dataArray[2]) || dataArray[2].length==0) {
				    	$("#errControl2").show(); 
				    	errClear = false;
				    }
				   	if (errClear) {
						$('#myModal').modal('hide');
				    	dataArray[1] = dataArray[1].replace(",",".");
						dataArray[2] = dataArray[2].replace(",",".");
						var selectedData = myTable.rows({
							selected: true
						});
						stockAjaxRequest(dataArray[0],"stockPrices",dataArray);	
				   	}
				});

				//---------Function to Display modal editButton---------
				function stockSwap(pointer, oTT, button, conf) {
				    var adata = oTT.rows({
				      selected: true
				    });
				    var currentId = adata.data()[0][0];
				    var data = "";
				    var myTable = pointer;
				    data += "<form name='incomingStockForm' role='form'>";
				    data += "<div class='form-group'><label for='id'>Id: </label>"+ adata.data()[0][0]+"</br>";
				    data += "<input id='stockId' type='hidden' class='form-control' value='"+ adata.data()[0][0] +"'/>";
				    data += "<label for='Producto'>Producto: </label>"+ adata.data()[0][1] +" <br /><label for='Precio'>Precio de Compra: </label>"+ adata.data()[0][4] +"€ <label for='Precio'>Precio de Venta: </label>"+ adata.data()[0][5] +"€ </div>";			    
				    data += "<div class='form-group'><label>Productos en tienda: </label><input type='text' id='stockShop"+ adata.data()[0][0]+"' name='stockShop"+ adata.data()[0][0]+"' placeholder='"+ adata.data()[0][2] +"' style='overflow:hidden'  class='form-control'></div>";
				    data += "<div class='form-group'><label>Productos en almacén: </label><input type='text' id='stockWarehouse"+ adata.data()[0][0]+"' name='stockWarehouse"+ adata.data()[0][0]+"' placeholder='"+ adata.data()[0][3] +"' style='overflow:hidden' class='form-control'></div>";
			    	data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      $('#myModal').find('.modal-title').html('Mover Stock');
				      $('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      $('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='stockSwapBtn'>Confirmar</button>");
				    });

				    $('#myModal').modal('show');
				    $('#myModal input[0]').focus();

				    	//SwapFunctions 
						//<input id='swapToWarehouse' type='button' value='+' />
						$(document).on('change', '#stockShop'+currentId, function() {
							var currentShop = $("#stockShop"+currentId).val();
							//comprobar si es entero!
							if(isInt(currentShop)) {
								var diff = adata.data()[0][2] - currentShop;
								var currentWarehouse = parseInt(adata.data()[0][3])+parseInt(diff);
								//alert("Almacen: "+currentWarehouse);
								if (currentWarehouse < 0) {
									$("#stockShop"+currentId).val(parseInt(currentShop)+parseInt(currentWarehouse));
									$("#stockWarehouse"+currentId).val(0);
								} else {
									$("#stockWarehouse"+currentId).val(currentWarehouse);
								}			
							} else {
								$("#stockShop"+currentId).val("");
								$("#stockWarehouse"+currentId).val("");						
							}
						});

						//<input id='swapToWarehouse' type='button' value='+' />
						$(document).on('change', '#stockWarehouse'+currentId, function() {
							var currentWarehouse = $("#stockWarehouse"+currentId).val();
							if(isInt(currentWarehouse)) {
								var diff = adata.data()[0][3] - currentWarehouse;
								var currentShop = parseInt(adata.data()[0][2])+parseInt(diff);
								//alert("Tienda : "+currentShop);
								if (currentShop < 0) {
									$("#stockWarehouse"+currentId).val(parseInt(currentWarehouse)+parseInt(currentShop));
									$("#stockShop"+currentId).val(0);
								} else {
									$("#stockShop"+currentId).val(currentShop);
								}			
							} else {
								$("#stockShop"+currentId).val("");
								$("#stockWarehouse"+currentId).val("");						
							}						
						});
				};

				$(document).on('click', '#stockSwapBtn', function() {
				    // edit row function needs to go here
				    var elements = $(".form-control");
				    var dataArray = [];
				    for (var i=0;i<elements.length;i++) {
				    	dataArray.push(elements[i].value);
				    }

				    //Control de errores
				    if(isInt(dataArray[1]) && isInt(dataArray[2])) {
					    $('#myModal').modal('hide');
			    
					    var selectedData = myTable.rows({
					      selected: true
					    });

					    dataId = selectedData.data()[0][0];
					    stockAjaxRequest(dataId,"stockSwap",dataArray);				    	
				    } 
				});

				//---------Function to Display modal incoming---------
				function incomingStock(pointer, oTT, button, conf) {
				    var adata = oTT.rows({
				      selected: true
				    });

				    var data = "";
				    var myTable = pointer;
				    data += "<form name='incomingStockForm' role='form'>";
				    data += "<div class='form-group'><label for='id'>Id: </label>"+ adata.data()[0][0] +"</div>";
				    data += "<input id='stockId' type='hidden' class='form-control' value='"+ adata.data()[0][0] +"'/>";
				    data += "<div class='form-group'><label for='Producto'>Producto: </label>"+ adata.data()[0][1] +" <br /><label for='Preciocompra'>Precio de compra: </label>"+ adata.data()[0][4] +"€ <br />";
				    data += "<label for='Tienda'>En Tienda: </label>"+ adata.data()[0][2] +" <br /><label for='Almacén'>En Almacén: </label>"+ adata.data()[0][3] +"</div><br />";


				    data += "<div class='form-group'><label>Entrada en tienda: </label><label class='stockErrorControl' id='errControl1'> * Debe ser un entero mayor o igual a cero</label>";
				    data += "<input type='text' id='incomingShop' name='incomingShop' placeholder='0' style='overflow:hidden'  class='form-control' value='0'></div>";
				    data += "<div class='form-group'><label>Entrada en almacén: </label><label class='stockErrorControl' id='errControl2'> * Debe ser un entero mayor o igual a cero</label>";
				    data += "<input type='text' id='incomingWarehouse' name='incomingWarehouse' placeholder='0' style='overflow:hidden'  class='form-control' value='0'></div>";
				    data += "<div class='form-group'><label>Precio Unidad: </label><label class='stockErrorControl' id='errControl3'> * Valor erróneo para campo precio </label>";
				    data += "<input type='text' id='price' name='price' placeholder='"+ adata.data()[0][4] +"' style='overflow:hidden' class='form-control' value='"+ adata.data()[0][4] +"'></div>";
				    data += "<div class='form-group'><label>IVA: </label><label class='stockErrorControl' id='errControl4'> * Debe ser un entero entre cero y cien </label>";
				    data += "<input type='text' id='price' name='iva' placeholder='' style='overflow:hidden' class='form-control' value='10'></div>";
				    
				    data += "<input type='hidden' id='actor' name='actor' style='overflow:hidden' class='form-control' value='"+logedUser+"'></div>";
				    data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      $('#myModal').find('.modal-title').html('Control de Stock');
				      $('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      $('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='confirmButton'>Confirmar</button>");
				    });

				    $('#myModal').modal('show');
				    $('#myModal input[0]').focus();
				};

				function stockErrorControl(dataArray) {
					var errClear = true;
					var errIndex = [];
					$(".stockErrorControl").hide();
					//alert(dataArray[0]+" "+dataArray[0].length);

					//Tienda
					if ((dataArray[1].length == 0) || !isIntOrNeg(dataArray[1])){ 
						errClear = false;
						errIndex.push(1);
					} 
					//Almacen
					if ((dataArray[2].length == 0) || !isIntOrNeg(dataArray[2])){ 
						errClear = false;
						errIndex.push(2);					
					}
					//Precio
					if (!isNumeric(dataArray[3])) { 
						errClear = false;
						errIndex.push(3);			
					}					

					//IVA 
					if ((dataArray[4].length == 0) || !isInt(dataArray[4])){ 
						errClear = false;
						errIndex.push(4);
					}

					if (!errClear) {
						for (var i=0;i<errIndex.length;i++) { 
							$("#errControl"+errIndex[i]).show(); 
						}
						return false;
					} else {
						return true;
					}
				}

				// Confirm 
				$(document).on('click', '#confirmButton', function() {
				    // edit row function needs to go here
				    var elements = $(".form-control");
				    var dataArray = [];
				    for (var i=0;i<elements.length;i++) {
				    	dataArray.push(elements[i].value);
				    }

				    //Control de errores
				    //errorControl(dataArray);
				    console.log(dataArray);	
				    //Control de errores
				    if(stockErrorControl(dataArray)) {
				    	dataArray[3] = dataArray[3].replace(",",".");
					    $('#myModal').modal('hide');
			    
					    var selectedData = myTable.rows({
					      selected: true
					    });

					    dataId = selectedData.data()[0][0];
					    stockAjaxRequest(dataId,"stockIn",dataArray);				    	
				    }
				});
			});