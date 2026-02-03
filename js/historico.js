			$(document).ready(function() { 	 	 	 	 	 	
				var columnDefs = [
					{ title: "Id." },
					{ title: "Id.Factura" },
					{ title: "Id.Producto" },
					{ title: "Producto" },
					{ title: "Operación" },
					{ title: "Actor" },
					{ title: "Unidades" },
					{ title: "Precio" },
					{ title: "Total" },
					{ title: "Fecha" }
				];

				var myTable;

				/*myTable = $('#example').DataTable({
					"ajax": "./ajax.script.php"
				});*/

				//This creates the table with all buttons and specifications
				myTable = $('#movements').DataTable({
					    "sPaginationType": "full_numbers",
					    "ajax": {
					    	"url":"./ajax.script.historico.php",
					    	"dataType":"json"
					    	//"dataSrc": ""
				       		//"columns": columnDefs
					    },
					    "language": {
					    	"url": "./datatables.spanish.txt"
					    },
					    columns: columnDefs, 
				        "columnDefs": [
							{
							"targets":[9],
							"render": {
									"display": function (data, type, full) {
										var a=data.split(" ");
										var b=a[0].split("-");
										var c=a[1].split(":");
										//var date = new Date(b[0],b[1],b[2],c[0],c[1],c[2]);
										//var dateOutput = checkTime(date.getDate())+"/"+checkTime(date.getMonth())+"/"+checkTime(date.getFullYear())+" "+checkTime(date.getHours())+":"+checkTime(date.getMinutes())+":"+checkTime(date.getSeconds());
										var dateOutput = b[2]+"/"+b[1]+"/"+b[0]+" "+c[0]+":"+c[1]+":"+c[2];
										return dateOutput;										
									},
									"filter": function (data, type, full) {
										var a=data.split(" ");
										var b=a[0].split("-");
										var c=a[1].split(":");
										//var date = new Date(b[0],b[1],b[2],c[0],c[1],c[2]);
										//var dateOutput = checkTime(date.getDate())+"/"+checkTime(date.getMonth())+"/"+checkTime(date.getFullYear())+" "+checkTime(date.getHours())+":"+checkTime(date.getMinutes())+":"+checkTime(date.getSeconds());
										var dateOutput = b[2]+"/"+b[1]+"/"+b[0]+" "+c[0]+":"+c[1]+":"+c[2];
										return dateOutput;										
									},
									"sort": function (data, type, full) {
											return data;
									}
								}
							}
				        ],
				        "aaSorting": [[0,'desc']],
					    //data: dataSet, 
					    dom: 'ftlip',
					    responsive: true,
					    select: 'single',
					    /*
					    buttons: [{
					      extend: 'selected',
					      text: 'Editar Movimiento',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        alterMovement(this, dt, node, config)
					      }
					    }],
					    */
					    "initComplete": function(settings, json) {
					      $('#example').DataTable()
					        .columns.adjust()
					        .responsive.recalc()
					    }
					}
				);

				/*
				function clientAjaxRequest(dataToSend) {
					$.ajax({
						data:{
							"dataSend":dataToSend,
							"action":"update"
						},
					  	dataType:"text",
					  	url: "./ajax.script.historico.php",
					  	error: function(XMLHttpRequest, errorType, errorThrown){
							//Comentarlo para su salida en produccion
							alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
						},
					  	success: function (result) {
					  		//console.log(result);
					  		myTable.ajax.reload(null, false);
						}
					});
				}*/

				function checkTime(i) {
				    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10

				    return i;
				}

				/*
				function alterMovement(pointer, oTT, button, conf) {
				    var adata = oTT.rows({
				      selected: true
				    });

				    //console.log('adata', adata)
				    //console.log(adata.data()[0])
				    //console.log(adata.ids())
				    var operationOpts = [
				    	"efectivo en tienda",
				    	"efectivo envío",
				    	"tarjeta en tienda",
				    	"tarjeta envío",
				    	"cortesía en tienda",
				    	"cortesía envío",
				    	"entrada de stock",
				    	"pendiente",
				    	"anulado"
					];

				    var data = "";
				    var currentOperation = "";
				    var myTable = pointer;
				    data += "<form name='alterMovementForm' role='form'>";
				    for (i in columnDefs) {
				    	if (columnDefs[i].title == "operación") {
				    		currentOperation = adata.data()[0][i];
				    		data += "<div class='form-group'><label for='"+columnDefs[i].title+"'>"+columnDefs[i].title+" : </label><select id='"+columnDefs[i].title+"' class='form-control'>";
					    	if (currentOperation=="pendiente") {
					    		for (j in operationOpts) {
					    			if(currentOperation==operationOpts[j]) {
					    				data +=	"<option value='"+operationOpts[j]+"' selected>"+operationOpts[j]+"</option>";
					    			} else {
					    				data +=	"<option value='"+operationOpts[j]+"'>"+operationOpts[j]+"</option>";
					    			}
					    		}
					    	} else {
					    		if (currentOperation!="anulado") {
						    		data +=	"<option value='"+adata.data()[0][i]+"' selected>"+adata.data()[0][i]+"</option>";
						    		data +=	"<option value='anulado'>anulado</option>";
					    		} else {
					    			data +=	"<option value='"+adata.data()[0][i]+"' selected>"+adata.data()[0][i]+"</option>";
					    		}
					    	}
				    		data += "</select></div>";
				    	} else {
				    		if (columnDefs[i].title == "timestamp") {
								var today = new Date();
								var D = today.getDate();
								var M = today.getMonth()+1;
								var Y = today.getFullYear();
								var h = today.getHours();
								var m = today.getMinutes();
								var s = today.getSeconds();

							    M = checkTime(M);
							    D = checkTime(D);
							    h = checkTime(h);
							    m = checkTime(m);
							    s = checkTime(s);

								currentTimestamp = Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
				    			data += "<div class='form-group'><label for='"+columnDefs[i].title+"'>"+columnDefs[i].title+" : </label><input type='hidden'  id='" + columnDefs[i].title + "' name='" + columnDefs[i].title + "' style='overflow:hidden'  class='form-control' value='"+currentTimestamp+"'><label id='newTimestamp'>"+currentTimestamp+"</label></div>";
				    		} else {
				    			data += "<div class='form-group'><label for='"+columnDefs[i].title+"'>"+columnDefs[i].title+" : </label><input type='hidden'  id='" + columnDefs[i].title + "' name='" + columnDefs[i].title + "' style='overflow:hidden'  class='form-control' value='" + adata.data()[0][i] + "' >" + adata.data()[0][i] + "</input></div>";
				    		}  		
				    	}
					}
				    data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      	$('#myModal').find('.modal-title').html('Editar Movimiento');
				     	$('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      	$('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='alterMoveBtn'>Confirmar</button>");
				    });

				    $('#myModal').modal('show');
				    $('#myModal input[0]').focus();			     
				};*/

				// edit row functionality
				/*
				$(document).on('click', '#alterMoveBtn', function() {
					$('#myModal').modal('hide');
					var elements = $(".form-control");
					var dataArray = [];
					for (var i=0;i<elements.length;i++) {
					   	dataArray.push(elements[i].value);
					    //console.log(elements[i].value);
					}

					//alert ("a");
				    $('#myModal').find('.modal-title').html("");
				    $('#myModal').find('.modal-body').html("");
				    $('#myModal').find('.modal-footer').html("");

					dataToSend = [dataArray[0],dataArray[3],dataArray[8]];
					clientAjaxRequest(dataToSend);	
				});	*/

				$(window).resize(function() {
					$('#movements').DataTable()
					.columns.adjust()
					.responsive.recalc()
					.responsive.rebuild()
				});

			}); //DOcument READY 1 END!
			

$(document).ready(function() { 	 	 	 	 	 	
				var columnDefs = [
					{ title: "Idreal" },
					{ title: "Id." },
					{ title: "Venta" },
					{ title: "Cliente" },
					{ title: "Pago" },
					{ title: "Usuario" },
					{ title: "Comercial" },
					{ title: "Desc." },
					{ title: "Tipo Desc." },
					{ title: "Extras" },
					{ title: "Iva Ext." },
					{ title: "Envio" },
					{ title: "Iva Env." },
					{ title: "Base" },
					{ title: "Total" },
					{ title: "Fecha" }
				];

				var myTable;

				/*myTable = $('#example').DataTable({
					"ajax": "./ajax.script.php"
				});*/

				//This creates the table with all buttons and specifications
				myTable = $('#invoices').DataTable({
					    "sPaginationType": "full_numbers",
					    "ajax": {
					    	"url":"./ajax.script.historico2.php",
					    	"dataType":"json"
					    	//"dataSrc": ""
				       		//"columns": columnDefs
					    },
					    "language": {
					    	"url": "./datatables.spanish.txt"
					    },
					    columns: columnDefs, 
				        "columnDefs": [
            				{ 	
            					"targets": [0], 
            					"visible": false 
            				},					        
            				{ 	
            					"targets": [8], 
            					"visible": false 
            				},				        
							{
								"targets":[15],
								"render": {
								"display": function (data, type, full) {
									//console.log(data); 
									var a=data.split(" ");
									var b=a[0].split("-");
									var c=a[1].split(":");
									//var date = new Date(b[0],b[1],b[2],c[0],c[1],c[2]);
									//var dateOutput = checkTime(date.getDate())+"/"+checkTime(date.getMonth())+"/"+checkTime(date.getFullYear())+" "+checkTime(date.getHours())+":"+checkTime(date.getMinutes())+":"+checkTime(date.getSeconds());
									var dateOutput = b[2]+"/"+b[1]+"/"+b[0]+" "+c[0]+":"+c[1]+":"+c[2];
									return dateOutput;				

									},
									"filter": function (data, type, full) {
									var a=data.split(" ");
									var b=a[0].split("-");
									var c=a[1].split(":");
									//var date = new Date(b[0],b[1],b[2],c[0],c[1],c[2]);
									//var dateOutput = checkTime(date.getDate())+"/"+checkTime(date.getMonth())+"/"+checkTime(date.getFullYear())+" "+checkTime(date.getHours())+":"+checkTime(date.getMinutes())+":"+checkTime(date.getSeconds());
									var dateOutput = b[2]+"/"+b[1]+"/"+b[0]+" "+c[0]+":"+c[1]+":"+c[2];
									return dateOutput;													
									},
									"sort": function (data, type, full) {
										return data;
									}
								}
							},
							{
								"targets": [7],
				                "render": function ( data, type, row ) {
				                	if (row[8]=="porcentaje") {
				                		return data +' %';
				                	} else if (row[8]=="euros") {
				                		return data +' €';
				                	} else {
				                		return data;
				                	}
				                }
							}
				        ],
				        "aaSorting": [[0,'desc']],
				        /*"columnDefs": [
				            {
				                "targets": [0],
				                "visible": false,
				                "searchable": false
				            }	
				        ],*/
					    //data: dataSet, 
					    dom: 'Bftlip',
					    responsive: true,
					    select: 'single',
					    buttons: [{
					      extend: 'selected',
					      text: 'Editar Factura/Tiquet',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        alterFact(this, dt, node, config);
					      }
					    },{
					      extend: 'selected',
					      text: 'Imprimir Factura/Tiquet',
					      action: function(e, dt, node, config) {
					      	var adata = dt.rows({
						      selected: true
						    });					        
    						//top.location.href = '/pdf/doc'+adata.data()[0][0]+'.pdf';
    						window.open('./pdf/doc'+adata.data()[0][0]+'.pdf','_blank');
					      }
					    }],
					    "initComplete": function(settings, json) {
					      $('#invoicesEdit').DataTable()
					        .columns.adjust()
					        .responsive.recalc();
					    }
					}
				);

				function clientAjaxRequest(dataToSend) {
					//console.log(dataToSend);

					$.ajax({
						data:{
							"dataSend":dataToSend,
							"action":"update"
						},
					  	dataType:"text",
					  	url: "./ajax.script.historico2.php",
					  	error: function(XMLHttpRequest, errorType, errorThrown) {
							//Comentarlo para su salida en produccion
							alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
						},
					  	success: function (result) {
					  		console.log(result);
					  		myTable.ajax.reload(null, false);
						}
					});
				}

				function checkTime(i) {
				    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
				    return i;
				}

				function alterFact(pointer, oTT, button, conf) {
				    var adata = oTT.rows({
				      selected: true
				    });

				    //console.log('adata', adata)
				    //console.log(adata.data()[0])
				    //console.log(adata.ids())
				    var operationOpts = [
				    	"efectivo",
				    	"tarjeta",
				    	"cortesía",
				    	"pendiente",
				    	"anulado"
					];

					var operationVenta = [
				    	"en tienda",
				    	"envío"
					];

				    var data = "";
				    var currentOperation = "";
				    var myTable = pointer;
				    var friendlyTitle = "";
				    var currentTitle = "";

				    data += "<form name='alterFactForm' role='form'>";
				    for (i in columnDefs) {
				    	//Eliminamos puntos y espacios de los títulos de columna
				    	friendlyTitle = columnDefs[i].title;
						currentTitle=columnDefs[i].title.replace(".",'');
						currentTitle=currentTitle.replace(" ",'');

				    	if (currentTitle == "Pago") {
				    		currentOperation = adata.data()[0][i];
				    		data += "<div class='form-group'><label for='"+currentTitle+"'>"+currentTitle+" : </label><select id='"+currentTitle+"' class='form-control'>";
					    	for (j in operationOpts) {
					    			if(currentOperation==operationOpts[j]) {
					    				data +=	"<option value='"+operationOpts[j]+"' selected>"+operationOpts[j]+"</option>";
					    			} else {
					    				data +=	"<option value='"+operationOpts[j]+"'>"+operationOpts[j]+"</option>";
					    			}
					    	}
				    		data += "</select></div>"; 
				    	} else if (currentTitle == "Fecha") {
				    		/*
				    		//PARA FECHA ACTUAL
							var today = new Date();
							var D = today.getDate();
							var M = today.getMonth()+1;
							var Y = today.getFullYear();
							var h = today.getHours();
							var m = today.getMinutes();
							var s = today.getSeconds();

						    M = checkTime(M);
						    D = checkTime(D);
						    h = checkTime(h);
						    m = checkTime(m);
						    s = checkTime(s);

							var currentTimestamp = Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
							var friendlyTimestamp = D+"/"+M+"/"+Y+" "+h+":"+m+":"+s;
							*/
							
							//PARA FECHA POR DEFECTO
							var a=adata.data()[0][i].split(" ");
							var b=a[0].split("-");
							var c=a[1].split(":");
							var date = new Date(b[0],b[1],b[2],c[0],c[1],c[2]);
							var friendlyTimestamp = checkTime(date.getDate())+"/"+checkTime(date.getMonth())+"/"+checkTime(date.getFullYear())+" "+checkTime(date.getHours())+":"+checkTime(date.getMinutes())+":"+checkTime(date.getSeconds());	
							
			    			data += "<div class='form-group'><label for='"+currentTitle+"'>"+currentTitle+": </label>";
			    			//data += "<input type='hidden' id='"+currentTitle+"' name='"+currentTitle+"' style='overflow:hidden'  class='form-control' value='"+currentTimestamp+"'/>"+friendlyTimestamp+"</div>";
		    				data += "<input type='hidden' id='"+currentTitle+"' name='"+currentTitle+"' style='overflow:hidden'  class='form-control' value='"+adata.data()[0][i]+"'/>"+friendlyTimestamp+"</div>";

		    			} else if (currentTitle == "Venta") {
				    		currentOperation = adata.data()[0][i];
				    		data += "<div class='form-group'><label for='"+currentTitle+"'>"+currentTitle+" : </label><select id='"+currentTitle+"' class='form-control'>";
					    	for (cont in operationVenta) {
					    			if(currentOperation==operationVenta[cont]) {
					    				data +=	"<option value='"+operationVenta[cont]+"' selected>"+operationVenta[cont]+"</option>";
					    			} else {
					    				data +=	"<option value='"+operationVenta[cont]+"'>"+operationVenta[cont]+"</option>";
					    			}
					    	}
				    		data += "</select></div>"; 
				    	} else if (currentTitle == "Idreal") {
				    		data += "<input  type='hidden' id='" + currentTitle + "' name='" + currentTitle + "' style='overflow:hidden' class='form-control' value='" + adata.data()[0][i] + "' >";
				    	} else if (currentTitle == "Cliente") {
				    		data += "<div class='form-group'><label for='"+currentTitle+"'>"+friendlyTitle+" : </label><input  type='hidden' id='" + currentTitle + "' name='" + currentTitle + "' style='overflow:hidden'  class='form-control' value='" + adata.data()[0][i] + "' >" + adata.data()[0][i] + "</input></div>";
				    	} else if (currentTitle == "Usuario" ) {
				    		data += "<div class='form-group'><label for='"+currentTitle+"'>"+friendlyTitle+": </label>";
				    		data += "<select id='"+currentTitle+"' class='form-control'>";
				    		data += "<option value="+adata.data()[0][i]+" selected>"+adata.data()[0][i]+"</option>";
				    		if (logedUser!=adata.data()[0][i]) {
				    			data += "<option value="+logedUser+">"+logedUser+"</option>";	
				    		}
				    		data += "</select></div>";
				    	} else if (currentTitle == "TipoDesc") {
				    		data += "<div class='form-group'><label for='"+currentTitle+"'>"+friendlyTitle+": </label>";
				    		data += "<select id='"+currentTitle+"' class='form-control'>";
				    		if (adata.data()[0][i] == "euros") {
				    			data += "<option value='ninguno'>Ninguno</option>";
					    		data += "<option value='porcentaje'>Porcentaje</option>";
					    		data += "<option value='euros' selected>Euros</option>";
				    		} else if (adata.data()[0][i] == "porcentaje") {
				    			data += "<option value='ninguno'>Ninguno</option>";
					    		data += "<option value='porcentaje' selected>Porcentaje</option>";
					    		data += "<option value='euros'>Euros</option>";
				    		} else {
				    			data += "<option value='ninguno'>Ninguno</option>";
					    		data += "<option value='porcentaje'>Porcentaje</option>";
					    		data += "<option value='euros'>Euros</option>";
				    		}
				    		data += "</select>";
				    		data += "</div>";
				    	} else {
				    		//Etiquetas de control de errores
				    		data += "<div class='form-group'><label for='"+currentTitle+"'>"+friendlyTitle+": </label>";
				    		switch (currentTitle) {
				    			case "Comercial": { data += "<label id='errControl"+i+"' class='historicoErrorControl'>* Debe tener al menos tres carácteres </label>"; break; }
				    			case "Desc": { data += "<label id='errControl"+i+"' class='historicoErrorControl'>* Debe ser un descuento en euros o en porcentaje </label>"; break; }
				    			case "IvaExt":
				    			case "IvaEnv": { data += "<label id='errControl"+i+"' class='historicoErrorControl'>* Debe ser un número entero entre cero y cien </label>"; break; }
				    			case "Extras":
				    			case "Envio":
				    			case "Base":
				    			case "Total": { data += "<label id='errControl"+i+"' class='historicoErrorControl'>* Debe ser un número igual o superior a cero </label>"; break; }
				    			case "Id": { data += "<label id='errControl"+i+"' class='historicoErrorControl'>* Debe ser un identificador válido de facturas o tickets. </label>"; break; }
				    		}
				    		data += "<input id='"+currentTitle+"' name='"+ currentTitle+"' style='overflow:hidden'  class='form-control' value='" + adata.data()[0][i] + "' ></div>";
				    	}
					}
				    
					$.ajax({
						data:{
							"dataSend":[adata.data()[0][0]],
							"action":"products"
						},
					  	dataType:"json",
					  	url: "./ajax.script.historico2.php",
					  	error: function(XMLHttpRequest, errorType, errorThrown) {
							//Comentarlo para su salida en produccion
							alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
						},
					  	success: function (result) {
					  		//console.log(result);
					  		var newIndex = 15; //Indice para asignar un id a los labels de control de errores de productos
					  		var emptyProduct;
					  		for (i in result) {
					  			emptyProduct = false;
					  			if ((result[i][3]) == null && (result[i][4] == null) && (result[i][5] == null)) { emptyProduct = true; }
									data += "<div class='form-group'><label>"+result[i][1]+"</label><label id='errControlGroup"+i+"' class='historicoErrorControl'> * Hay uno o más errores en este producto </label><br/>";
									data += "<input type='hidden' id='prodname"+result[i][0]+"' name='prodname"+result[i][0]+"' class='form-control' value='"+result[i][1]+"'>"; 
									newIndex++;
									data += "Cant:<label id='errControl"+(newIndex)+"' class='historicoErrorControl'>*</label><input type='text' id='cant"+result[i][0]+"' name='cant"+result[i][0]+"' style='overflow:hidden;width:15%;display: inline;' class='form-control' value='"+((!emptyProduct)?result[i][2]:0)+"'/>"; newIndex++;
									data += "Precio un.:<label id='errControl"+(newIndex)+"' class='historicoErrorControl'>*</label><input type='text' id='precio"+result[i][0]+"' name='precio"+result[i][0]+"' style='overflow:hidden;width:15%;display: inline;' class='form-control' value='"+((!emptyProduct)?result[i][3]:0)+"'/>"; newIndex++;
									data += "Iva:<label id='errControl"+(newIndex)+"' class='historicoErrorControl'>*</label><input type='text' id='iva"+result[i][0]+"' name='iva"+result[i][0]+"' style='overflow:hidden;width:15%;display: inline;' class='form-control' value='"+((!emptyProduct)?result[i][4]:0)+"'/>"; newIndex++;
					  				data += "</div>";
					  		}
					  		//data +="probando cosas "+ "mas cosas"+result[0][1]+ "mas cosas"+result[0][1];
							data += "</form>";
				
							$('#myModal').on('show.bs.modal', function() {
								$('#myModal').find('.modal-title').html('Editar Facturas/Tiquets');
								$('#myModal').find('.modal-body').html('<pre>'+data+'</pre>');
								$('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='alterFactBtn'>Confirmar</button>");
							});

							$('#myModal').modal('show');
							$('#myModal input[0]').focus();	

							swapDiscountField();
						}
					});
				};//End Alter Fact

				function swapDiscountField() {
					if ($("#TipoDesc").val() == "ninguno") {
						$("#Desc").val("0");
						$("#Desc").attr("disabled","disabled");
					} else {
						$("#Desc").removeAttr("disabled");
					}
				}

				$(document).on('change', '#TipoDesc', function() {
					swapDiscountField();
				});	

				// edit row functionality
				$(document).on('click', '#alterFactBtn', function() {
					var elements = $(".form-control");
					var dataArray = [];
					for (var i=0;i<elements.length;i++) {
					   	dataArray.push(elements[i].value);
					    //console.log(i+": "+elements[i].value);
					}
					//alert ("a");
					/*dataToSend = [dataArray[0],dataArray[3],dataArray[11]];
					console.log(dataA);*/
					
					if (historicalErrorControl(dataArray)) {
						$('#myModal').modal('hide');
						$('#myModal').find('.modal-title').html("");
					    $('#myModal').find('.modal-body').html("");
					    $('#myModal').find('.modal-footer').html("");
					    //console.log(dataArray);
						clientAjaxRequest(dataArray);	
					}
				});	

				function isInt(number) {
					if(Math.floor(number) == number && $.isNumeric(number) && number>=0) {
						return true;
					} else {
						return false;
					}
				}

				function isNumeric(number) {
					//console.log("Numero: "+number+"Longitud: "+number.length);
					if (!/^([0-9])*[.,]?[0-9]*$/.test(number) || (number.length<=0)) {
					  return false;
					} else {
					  return true;
					}
				}

				function historicalErrorControl(dataArray) {
					var errClear = true;
					var errIndex = [];
					$(".historicoErrorControl").hide();

					//Identificador Cliente 
					if (!/^(T|F)[0-9]+-2[0-9]{3}$/.test(dataArray[1])) {
						errClear = false;
						errIndex.push(1);
					}	
					//Comercial
					if (dataArray[6].length<3 && dataArray[6].length>0) {
						errClear = false;
						errIndex.push(6);
					}
					//Descuento
					if ($("#TipoDesc").val() == "euros") {
						if (!isNumeric(dataArray[7])) {
							errClear = false;
							errIndex.push(7);
						}
					} else if ($("#TipoDesc").val() == "porcentaje")  {
						if (!isInt(dataArray[7])) {
							errClear = false;
							errIndex.push(7);
						}
					}
					//Tipo Descuento: 8

					//Extras
					if (!isNumeric(dataArray[9])) {
						errClear = false;
						errIndex.push(9);
					}
					//Iva Extras
					if (!isInt(dataArray[10])) {
						errClear = false;
						errIndex.push(10);
					}
					//Envío
					if (!isNumeric(dataArray[11])) {
						errClear = false;
						errIndex.push(11);
					} 
					//Iva Envío
					if (!isInt(dataArray[12])) {
						errClear = false;
						errIndex.push(12);
					}
					//Base
					if (!isNumeric(dataArray[13])) {
						errClear = false;
						errIndex.push(13);
					}
					//Total
					if (!isNumeric(dataArray[14])) {
						errClear = false;
						errIndex.push(14);
					}

					//Control de errores de los productos (índice de etiquetas de error 16 para arriba)
					var n;
					n = 1;
					for (var j=16;j<dataArray.length;j++) {
						//console.log("valor: "+dataArray[j]+" n:"+n+" Iteracion"+j);
						switch (n) {
							case 1: 
							case 3: {
								if (!isInt(dataArray[j+1])) {
									errClear = false;
									errIndex.push(j);
								}
								break;
							}
							case 2: {
								if (!isNumeric(dataArray[j+1])) {
									errClear = false;
									errIndex.push(j);
								}
								break;
							}

						}
						n++;
						if (n>3) {
							n=1;
							j++;
						}
					}

					//console.log(errIndex);
					if (!errClear) {
						for (var i=0;i<errIndex.length;i++) {
							$("#errControl"+errIndex[i]).show(); 
							if (errIndex[i]>=16) {
								var groupIndex = Math.floor((errIndex[i]-16)/4);
								$("#errControlGroup"+groupIndex).show();
							}
						}
						return false;
					} else {
						return true;
					}
				}

				$(window).resize(function() {
					$('#invoices').DataTable()
					.columns.adjust()
					.responsive.recalc()
					.responsive.rebuild();
				});
});