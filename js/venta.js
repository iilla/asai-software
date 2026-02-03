
var dataArray = [];
var selecteproducts=[];
var selection = null;
productoAjaxRequest(null,"reload","");
clientAjaxRequest(null,"reload","");
//fatnumAjaxRequest(null,"loadNum","");
$(window).load(function() {
		
	$(document).on('click', '#nuevoCli', function() {
		addClick();
	});

	function addClick ()  {
		
		var columnDefs = [
					{ title: "Id" },
					{ title: "Nombre" },
					{ title: "NIF" },
					{ title: "Direccion" },
					{ title: "CP" },
					{ title: "Población" },
					{ title: "País" },
					{ title: "Teléfono" },
					{ title: "Email" },
					{ title: "Observaciones" }
				];
	    var i=0;
	    var data = "";
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


	$(document).on('click', '#addRowBtn', function() {
	    var elements = $(".form-control");
	    var dataArray = [];
	    for (var i=0;i<elements.length;i++) {
	    	dataArray.push(elements[i].value);
	    }

	   if (clientErrorControl(dataArray)) {
	    	$('#myModal').modal('hide');
	    	clientAjaxRequest(null,"add",dataArray);
	   }
	    
	});
	
	
$( ".pagosection" ).click(function() {
		//$( this ).slideUp();
		var total=0,baseimp=0;  
		/*console.log('selecteproducts');
		console.log(selecteproducts);*/

	    dataArray = [];
	    errorLog = "Se han encontrado los siguientes errores en el formulario de venta: <br />";
	    errorFound = false;
	    $(".sellingErrorControl").hide();

		for (var i=0;i<selecteproducts.length;i++) {
			dataArray.push({
				prodid : selecteproducts[i],
				cant : $('#cant'+selecteproducts[i]).val(),
				iva : $('#iva'+selecteproducts[i]).val(),
				precio : $('#precio'+selecteproducts[i]).val(),
				nombre : $('#nombre'+selecteproducts[i]).val()
			});

			baseimp=baseimp+(+$('#cant'+selecteproducts[i]).val()*+$('#precio'+selecteproducts[i]).val());
			total=total+(+finalPrice((parseFloat($('#cant'+selecteproducts[i]).val())*parseFloat($('#precio'+selecteproducts[i]).val())),(parseFloat($('#iva'+selecteproducts[i]).val()))));
			//total=total+(+$('#cant'+selecteproducts[i]).val()*+$('#precio'+selecteproducts[i]).val())+((+$('#cant'+selecteproducts[i]).val()*+$('#precio'+selecteproducts[i]).val())*+$('#iva'+selecteproducts[i]).val()/100);
			//console.log('baseimp: '+baseimp);

			sellingErrorControl(dataArray[dataArray.length-1],"producto");		
		}

		// !!! CANTIDAD DE ENVÍO (LOL)
		if ($('#cantenvio').val()!="0")
		{
			dataArray.push({
				cantenvio : $('#cantenvio').val(),
				iva : $('#ivaenvio').val()

			});

			baseimp=baseimp+(+$('#cantenvio').val());
			total=total+(+finalPrice(parseFloat($('#cantenvio').val()),parseFloat($('#ivaenvio').val())));
			//total=total+(+$('#cantenvio').val())+(+$('#cantenvio').val()*+$('#ivaenvio').val()/100);
			//console.log('baseimp: '+baseimp);	

			sellingErrorControl(dataArray[dataArray.length-1],"envio");			
		}

		if ($('#cantextras').val()!="0")
		{
			dataArray.push({
				extras : $('#cantextras').val(),
				iva : $('#ivaextras').val()
			});

			baseimp=baseimp+(+$('#cantextras').val());
			total=total+(+finalPrice(parseFloat($('#cantextras').val()),parseFloat($('#ivaextras').val())));
			//total=total+(+$('#cantextras').val())+(+$('#cantextras').val()*+$('#ivaextras').val()/100);
			//console.log('baseimp: '+baseimp);

			sellingErrorControl(dataArray[dataArray.length-1],"extras");
		}
		//if ($("input[name=radio-extra]:checked","#filter-form").val()=="earnings") {
		if ($("input[name=discountType]:checked","#frmventa").val()=="porcentaje") {
			if($('#descpercent').val()!="0")
			{
				dataArray.push({	
					descuento : $('#descpercent').val(),
					tipo : "porcentaje"
				});

				baseimp=baseimp-(baseimp*+$('#descpercent').val()/100);
				total=total-(total*$('#descpercent').val()/100);

				sellingErrorControl(dataArray[dataArray.length-1],"descuento");
			}
		} else {
			if($('#desceuros').val()!="0")
			{
				dataArray.push({	
					descuento : $('#desceuros').val(),
					tipo : "euros"
				});

				baseimp=baseimp-($('#desceuros').val());
				total=total-($('#desceuros').val());

				sellingErrorControl(dataArray[dataArray.length-1],"descuento");
			}
		}

		dataArray.push({
			recinto: $("#recinto option:selected").val()
		});

		dataArray.push({	
		 	total : parseFloat(total).toFixed(2),
			baseimp : parseFloat(baseimp).toFixed(2)
		});
		//console.log(dataArray);
		selection=$(this).find("div");

		//Fabricar datos de modal para ventana de confirmación de venta	
		var data = "";
		var confirm = false;
		data += "<form name='sellConfirmation' role='form'>";
		data += "<div class='form-group'>";
		data += "<label for='Seller'>Vendedor:</label> "+logedUser+"<br />";
		data += "<label for='Client'>Cliente: </label>"+$("#clientlist :selected").text()+"<br />";
		data += "<label for='Payment'>Pago: </label>"+selection.attr("id")+"<br />";

		if($("#comercial").val().length>0) {

			dataArray.push({	
				comercial: $('#comercial').val()
			});	

			sellingErrorControl(dataArray[dataArray.length-1],"comercial");

			data += "<label for='Comercial'>Comercial: </label>"+$('#comercial').val()+"<br />";

		}

		data += "<label for='Compound'>Recinto: </label>"+$("#recinto :selected").text();
		data += "</div>";
		data += "<table class='form-group' border=0 width='85%'>";
		data += "<tr><th>Producto</th><th>Cantidad</th><th>Total</th></tr>";
		for (i in dataArray) {
			var currentData = dataArray[i];
			if ('prodid' in currentData) {
				confirm = true;
				var totalAmount = finalPrice(parseFloat(currentData['precio']*currentData['cant']),parseFloat(currentData['iva']));
				data += "<tr><td>"+currentData['nombre']+"</td><td>"+currentData['cant']+"</td><td>"+totalAmount+" €</td></tr>";	
			} else if ('cantenvio' in currentData) {
				var totalAmount = finalPrice(parseFloat(currentData['cantenvio']),parseFloat(currentData['iva']));
				data += "<tr><td>Envío</td><td></td><td>"+totalAmount+" €</td></tr>";
			} else if ('extras' in currentData) {
				var totalAmount = finalPrice(parseFloat(currentData['extras']),parseFloat(currentData['iva']));
				data += "<tr><td>Extras</td><td></td><td>"+totalAmount+" €</td></tr>";	
			} else if ('descuento' in currentData) {
				if (currentData['tipo']=='porcentaje') {
					data += "<tr><td>Descuento</td><td></td><td>"+currentData['descuento']+" %</td></tr>";
				} else {
					data += "<tr><td>Descuento</td><td></td><td>"+currentData['descuento']+" €</td></tr>";
				}
			} else if(!('recinto' in currentData) && !('comercial' in currentData)) {
				data += "<tr><td colspan='3'><hr/></td></tr>";
				data += "<tr><td>Importe Base:</td><td></td><td>"+currentData['baseimp']+" €</td></tr>";
				data += "<tr><td>Importe Total:</td><td></td><td>"+currentData['total']+" €</td></tr>";
			}
		}
		data += "</table></form>";

		$('#myModal').on('show.bs.modal', function() {
			$('#myModal').find('.modal-title').html('Confirmar Venta');
			if (confirm) {
				if (!errorFound) {
					$('#myModal').find('.modal-body').html('<pre>'+data+'</pre>');
					$('#myModal').find('.modal-footer').html("<button type='button' class='btn btn-primary' id='SellConfirm'>Confirmar</button>");
				} else {
					$('#myModal').find('.modal-body').html('<pre>'+errorLog+'</pre>');
					$('#myModal').find('.modal-footer').html("");
				}
			} else {
				$('#myModal').find('.modal-body').html('<center>¡No has seleccionado ningún producto!</center>');
				$('#myModal').find('.modal-footer').html("<button type='button' class='btn btn-primary' id='CancelButton'>Cerrar</button>");
			}
		});

		$('#myModal').modal('show');

		function sellingErrorControl(dataArray,lot) {
			var localErrCheck = false;
			switch(lot) {
				case "producto": {
					if (!isNatural(dataArray["cant"])) {
						localErrCheck = true;
						errorLog += "- La cantidad de producto "+dataArray["nombre"]+" es incorrecta. <br>";
					}
					if (!isPercentage(dataArray["iva"])) {
						localErrCheck = true;
						errorLog += "- El IVA de producto "+dataArray["nombre"]+" es incorrecto. <br>";
					}
					if (!isNumeric(dataArray["precio"])) {
						localErrCheck = true;
						errorLog += "- El precio de producto "+dataArray["nombre"]+" es erróneo. <br>";
					}
					if (localErrCheck) {
						errorFound = true;
						$("#errControlProd"+dataArray["prodid"]).show(); 
					}
					break;
				}
				case "envio": {
					if (!isPercentage(dataArray["cantenvio"])) {
						localErrCheck = true;
						errorLog += "- El precio de envío es incorrecto. <br>";
					}
					if (!isPercentage(dataArray["iva"])) {
						localErrCheck = true;
						errorLog += "- El IVA del envío es incorrecto. <br>";
					}		
					if (localErrCheck) {
						errorFound = true;
						$("#errControlEnvio").show(); 
					}			
					break;
				}
				case "extras": {
					if (!isPercentage(dataArray["extras"])) {
						localErrCheck = true;
						errorLog += "- El precio de los extras es incorrecto. <br>";
					}
					if (!isPercentage(dataArray["iva"])) {
						localErrCheck = true;
						errorLog += "- El IVA de los extras es incorrecto. <br>";
					}
					if (localErrCheck) {
						errorFound = true;
						$("#errControlExtra").show(); 
					}
					break;
				}
				case "descuento": {
					if (dataArray["tipo"]=="porcentaje") {
						if (!isPercentage(dataArray["descuento"])) {
							localErrCheck = true;
							errorLog += "- El porcentaje de descuento es erróneo. <br>";
						}
					} else {
						if (!isNumeric(dataArray["descuento"])) {
							localErrCheck = true;
							errorLog += "- El descuento en euros es incorrecto. <br>";
						}
					}
					if (localErrCheck) {
						errorFound = true;
						$("#errControlDiscount").show(); 
					}
					break;
				}
				case "comercial": {
					if (!isName(dataArray["comercial"])) {
						localErrCheck = true;
						errorLog += "- El nombre de comercial debe tener al menos tres carácteres. <br>";
					}
					if (localErrCheck) {
						errorFound = true;
						$("#errControlComercial").show(); 
					}					
					break;
				}
			}
		}
});

//Natural
function isNatural(number) {
	if(Math.floor(number) == number && $.isNumeric(number) && number>=0) {
		return true;
	} else {
		return false;
	}
}

//Porcentaje
function isPercentage(number) {
	if(Math.floor(number) == number && $.isNumeric(number) && (number>=0 && number<=100)) {
		return true;
	} else {
		return false;
	}
}

//Precio
function isNumeric(number) {
	if (!/^([0-9])*[.,]?[0-9]*$/.test(number)) {
		return false;
	} else {
		return true;
	}
}

//Nombre
function isName(name) {
	if (dataArray[0].length<3) {
		return false;
	} else {
		return true;
	}
}

$(document).on('change', '.radioDiscount', function() {
	    switch($(this).val()) {
	        case 'euros' : {
	        	$("#descpercent").attr("class","inactiveDiscount");
				$("#desceuros").removeAttr("class");
				$("#desceuros").removeAttr("disabled");
	        	break;
	        }
	        case 'porcentaje' : {
				$("#desceuros").attr("class","inactiveDiscount");
				$("#descpercent").removeAttr("class");     	
				$("#descpercent").removeAttr("disabled");
	        	break;
	        }    
	    }
	    $(".inactiveDiscount").attr("disabled", "disabled");

});		

$(document).on('click', '#SellConfirm', function() {
	$('#myModal').find('.modal-title').html("");
	$('#myModal').find('.modal-body').html("");
	$('#myModal').find('.modal-footer').html("");	
	$('#myModal').modal('hide');
	//console.log(dataArray);
	ventaAjaxRequest($("#clientlist").val(),selection.attr("id"),dataArray);
});	

$(document).on('click', '#CancelButton', function() {
	$('#myModal').find('.modal-title').html("");
	$('#myModal').find('.modal-body').html("");
	$('#myModal').find('.modal-footer').html("");	
	$('#myModal').modal('hide');
});	

function finalPrice(number,percentage) {
	number = (number+(number*percentage/100));
	return noRoundFloat(number);
}

function noRoundFloat(number) {
	number = Math.floor(number * 100) / 100;
	return number.toFixed(2);
}

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
});//window load end

function productoAjaxRequest(id,action,data) {

	$.ajax({
		data:{"id":id,"action":action,"dataset":data},
	  	dataType:"json",
	  	url: "./ajax.script.productos.php",
	  	error: function(XMLHttpRequest, errorType, errorThrown) {
			//Comentarlo para su salida en produccion
			alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
		},
	  	success: function (result) {
	  		//console.log(result);	
	  		//myTable.ajax.reload(null, false);
		  		$('#mySelect')
			    .find('option')
			    .remove()
			    .end();
		  		for (var i = 0; i < result.length; i++)
					{
					    //$('#productoscont').append('<option value='+result[i][0]+' >'+result[i][1]+'</option>');
					    $('#productoscont').append( "<div class='prodsection'><div id='errControlProd"+result[i][0]+"' class='sellingErrorControl' style='position:absolute; right: 5px; top: 0px;color:red; font-size: 50px'>*</div><img id='producto" + result[i][0] + "' src='./img/producto" + result[i][0] +
					    ".jpg'/> Cant.: <input type='text' value='1' id='cant" + result[i][0] + "' size='3'/> IVA:<input type='text' value='"+ result[i][2] + 
					    "' id='iva" + result[i][0] + "'  maxlength='3' size='1'/> Precio: <input type='text' value='"+ result[i][3] + "' id='precio" + result[i][0] + 
					    "' size='3'/> <input type='text' value='"+ result[i][1] + "' id='nombre" + result[i][0] + 
					    "' size='1' style='display:none;'/><prodid index="+ result[i][0] +" /></div>");										  
					}

				$(".prodsection").click(function() {
					var idSelected =$(this).find("prodid");
					idSelected = idSelected.attr("index");
					var imgSelected =$(this).find("img");
					var innerIndex = jQuery.inArray(idSelected,selecteproducts);

					if(innerIndex != -1) {
						imgSelected.attr('src',"./img/producto"+idSelected+".jpg");
						selecteproducts.splice(innerIndex,1);
					} else {
						imgSelected.attr('src',"./img/producto"+idSelected+"2.jpg");
						selecteproducts.push(idSelected);
					}

					//console.log(selecteproducts);
					//sacar producto*/
					/* 
					if (selection.attr('src').substr(14,1)=='2') {
						selection.attr('src',selection.attr('src').substr(0,14)+".jpg");
						selecteproducts=	jQuery.grep(selecteproducts, function(value) {
							return value != selection.attr('id').substr(8,1);
						});
					} else {
					//meter producto
						selection.attr('src',"./img/producto"+selection.attr('id').substr(8,1)+"2.jpg");
						selecteproducts.push(selection.attr('id').substr(8,1));
					}
					*/
				});
		}
	});
		return 0;
}

function clientAjaxRequest(id,action,data) {
	$.ajax({
		data:{"id":id,"action":action,"dataset":data},
	  	dataType:"json",
	  	url: "./ajax.script.clientes.php",
	  	error: function(XMLHttpRequest, errorType, errorThrown){
			//Comentarlo para su salida en produccion
			alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
		},
	  	success: function (result) {
	  		//console.log(result);	
	  		//myTable.ajax.reload(null, false);
	  		/*
		  		$('#clientlist')
			    .find('option')
			    .remove()
			    .end();
			*/
			$('#clientlist').empty();
			//console.log(result);
		  		for (var i = 0; i < result.length; i++) {
					if (i!=(result.length-1)) {
						$('#clientlist').append('<option value='+result[i][0]+'>'+result[i][1]+'</option>');								  	
					} else {
						if (action!="add") {
							$('#clientlist').append('<option value='+result[i][0]+'>'+result[i][1]+'</option>');
						} else {
							$('#clientlist').append('<option value='+result[i][0]+' selected>'+result[i][1]+'</option>');
						}
							
					}	
				}
		}
	});
	return 0;
}
	
function ventaAjaxRequest(id,action,data) {
		$.ajax({
			data:{ 	"id":id,
					"action":action,
					"dataset":data,
					"usuario":logedUser
			},//$_SESSION['usr']},
		  	dataType:"text",
		  	url: "./ajax.script.venta.php",
		  	error: function(XMLHttpRequest, errorType, errorThrown){
				//Comentarlo para su salida en produccion
				alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
			},
		  	success: function (result) {
		  		console.log(result);

		  		 
				var link = document.createElement('a');
				window.open(result);

                //console.warn(result.responseText);
				//console.log(result);
				//link.href=window.URL.createObjectURL(result);
				//link.download=result;
				//link.click();

			}
		});
		return 0;
}

/*
function fatnumAjaxRequest(id,action,data) {
	var idfact=0;
		$.ajax({
			data:{"id":id,"action":action,"dataset":data,"usuario":logedUser},//$_SESSION['usr']},
		  	dataType:"text",
		  	url: "./ajax.script.Idfact.php",
		  	error: function(XMLHttpRequest, errorType, errorThrown){
				//Comentarlo para su salida en produccion
				alert("XMLHttpRequest="+XMLHttpRequest.responseText+"\nque paso="+errorType+"\nerrorThrown="+errorThrown);
			},
		  	success: function (result) {
		  		idfact=result.toString().replace('[[','').replace(']]','');
		  		for (var i = 0; i < result.length; i++) {
						if (i!=(result.length-1)) {
						$('#nextfactid').val(idfact);	
						//console.log(result);						  	
					}
				}
			}
		});
		return idfact;
}
*/