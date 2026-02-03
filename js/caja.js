			$(document).ready(function() {
				startTime(); 
				ajaxRequest("load",null);
				var tillFormValues = [];			

				$("#till_form").submit(function (ev) {
					ev.preventDefault();
					var current_value = $("#till_current_value").val();
					current_value = current_value.replace(",",".");
					current_value = parseFloat(current_value);
					var current_dateTime = $("#till_current_datetime").val();
					var current_real_datetime = $("#till_hidden_currentdatetime").val();
					var bankEntry = parseFloat($("#till_hidden_current_value").val()-current_value)+parseFloat($("#till_sales_card").val());
					if(bankEntry<0) bankEntry=0;
					var notes = $("#till_notes").val();

					if ((current_value.length == 0) || (!numValidation(current_value))) {
						//$("#currentValueErr").attr("style","display:inline-block;");	
						$("#currentValueErr").show();	
						//alert("Este campo debe ser un número entero o decimal.");
					} else {
						$("#currentValueErr").hide();
						var data = "";
						data += "<form name='modalForm' role='form'>";
						data += "<div class='form-group'><label>Valor de caja actual: </label> "+current_value+" €<br />";
						data += "<div class='form-group'><label>Fecha de registro: </label> "+current_dateTime+"<br />";
						data += "<div class='form-group'><label>Ingresado: </label> <input type='text' id='bankEntry' name='bankEntry' value='"+bankEntry+"' /> € <label id='bankEntryErr' class='till_error'>* Debe ser un número no negativo</label><br />";			
						var strOperator = notes.trim();
						if ( strOperator.length != 0) {
							data += "<div class='form-group'><label>Observaciones:</label><br />";
							data += "<div class='form-group'>"+notes+"</div>";	
						} 
						data += "</form>";

						$('#myModal').on('show.bs.modal', function() {
						    $('#myModal').find('.modal-title').html('Confirmar registro');
						    $('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
						    $('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='confirmButton'>Confirmar</button>");
						});

						$('#myModal').modal('show');
						$('#myModal input[0]').focus();		

						tillFormValues = [];
						tillFormValues.push(current_value);
						tillFormValues.push(current_real_datetime);
						tillFormValues.push(notes);
					}
				});

				$(document).on('click', '#confirmButton', function() {
					var bankEntry = $("#bankEntry").val();
					bankEntry = bankEntry.replace(",",".");
				    		
					if (numControl(bankEntry)) {
						$('#myModal').modal('hide');
						var dataArray = [];
						dataArray.push(tillFormValues[0]);
						dataArray.push(tillFormValues[1]);
						dataArray.push(tillFormValues[2]);
						dataArray.push(bankEntry);

						ajaxRequest("insert",dataArray);							
					} else {
						$("#bankEntryErr").show(1);
					}
				});	

				$(document).on('click', '#showLastMoves', function() {
					data = "<table cellpadding='0' cellspacing='0' border='0' class='dataTable table table-striped' id='tillbox_history'></table>";

				    $('#myModal').on('show.bs.modal', function() {
				      $('#myModal').find('.modal-title').html('Últimos movimientos ');
				      $('#myModal').find('.modal-body').html('<pre>' + data + '</pre>');
				      $('#myModal').find('.modal-footer').html("");
				    });

				    $('#myModal').modal('show');

					myTable = $('#tillbox_history').DataTable({
						    "sPaginationType": "full_numbers",
						    "ajax": {
						    	"url":"./ajax.script.caja.php",
						    	"dataType":"json",
						    	"data": {"action": "till_history"}
						    },
					       	columns: [
					       		{ title: "Id." },
					       		{ title: "Fecha" },
								{ title: "Valor en caja" },
								{ title: "Ingresado" },
								{ title: "Notas" }
						    ],					    
							"columnDefs": [
								{
					            "targets": [0],
					            "visible": false,
					            "searchable": false
					        	},
					        	{
								"targets":[1],
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
						    "language": {
						    	"url": "./datatables.spanish.txt"
						    },
						    dom: 'ftp',
						    responsive: true,
						    "initComplete": function(settings, json) {
						      $('#tillbox_history').DataTable()
						        .columns.adjust()
						        .responsive.recalc()
						    }
						}
					);
				});
			}); 
			
			function numControl(number) {
				if($.isNumeric(number) && number>=0) {
					return true;
				} else {
					return false;
				}
			}
			
			function ajaxRequest(action,data) {
				$.ajax({
					type: 'POST',				
					url: "./ajax.script.caja.php",
					cache: false,
					data: {
						"action":action,
						"data":data
					},
					dataType: 'json',
					error: function(XMLHttpRequest, errorType, errorThrown) {
						//Comentarlo para su salida en produccion
						alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nerrorType="+errorType+"\nerrorThrown="+errorThrown);
					},					
					success: function (fullJsonData) {
						requestedData = fullJsonData;
						console.log (fullJsonData);
						if (requestedData.request) {
							$("#till_last_value").val(requestedData.till_last_value+" €");
							$("#till_last_date").val(requestedData.till_last_date);
							$("#till_sales_value").val(requestedData.till_sales_value+" €");
							$("#till_sales_card").val(requestedData.till_sales_card+" €");
							$("#till_current_value").val("");
							$("#till_current_value").attr("placeholder",requestedData.till_current_value+" €");	
							$("#till_hidden_current_value").val(requestedData.till_current_value);
							$("#till_notes").val("");
							$(".till_error").attr("style","display:none;");	
						} 
					}
				});
			}

			function startTime() {
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

			    $("#till_current_datetime").val(D+"/"+M+"/"+Y+" - "+h+":"+m+":"+s);
			    $("#till_hidden_currentdatetime").val(Y+"-"+M+"-"+D+" "+h+":"+m+":"+s);

			    var t = setTimeout(startTime, 1000);
			}

			function checkTime(i) {
			    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
			    return i;
			}

			function numValidation (number) {
			  if (!/^([0-9])*[.,]?[0-9]*$/.test(number)) {
			  	return false;
			  } else {
			  	return true;
			  }
			}