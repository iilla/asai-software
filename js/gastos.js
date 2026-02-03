$(document).ready(function() {
				var columnDefs = [
					{ title: "Id." },
					{ title: "Concepto" },
					{ title: "Base Imponible" },
					{ title: "IVA" },
					{ title: "Total" },
					{ title: "Fecha" }
				];

				var myTable;

				/*myTable = $('#example').DataTable({
					"ajax": "./ajax.script.php"
				});*/

				//This creates the table with all buttons and specifications
				myTable = $('#example').DataTable({
					    "sPaginationType": "full_numbers",
					    "ajax": {
					    	"url":"./ajax.script.gastos.php",
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
				            },
					        {
								"targets":[5],
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
					    }],
					    "initComplete": function(settings, json) {
					      $('#example').DataTable()
					        .columns.adjust()
					        .responsive.recalc()
					    }
					}
				);

				function gastosAjaxRequest(id,action,data) {
					$.ajax({
						data:{"id":id,"action":action,"dataset":data},
					  	dataType:"text",
					  	url: "./ajax.script.gastos.php",
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

				function checkTime(i) {
				    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
				    return i;
				}
				
				function gastosErrorControl(dataArray) {
					var errClear = true;
					var errIndex = [];
					$(".gastosErrorControl").hide();
					//alert(dataArray[0]+" "+dataArray[0].length);
					
					console.log(dataArray[0].length);
					
					//concepto
					if (dataArray[0].length<3) { 
						errClear = false;
						errIndex.push(1);
					} 				
					//baseimp	
					 if ((!dataArray[1].match(/^([0-9])*[.,]?[0-9]*$/i))|| dataArray[1].length==0) {
				  		errClear = false;
						errIndex.push(2);
				  	}
				  	//iva
				  	if ((!dataArray[2].match(/^([0-9])*$/i)) || dataArray[2].length==0) {
				  		errClear = false;
						errIndex.push(3);
				  	}
				  	//total
				  	if ((!dataArray[3].match(/^([0-9])*[.,]?[0-9]*$/i)) || dataArray[3].length==0) {
				  		errClear = false;
						errIndex.push(4);
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

					gastosAjaxRequest(adata[0],"delete");
				});

				//-----Function to Display modal for adding new items---
				function addClick (pointer, oTT, button, conf)  {
				    var i=0;
				    var data = "";
				    myTable = pointer;
				    data += "<form name='addForm' role='form'>";
				    for(i in columnDefs) {
				    	if(i!=0 && i!=5) {
							data += "<div class='form-group'>";
							data += "<label for='" + columnDefs[i].title + "'>" + columnDefs[i].title + ":</label>";
							switch (i) {
								case "1": data += "<label class='gastosErrorControl' id='errControl"+i+"'> * Requiere al menos tres carácteres </label>";break;
								case "2": data += "<label class='gastosErrorControl' id='errControl"+i+"'> * Requiere un número entero o decimal </label>";	break;
								case "3": data += "<label class='gastosErrorControl' id='errControl"+i+"'> * Requiere un número entero </label>";	break;
								case "4": data += "<label class='gastosErrorControl' id='errControl"+i+"'> * Requiere un número entero o decimal </label>";	break;
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

					dataArray[1] = dataArray[1].replace(",",".");
					dataArray[3] = dataArray[3].replace(",",".");
					
				    //Control de errores
				    if (gastosErrorControl(dataArray)) {
				    	$('#myModal').modal('hide');
				    	gastosAjaxRequest(null,"add",dataArray);
				    }
				});
			});