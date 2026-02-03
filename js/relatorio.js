	function isInt(number) {
		if(Math.floor(number) == number && $.isNumeric(number) && number>=0) {
			return true;
		} else {
			return false;
		}
	}

	$(document).ready(function() {
		var mailSubject = "";
		var mailBody = "";

		function outputGenerator() {
			var outPutType = "";
			var dataFilters = [];
			//Construimos el objeto con los filtros
			if ($("input[name=radio-extra]:checked","#filter-form").val()=="earnings") {
				//Filtrado para ingresos
				dataFilters = ({
					dateFilterDay: $("#filter-date-day").val(),
					dateFilterMonth: $("#filter-date-month").val(),
					dateFilterYear: $("#filter-date-year").val(),
					extraFiltermetododepago: $("#filter-extra-metododepago").val(),
					extraFiltertipodeventa: $("#filter-extra-tipodeventa").val(),
					extraFilterusuario: $("#filter-extra-usuario").val(),
					extraFilteridcliente: $("#filter-extra-idcliente").val()
				});
				outPutType = "earnings";
			} else {
				//Filtrado para beneficios
				var dataFilters = ({
					dateFilterDay: $("#filter-date-day").val(),
					dateFilterMonth: $("#filter-date-month").val(),
					dateFilterYear: $("#filter-date-year").val()
				});
				outPutType = "benefits";
			}

			//console.log(outPutType);
			//Recopilamos y enviamos los datos del filtro por ajax. En función de la respuesta generamos una tabla 
			$.ajax({
				data:{ "action":outPutType, "dataset":dataFilters },
				dataType:"json",
				url: "./ajax.script.relatorio.php",
				error: function(XMLHttpRequest, errorType, errorThrown) {
					//Comentarlo para su salida en produccion
					alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
				},
				success: function (result) {
					//console.log(result[3]);

					mailSubject = "";
					mailBody = "";					
					var monthRelation = { 
						01: 'Enero',
						02: 'Febrero',
						03: 'Marzo',
						04: 'Abril',
						05: 'Mayo',
						06: 'Junio',
						07: 'Julio',
						08: 'Agosto',
						09: 'Septiembre',
						10: 'Octubre',
						11: 'Noviembre',
						12: 'Diciembre' 
					};

					//Fabricar el output en función de los datos extraídos
					var dataInfo = "<table id='relatorio-output-filters' class='table table-striped'>";
					var dateExpression = "";
					for (i in result[0]) {
						switch (i) {
							case "dateFilterDay": { dateExpression += result[0][i]+" de"; break; }
							case "dateFilterMonth": { dateExpression += " "+monthRelation[parseInt(result[0][i])]+" de"; break; }
							case "dateFilterYear": {
								if (dateExpression!="") {
									dateExpression += " "+result[0][i]; 
								} else {
									dateExpression += "Año "+result[0][i]; 
								}
								dataInfo += "<tr><th>Periodo de estudio: </th><td>"+dateExpression+"</td></tr>";
								break; 
							}
							case "extraFilteridcliente": {
								dataInfo += "<tr><th>Cliente: </th><td>";
								dataInfo += $("select[name=filter-extra-idcliente] option[value='"+result[0][i]+"']").text()+"</td></tr>";
								break; 
							}
							case "extraFilterusuario": {dataInfo += "<tr><th>Vendedor: </th><td>"+result[0][i]+"</td></tr>";break;}
							case "extraFiltermetododepago": {dataInfo += "<tr><th>Pago: </th><td>"+result[0][i]+"</td></tr>";break;}
							case "extraFiltertipodeventa": {dataInfo += "<tr><th>Venta: </th><td>"+result[0][i]+"</td></tr>";break;}
						}
					}
					dataInfo += "</table>";

					//Output de totales
					var dataTotals = "<table id='relatorio-output-totals' class='table table-striped'>";
					dataTotals += "<tr class='outputRow-titles'><th>Tipo de Venta</th><th>Total Base</th><th>Total IVA</th><th>Total</th></tr>";
					var emptyTotals = true;
					var absoluteEarningTotal = 0;
					var baseEarningTotal = 0;
					var ivaEarningTotal = 0;
					for (i in result[1]) {
						//var resultKeys = Object.keys(result[1]);
						dataTotals += "<tr class='outputRow-common'>";
						for (j in result[1][i]) {
							if (j!="venta") {
								dataTotals += "<td>"+result[1][i][j].toString().replace(".",",")+" €</td>";
							} else if (j=="porcentaje") {
								dataTotals += "<td>"+result[1][i][j]+" %</td>";
							} else {
								dataTotals += "<td>"+result[1][i][j]+"</td>";
							}
							if ((result[1][i]['venta']!="cortesía en tienda") && (result[1][i]['venta']!="cortesía envío")) {
								if (j=="total") { absoluteEarningTotal += result[1][i][j]; }
								if (j=="totalbase") { baseEarningTotal += result[1][i][j]; }
								if (j=="totaliva") { ivaEarningTotal += result[1][i][j]; }
							}
							emptyTotals = false;
							//console.log(j+" "+result[1][i][j]);
						}
						dataTotals += "</tr>";
					}
					if (!emptyTotals) {
						dataTotals += "<tr class='outputRow-totals'><th>Total Ventas:</th><td></td><td></td><th>"+absoluteEarningTotal.toFixed(2).toString().replace(".",",")+" €</th></tr>";
					 	dataTotals += "</table>";
					} else {
						dataTotals = "No hay ventas con esas especificaciones"; 
					}
					
					//Tabla de productos o gastos, en función de la acción
					if (outPutType == "earnings") {
						//Tabla de productos
						var dataProducts = "<table id='relatorio-output-products' class='table table-striped'>";
						var tinyTable = false;
						dataProducts += "<tr class='outputRow-titles'><th>Nombre</th>";
						if (dataFilters['extraFiltermetododepago']=="cortesía") {
							dataProducts += "<th>Uds.Cortesía</th>";
							tinyTable = true;
						} else {
							if (dataFilters['extraFiltermetododepago']=="0") {
								dataProducts += "<th>Uds.Vendidas</th><th>Uds.Cortesía</th>";
							} else {
								dataProducts += "<th>Uds.Vendidas</th>";
								tinyTable = true;
							}
						}
						dataProducts += "<th>Base Total</th><th>IVA Total</th><th>Total</th></tr>";
						var emptyProducts = true;
						var totalProducts = 0;
						for (i in result[2]) {
							//var resultKeys = Object.keys(result[1]);
							dataProducts += "<tr class='outputRow-common'>";
							for (j in result[2][i]) {
								if (!tinyTable) {
									if (j != "ivaextras") {
										if (j!="nombre" && j!="unidades" && j!="cortesia") {
											dataProducts += "<td>"+result[2][i][j].toString().replace(".",",")+" €</td>";
											if (j=="total") { totalProducts += result[2][i][j]; }
										} else {
											dataProducts += "<td>"+result[2][i][j]+"</td>";
										}
									}
								} else {
									if (j != "ivaextras" && j != "cortesia") {
										if (j!="nombre" && j!="unidades" && j!="cortesia") {
											dataProducts += "<td>"+result[2][i][j].toString().replace(".",",")+" €</td>";
											if (j=="total") { totalProducts += result[2][i][j]; }
										} else {
											dataProducts += "<td>"+result[2][i][j]+"</td>";
										}
									}								
								}
								emptyProducts = false;
								//console.log(j+" "+result[1][i][j]);
							}
							dataProducts += "</tr>";
						}
						if (!emptyProducts) {
							dataProducts += "<tr class='outputRow-totals'><th>Total Ventas:</th>";
							if(tinyTable) {
								dataProducts += "<td></td><td></td><td></td>";
							} else {
								dataProducts += "<td></td><td></td><td></td><td></td>";
							}
						 	dataProducts += "<th>"+totalProducts.toFixed(2).toString().replace(".",",")+" €</th></tr></table>";
						} else { 
							dataProducts = "No se vendieron productos con esas especificaciones"; 
						}	

						//Fabricamos el cuerpo del Output y el del mail
						$("#relatorio-output-title").html("<h2>Ingresos</h2>");
						$("#relatorio-output-filters").html("<h3>Especificaciones</h3>"+dataInfo);
						$("#relatorio-output-totals").empty();
						$("#relatorio-output-firstTable").html("<h3>Ventas</h3>"+dataTotals);
						$("#relatorio-output-secondTable").html("<h3>Productos</h3>"+dataProducts);	

						//Fabricamos el cuerpo del mail
						mailSubject = "Informe de ingresos Casa do Açaí. "+dateExpression;
						mailBody +=  "<h2>Ingresos Casa do Açaí</h2><h3>Especificaciones</h3>"+dataInfo+"<h3>Totales de Ventas</h3>"+dataTotals+"<h3>Totales de productos</h3>"+dataProducts;

					} else {

						//Tabla de gastos
						var dataExpenses = "<table id='relatorio-output-expenses' class='table table-striped'>";
						var absoluteExpenseTotal = 0;
						var baseExpenseTotal = 0;
						var ivaExpenseTotal = 0;
						var emptyExpenses = true;
						dataExpenses += "<tr class='outputRow-titles'><th>Concepto (IVA)</th><th>Gasto Base</th><th>Gasto IVA</th><th>Gasto Total</th></tr>";
						for (i in result[2]) {
							//var resultKeys = Object.keys(result[1]);
							dataExpenses += "<tr class='outputRow-common'>";
							for (j in result[2][i]) {
								if (j!="concepto" && j!="iva") {
									dataExpenses += "<td>"+result[2][i][j].toString().replace(".",",")+" €</td>";
								} else {
									if (j=="concepto") {
										dataExpenses += "<td>"+result[2][i][j];
									} else {
										dataExpenses += " ("+result[2][i][j]+" %)</td>";
									}
								}
								if (j=="total") { absoluteExpenseTotal -= result[2][i][j] }
								if (j=="base") { baseExpenseTotal -= result[2][i][j] }
								if (j=="gastoiva") { ivaExpenseTotal -= result[2][i][j] }
								emptyExpenses = false;
								//console.log(j+" "+result[1][i][j]);
							}
							dataExpenses += "</tr>";
						}
						if (!emptyExpenses) {
							dataExpenses += "<tr class='outputRow-totals'><th>Total Gastos:</th><td></td><td><th>"+absoluteExpenseTotal.toFixed(2).toString().replace(".",",")+" €</th></tr>";
						 	dataExpenses += "</table>";
						} else {
							dataExpenses = "No hay gastos con esas especificaciones"; 
						}

						absoluteExpenseTotal = absoluteExpenseTotal.toFixed(2);
						baseExpenseTotal = baseExpenseTotal.toFixed(2);
						ivaExpenseTotal = ivaExpenseTotal.toFixed(2);
						absoluteEarningTotal = absoluteEarningTotal.toFixed(2);
						baseEarningTotal = baseEarningTotal.toFixed(2);
						ivaEarningTotal = ivaEarningTotal.toFixed(2);

						//Tabla de beneficios totales
						var dataBenefits = "<table id='relatorio-output-benefits' class='table table-striped'>";
						dataBenefits += "<tr class='outputRow-titles'><th></th><th>Total Base</th><th>Total IVA</th><th>Total</th></tr>";
						dataBenefits += "<tr class='outputRow-common'><td>Ingresos:</td><td>"+baseEarningTotal.toString().replace(".",",")+" €</td><td>"+ivaEarningTotal.toString().replace(".",",")+" €</td><td>"+absoluteEarningTotal.toString().replace(".",",")+" €</td></tr>";
						dataBenefits += "<tr class='outputRow-common'><td>Gastos:</td><td>"+baseExpenseTotal.toString().replace(".",",")+" €</td><td>"+ivaExpenseTotal.toString().replace(".",",")+" €</td><td>"+absoluteExpenseTotal.toString().replace(".",",")+" €</td></tr>";
						dataBenefits += "<tr class='outputRow-totals'><th>Totales:</th>";
						dataBenefits += "<td>"+(parseFloat(baseEarningTotal)+parseFloat(baseExpenseTotal)).toFixed(2).toString().replace(".",",")+" €</td>";
						dataBenefits += "<td>"+(parseFloat(ivaEarningTotal)+parseFloat(ivaExpenseTotal)).toFixed(2).toString().replace(".",",")+" €</td>";
						dataBenefits += "<td>"+(parseFloat(absoluteEarningTotal)+parseFloat(absoluteExpenseTotal)).toFixed(2).toString().replace(".",",")+" €</td>";

						//Fabricamos el cuerpo del Output
						$("#relatorio-output-title").html("<h2>Beneficios</h2>");
						$("#relatorio-output-filters").html("<h3>Especificaciones</h3>"+dataInfo);
						$("#relatorio-output-totals").html("<h3>Totales</h3>"+dataBenefits);
						$("#relatorio-output-firstTable").html("<h3>Ventas</h3>"+dataTotals);
						$("#relatorio-output-secondTable").html("<h3>Gastos</h3>"+dataExpenses);

						//Fabricamos el cuerpo del mail
						mailSubject = "Informe de beneficios Casa do Açaí. "+dateExpression;
						mailBody = "<h2>Beneficios Casa do Açaí</h2><h3>Especificaciones</h3>"+dataInfo+"<h3>Beneficios</h3>"+dataBenefits;
					}

					$("#sendmail-submit").removeAttr("disabled");
				}
			});
		}

		refillDateDay($("#filter-date-month").val(),true);
		outputGenerator();

		$(document).on('change', '#filter-date-month', function() {
			refillDateDay($("#filter-date-month").val(),false);
		});

		$(document).on('change', '#filter-date-year', function() {
			refillDateDay($("#filter-date-month").val(),false);
		});

		$(document).on('change', '#filter-extra-idcliente', function() {
			if ($("#filter-extra-metododepago").val()!="pendiente") {
				if ($(this).val()==1) {
					$("#filter-extra-tipodeventa").val("en tienda");
					$("#filter-extra-tipodeventa").attr("disabled","");
				} else {
					$("#filter-extra-tipodeventa").removeAttr("disabled");
				}
			}
		});

		$(document).on('change', '#filter-extra-metododepago', function() {
			if ($(this).val()=="pendiente") {
				$("#filter-extra-tipodeventa").val(0);
				$("#filter-extra-tipodeventa").attr("disabled","");
			} else {
				if ($("#filter-extra-idcliente").val()!=1) {
					$("#filter-extra-tipodeventa").removeAttr("disabled");
				} else {
					$("#filter-extra-tipodeventa").val("en tienda");
				}
			}			
		});

		$(document).on('click', '#filter-submit', function() {
			outputGenerator();
		});

		$(document).on('click', '#sendmail-submit', function() {
			var data = "";
            data += "<div class='form-group'>";
            data += "<label for='subject'>Asunto: </label><label class='clientErrorControl' id='errorSubject'> * Requiere al menos tres carácteres </label></br>";
            data += "<input id='subject' type='text' class='form-control' value='"+mailSubject+"' placeholder='Asunto'/> <br />";
            data += "<label for='receiver'>Destinatario: </label><label class='clientErrorControl' id='errorMail'> * Valor vacío o erróneo para el campo email </label>";
            data += "<input id='receiver' type='text' class='form-control' value='' placeholder='Destinatario'/>";
            data += "</div>";

			$('#myModal').on('show.bs.modal', function() {
				$('#myModal').find('.modal-title').html('Enviar Informe');
				$('#myModal').find('.modal-body').html('<pre>'+data+'</pre>');
				$('#myModal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-primary' id='confirmReport'>Enviar mail</button>");
			});

			$('#myModal').modal('show');
		});

		$(document).on('click', '#confirmReport', function() {
			//Control de errores
			//console.log($("#subject").val().length+" "+);
			var errClear = true;
			if ($("#subject").val().length<3) { 
				$("#errorSubject").show();
				var errClear = false;
			} 			
			if (!$("#receiver").val().match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i) || $("#receiver").val().length==0) { 
				$("#errorMail").show();
				var errClear = false;
			}
			if (errClear) {
				$("#errorSubject").hide();
				$("#errorMail").hide();
				//$('#myModal').modal('hide');
				$.ajax({
					data:{"action":"report","mailBody":mailBody,"mailSubject":$("#subject").val(),"mailTo":$("#receiver").val()},
					dataType:"json",
					url: "./ajax.script.relatorio.php",
					error: function(XMLHttpRequest, errorType, errorThrown) {
						alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
					},
					success: function (result) { 
						$('#myModal').find('.modal-title').html('Enviar Informe');
						$('#myModal').find('.modal-body').html('<center>'+result+'</center>');
						$('#myModal').find('.modal-footer').html("<button type='button' class='btn btn-primary' id='CancelButton'>Cerrar</button>");
					}
				});
			}
		});

		$(document).on('click', '#CancelButton', function() {
			$('#myModal').find('.modal-title').html("");
			$('#myModal').find('.modal-body').html("");
			$('#myModal').find('.modal-footer').html("");	
			$('#myModal').modal('hide');
		});	
	});