$(document).ready(function() {
				
				var columnDefs = [
					{ title: "Id." },
					{ title: "Nombre" },
					{ title: "NIF" },
					{ title: "Dirección" },
					{ title: "Código Postal" },
					{ title: "Población" },
					{ title: "País" },
					{ title: "Teléfono" },
					{ title: "Email" },
					{ title: "Observaciones" }
				];

				var myTable;

				/*myTable = $('#example').DataTable({
					"ajax": "./ajax.script.php"
				});*/

				//This creates the table with all buttons and specifications
				myTable = $('#example').DataTable({
					    "sPaginationType": "full_numbers",
					    "ajax": {
					    	"url":"./ajax.script.clientes.php",
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
				                "visible": false,
				                "searchable": false
				            }	
				        ],
					    //data: dataSet, 
					    dom: 'Bftlip',
					    responsive: true,
					    select: 'single',

					    /*
						    l - length changing input control
						    f - filtering input
						    t - The table!
						    i - Table information summary
						    p - pagination control
						    r - processing display element
					    */
					    buttons: [{
					      //extend: 'selected',
					      text: 'Añadir',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        addClick(this, dt, node, config)
					      }
					    }, {
					      extend: 'selected',
					      text: 'Eliminar',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        deleteClick(this, dt, node, config)
					   	  }
					    }, {
					      extend: 'selected',
					      text: 'Editar',
					      action: function(e, dt, node, config) {
					        var rows = dt.rows({
					          selected: true
					        }).count();
					        editClick(this, dt, node, config)
					      }
					    }],
					    "initComplete": function(settings, json) {
					      $('#example').DataTable()
					        .columns.adjust()
					        .responsive.recalc()
					    }
					}
				);

				function clientAjaxRequest(id,action,data) {
					$.ajax({
						data:{"id":id,"action":action,"dataset":data},
					  	dataType:"text",
					  	url: "./ajax.script.clientes.php",
					  	error: function(XMLHttpRequest, errorType, errorThrown){
							//Comentarlo para su salida en produccion
							alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
						},
					  	success: function (result) {
					  		console.log(result);
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

				//NOT WORKING
				/*
				$("#redraw-table").click(function(){
					//alert("this is not working");
					myTable.dataTable().fnDraw();
				});*/

				function clientErrorControl(dataArray) {
					var errClear = true;
					var errIndex = [];
					$(".clientErrorControl").hide();
					//alert(dataArray[0]+" "+dataArray[0].length);

					//Nombre
					if (dataArray[0].length<3) { 
						errClear = false;
						errIndex.push(1);
					} 
					//NIF
					if ((!dataArray[1].match(/^[0-9]{8}-?[A-Z]$/i) && !dataArray[1].match(/^[A-Z]-?[0-9]{8}$/i)) && dataArray[1].length>0) { 
						errClear = false;
						errIndex.push(2);					
					}
					//Direccion
					if (dataArray[2].length>0 && dataArray[2].length<3) { 
						errClear = false;
						errIndex.push(3);			
					}					
					//CP
					if (!dataArray[3].match(/^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/i) && dataArray[3].length!=0) { 
						errClear = false;
						errIndex.push(4);						
					}				
					//Poblacion
					if (dataArray[4].length>0 && dataArray[4].length<3) { 
						errClear = false;
						errIndex.push(5);						
					}					
					//Pais
					if (dataArray[5].length>0 && dataArray[5].length<3) { 
						errClear = false;
						errIndex.push(6);						
					}					
					//Teléfono
					if ((!dataArray[6].match(/^(6|7)[0-9]{8}$/i) && !dataArray[6].match(/^(8|9)[0-9]{8}$/i)) && dataArray[6].length>0) { 
						errClear = false;
						errIndex.push(7);						
					}					
					//Email
					if (!dataArray[7].match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i) && dataArray[7].length>0) { 
						errClear = false;
						errIndex.push(8);						
					}

					
					if (!errClear) {
						//alert(errIndex);	
						for (var i=0;i<errIndex.length;i++) { 
							$("#errControl"+errIndex[i]).show(); 
						}
						return false;
					} else {
						return true;
					}
				}

				//---------Function to Display modal deleteButton---------
				function deleteClick(pointer, oTT, button, conf) {
				    var adata = oTT.rows({
				      selected: true
				    });

				    //console.log('adata', adata)
				    //console.log(adata.data()[0])
				    //console.log(adata.ids())

				    var data = "";
				    var myTable = pointer;
				    data += "<form name='deleteForm' role='form'>";
				    for (i in columnDefs) {
				      data += "<div class='form-group'><label for='" + columnDefs[i].title + "'>" + columnDefs[i].title + " : </label><input  type='hidden'  id='" + columnDefs[i].title + "' name='" + columnDefs[i].title + "' placeholder='" + columnDefs[i].title + "' style='overflow:hidden'  class='form-control' value='" + adata.data()[0][i] + "' >" + adata.data()[0][i] + "</input></div>";
				    }
				    data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      	$('#myModal').find('.modal-title').html('Eliminar Registro');
				     	$('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      	$('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='deleteRowBtn'>Eliminar</button>");
				    });

				    $('#myModal').modal('show');
				    $('#myModal input[0]').focus();
				};

				// delete row functionality
				$(document).on('click', '#deleteRowBtn', function() {
					// delete row function needs to go here
					console.log('Delete Row');
					$('#myModal').modal('hide');

					var adata = myTable.rows({
					  selected: true
					}).data()[0];
					console.log('data to delete : ', adata);

					clientAjaxRequest(adata[0],"delete");
				});

				//---------Function to Display modal editButton---------
				function editClick(pointer, oTT, button, conf) {

				    var adata = oTT.rows({
				      selected: true
				    });

				    //console.log('adata', adata)
				    //console.log(adata.data()[0])
				    //console.log(adata.ids())

				    var data = "";
				    var myTable = pointer;
				    data += "<form name='editForm' role='form'>";
					    for (i in columnDefs) {
					    	if (i==0) {
					    		data += "<div class='form-group'><label for='" + columnDefs[i].title + "'>" + columnDefs[i].title + ": "+ adata.data()[0][i] +"</label><br />";
					    	} else {
					    		data += "<div class='form-group'><label for='" + columnDefs[i].title + "'>" + columnDefs[i].title + ":</label>";
								switch (i) {
									case "1": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
									case "2": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
									case "3": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
									case "4": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
									case "5": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
									case "6": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
									case "7": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
									case "8": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
								}
					    		data += "<input type='text'  id='" + columnDefs[i].title + "' name='" + columnDefs[i].title + "' placeholder='" + columnDefs[i].title + "' style='overflow:hidden'  class='form-control' value='" + adata.data()[0][i] + "'></div>";
					    	}
					    }
				    data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      $('#myModal').find('.modal-title').html('Editar Registro');
				      $('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      $('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='editRowBtn'>Confirmar</button>");
				    });

				    $('#myModal').modal('show');
				    $('#myModal input[0]').focus();
				};

				// edit row functionality
				$(document).on('click', '#editRowBtn', function() {
				    // edit row function needs to go here
				    var elements = $(".form-control");
				    var dataArray = [];
				    for (var i=0;i<elements.length;i++) {
				    	dataArray.push(elements[i].value);
				    }

				    var dataId = myTable.rows({
				      selected: true
				    }).data()[0][0];

				    //Control de errores
				    if (clientErrorControl(dataArray)) {
				    	$('#myModal').modal('hide');
				    	clientAjaxRequest(dataId,"edit",dataArray);
				    }
				});

				//-----Function to Display modal for adding new items---
				function addClick (pointer, oTT, button, conf)  {
				    var i=0;
				    var data = "";
				    myTable = pointer;
				    data += "<form name='addForm' role='form'>";
				    for(i in columnDefs) {
				    	if(i!=0) {
							data += "<div class='form-group'>";
							data += "<label for='" + columnDefs[i].title + "'>" + columnDefs[i].title + ":</label>";
							switch (i) {
								case "1": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
								case "2": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
								case "3": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
								case "4": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
								case "5": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
								case "6": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
								case "7": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
								case "8": data += "<label class='clientErrorControl' id='errControl"+i+"'> * Valor erróneo para el campo "+columnDefs[i].title+" </label>";	break;
							} 
							data += "<input type='text'  id='" + columnDefs[i].title + "' name='" + columnDefs[i].title + "' placeholder='" + columnDefs[i].title + "' style='overflow:hidden'  class='form-control' value='' />";
							data += "</div>";   		
				    	}
					}
				    data += "</form>";

				    $('#myModal').on('show.bs.modal', function() {
				      	$('#myModal').find('.modal-title').html('Añadir Registro');
				     	$('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      	$('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='addRowBtn'>Añadir</button>");
				    });

				    $('#myModal').modal('show');     
				}

				// add row functionality
				$(document).on('click', '#addRowBtn', function() {
					// delete row function needs to go here
					//console.log('Add Row');

				    var elements = $(".form-control");
				    var dataArray = [];
				    for (var i=0;i<elements.length;i++) {
				    	dataArray.push(elements[i].value);
				    }

				    //Control de errores
				    if (clientErrorControl(dataArray)) {
				    	$('#myModal').modal('hide');
				    	clientAjaxRequest(null,"add",dataArray);
				    }
				});
			});