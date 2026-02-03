<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');
  require('./fpdf.php');
  
  class PDF extends FPDF
	{
		function Header()
		{
		    global $title;
		
		    // Arial bold 15
		    $this->SetFont('Times','I',15);
		    // Calculate width of title and position
		    $w = $this->GetStringWidth($title)+6;
		    $this->SetX((58-$w)/2);
		    // Colors of frame, background and text
		    $this->SetDrawColor(255,255,255);
		    $this->SetFillColor(255,255,255);
		    $this->SetTextColor(0,0,0);
		    // Thickness of frame (1 mm)
		    $this->SetLineWidth(1);
		    // Title
		    $this->Cell($w,9,$title,1,1,'C',true);
		    // Line break
		    $this->Ln(2);
		}
		function ImprovedTable($header, $data,$w)
		{
		    
		    // Header
		    for($i=0;$i<count($header);$i++)
		        $this->Cell($w[$i],5,$header[$i],1,0,'C');
		    $this->Ln();
		    // Data
		    foreach($data as $row)
		    {
		        $this->Cell($w[0],6,iconv('UTF-8', 'windows-1252', $row[1]),'LR');
				//$this->Cell($w[0],6,$row[0],'LR');
				//echo 'the row '.$row[1];
		        $this->Cell($w[1],6,$row[2],'LR',0,'R');
		       // $this->Cell($w[2],6,iconv('UTF-8', 'windows-1252',$row[3]."€"),'LR',0,'R');
		        //$this->Cell($w[3],6,iconv('UTF-8', 'windows-1252',($row[2]*$row[3])."€"),'LR',0,'R');
		        $this->Cell($w[2],6,iconv('UTF-8', 'windows-1252',$row[3]),'LR',0,'R');
		        $this->Cell($w[3],6,iconv('UTF-8', 'windows-1252',($row[2]*$row[3])),'LR',0,'R');
		        $this->Ln();
		    }
		    // Closing line
		    $this->Cell(array_sum($w),0,'','T');
			$this->Ln(2);
		}
	}
  
  
  
function GeneraPDF($pdfdata,$arrprodfactura,$sqlConn2) {
		echo "GeneraPDF ";
		$facturaid=$pdfdata[1];
		//echo " facturaid ".$facturaid;
	    $extras=($pdfdata[9]*$pdfdata[10]/100)+$pdfdata[9];
		//echo " extras ".$extras;
	    $envio=($pdfdata[11]*$pdfdata[12]/100)+$pdfdata[11];
		//echo " envio ".$envio;
	    $descuento=$pdfdata[7];
		//echo " descuento ".$descuento;
	    $total=$pdfdata[14];
		//echo " total ".$total;
	    $baseimponible=$pdfdata[13];
		//echo " baseimponible ".$baseimponible;
		$pago=$pdfdata[4];
		//echo " pago ".$pago;
		if($pdfdata[8]=="euros"){
				$descuentoTipo="€";
			}
			if($pdfdata[8]=="porcentaje"){
				$descuentoTipo="%";
			}

		
		$sqlSentence = "SELECT cl.nombre,cl.nif,cl.direccion,cl.cp,cl.poblacion,cl.pais,cl.telefono,cl.id FROM clientes as cl join facturas as ft on ft.idcliente=cl.id where ft.id=".$pdfdata[0];
		mysqli_query($sqlConn2,"SET NAMES 'utf8'");
		echo "\n result: \n";
		$arrcliente=array();

		$result = mysqli_query($sqlConn2,$sqlSentence);
		//var_dump($result);
		 $arrcliente=mysqli_fetch_row($result);
	    
		$idcliente=$arrcliente[7];
		/*
		echo "\n Cliente: \n";
		var_dump($arrcliente);
		echo "\n";*/
		//$query = "SELECT  'nombre' ,  'nif' ,  'direccion' ,  'cp' ,  'poblacion' ,  'pais' ,  'telefono' ,  'email' FROM  'clientes' WHERE  'id' =2";
		//echo "landanzo lo de los pdf idcliente=".$idcliente." pago=".$pago;
		//PDF ZONE!	
	if($idcliente==1 or $pago=='cortesia') {
		$header = array('Prod.', 'Cant.', 'P. Un.', 'Total');
		$pdf = new PDF('P','mm',array(58,160));
		$title = iconv('UTF-8', 'windows-1252','Casa do Açaí');
		$pdf->SetTitle($title);
		$pdf->SetFont('Arial','',8);
		$pdf->SetMargins(0.8, 1);
		$pdf->AddPage();
		$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Fecha: '.date("Y-m-d H:i:s")),'',0,'L');
		$pdf->Ln();
		$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Tiquet: '.$facturaid),'',0,'L');	
		$pdf->Ln();
		// Column widths
		$w = array(27, 8, 10, 10);
		$pdf->ImprovedTable($header,$arrprodfactura,$w);
		
		if($extras>0){
			$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Extras: '.$extras."€"),'',0,'R');
			$pdf->Ln();	
		}
		if($envio>0){
			$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Envio: '.$envio."€"),'',0,'R');
			$pdf->Ln();
		}
		if($descuento>0){
			$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Descuento: '.$descuento.$descuentoTipo),'',0,'R');
			$pdf->Ln();	
		}
		$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','IVA.: '.($total-$baseimponible)."€"),'',0,'R');
		$pdf->Ln();
		$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Base imp.: '.$baseimponible."€"),'',0,'R');
		$pdf->Ln();
		$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Total: '.$total."€"),'',0,'R');
		$pdf->Ln();
		$pdf->SetFont('Times','I',8);
		$pdf->SetTextColor(150);
	    //$pdf->Cell(40,10,'Casa do Açai/B66530064/Carrer d’Entença 144, 08029,Barcelona/Tel:+34 933.60.62.55',0,2,'C');    
	    $pdf->Write(3,iconv('UTF-8', 'windows-1252', 'Casa do Açaí / B66530064 / Carrer d’Entença 144, 08029, Barcelona / Tel:+34 933.60.62.55'));
		$pdf->Ln();
		$pdf->Image('./img/logotic.png',16);		
		$pdf->Output('F','./pdf/doc'.$pdfdata[0].'.pdf',true);
		//var_dump($return);
	} else {
			//var_dump($arrcliente['nombre']);
				$header = array('Producto', 'Cantidad', 'Precio Unitario', 'Total');
				$pdf = new PDF();
				$pdf->AliasNbPages();
				$pdf->AddPage();
				
				$pdf->SetFont('Times','BI',24);
			    // Move to the right
			    //$pdf->Cell(80);
			    // Title
			   	$pdf->Cell(180,10,iconv('UTF-8', 'windows-1252','Casa do Açaí'),0,0,'C');
				$pdf->Image('./img/logofact.png',10,6,30);
			    // Line break
			    $pdf->Ln(20);
			    $pdf->SetFont('Arial','',10);
			    $pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','Id. Facutra: '.$facturaid),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Fecha: '.date("d-m-Y")),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','Nombre Cliente: '.$arrcliente[0]),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','NIF. Cliente: '.$arrcliente[1]),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','Dirección: '.$arrcliente[2]),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','C.p.: '.$arrcliente[3]),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','Poblacion: '.$arrcliente[4]),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','Pais: '.$arrcliente[5]),'',0,'L');
				$pdf->Ln();
				$pdf->Cell(0,4,iconv('UTF-8', 'windows-1252','telefono: '.$arrcliente[6]),'',0,'L');
				$pdf->Ln(15);
				$pdf->SetFont('Arial','',10);
				// Column widths				
		    	$arr = array(70, 35, 40, 45);
				$pdf->ImprovedTable($header,$arrprodfactura,$arr);
				if($extras>0){
					$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Extras : '.$extras."€"),'',0,'R');
					$pdf->Ln();	
				}		
				if($envio>0){
					$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Envio : '.$envio."€"),'',0,'R');
					$pdf->Ln();
				}	
				if($descuento>0){
					$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Descuento : '.$descuento.$descuentoTipo),'',0,'R');
					$pdf->Ln();	
				}
				$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','IVA.: '.($total-$baseimponible)."€"),'',0,'R');
				$pdf->Ln();
				$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Base imp.: '.$baseimponible."€"),'',0,'R');
				$pdf->Ln();
				$pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Total: '.$total."€"),'',0,'R');
				$pdf->Ln();
				$pdf->SetFont('Times','I',10);
				$pdf->SetTextColor(150);
			    //$pdf->Cell(40,10,'Casa do Açai/B66530064/Carrer d’Entença 144, 08029,Barcelona/Tel:+34 933.60.62.55',0,2,'C');    
			    //$pdf->Write(3,iconv('UTF-8', 'windows-1252', 'Casa do Açaí / B66530064 / Carrer d’Entença 144, 08029, Barcelona / Tel:+34 933.60.62.55'));
				$pdf->SetY(-30);
			    // Page number
			    $pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Casa do Açaí / B66530064 / Carrer d’Entença 144, 08029, Barcelona / Tel:+34 933.60.62.55'),'',0,'C');
			    //$pdf->Ln();
			    //$pdf->Cell(0,10,'Page '.$pdf->PageNo().'/{nb}',0,0,'C');
				
				mysqli_free_result($result);
				$pdf->Output('F','./pdf/doc'.$pdfdata[0].'.pdf',true);
				//var_dump($return);
				  mysqli_close($sqlConn2);
			}	
	/*}
		else {echo"no sabemos nada de la BBDD";}*/
	}
  if(isset($_REQUEST['action'])) {
	$dataCatch = $_REQUEST['dataSend'];
  	switch ($_REQUEST['action']) {
	  	case "update": {
	  	$resultado="";
		$productos = array();

		//update facturas set tipodeventa='F998-2018',metododepago='Cliente Tienda',usuario='efectivo',comercial='1234',descuento=,tipodescuento='0',extras=ninguno,ivaextras=0.00,envio=0,ivaenvio=0.00,baseimponible=0,total=66.38,timestamp=now() WHERE id=576

	    $sqlSentence = "UPDATE facturas SET idfactusu='".$dataCatch[1]."',tipodeventa='".$dataCatch[2]."',metododepago='".$dataCatch[4]."',usuario='".$dataCatch[5]."',comercial='".$dataCatch[6]."',descuento=".$dataCatch[7].",tipodescuento='".$dataCatch[8]."',extras=".$dataCatch[9].",ivaextras=".$dataCatch[10].",envio=".$dataCatch[11].",ivaenvio=".$dataCatch[12].",baseimponible=".$dataCatch[13].",total=".$dataCatch[14].",timestamp='".$dataCatch[15]."' WHERE id=".$dataCatch[0].";";
	    if(mysqli_query($sqlConn,$sqlSentence)) {
	      $resultado.= "Factura Editada";
	    } else {
	      $resultado.=  "Fallo al editar la Factura. Razón ".mysqli_error($sqlConn)." sentencia: ".$sqlSentence;
	    } 
		 
		 $sqlSentence = "DELETE FROM Productosfacturas WHERE idfactura=".$dataCatch[0].";";
	    if(mysqli_query($sqlConn,$sqlSentence)) {
	      $resultado.=  "Productos eliminados";
	    } else {
	      $resultado.=  "Fallo al borrar los productos. Razón ".mysqli_error($sqlConn)." sentencia: ".$sqlSentence;
	    } 


	    	//-----------------(!!!) -----------
	    //EL ID DE LOS PRODUCTOS DEBE SER ALTERADO SI SE INTRODUCEN MÁS 
		for ($i = 0; $i <= 7; $i++) {
			if ($dataCatch[17+($i*4)]>0) {
				$sqlSentence = "INSERT INTO  `Productosfacturas` (  `idfactura` ,  `idproducto` ,  `nombre` ,  `cantidad` ,  `preciounitario` ,  `iva` ) VALUES (  ".$dataCatch[0]." ,  ".($i+1)." ,  '".$dataCatch[16+($i*4)]."' ,  ".$dataCatch[17+($i*4)]." ,  ".$dataCatch[18+($i*4)]." ,  ".$dataCatch[19+($i*4)].") ;";
				if(mysqli_query($sqlConn,$sqlSentence)) {
					//$resultado.=  "Producto ".$dataCatch[14+($i*4)]." creado";
					} else {
					    $resultado.=  "Fallo al insertar los productos. Razón ".mysqli_error($sqlConn)." sentencia: ".$sqlSentence;
					}
				//Cantidad de productos
				$productos[]=array(($i+1),$dataCatch[16+($i*4)],$dataCatch[17+($i*4)],$dataCatch[18+($i*4)],$dataCatch[19+($i*4)]);
			}
		 }

		 if (!strpos($resultado ,"Fallo")) {
		 	//echo "listado productos \n";
		 	//var_dump($productos);
			//echo "\n";
			//echo "listado dataCatch \n";
		 	//var_dump($dataCatch);
			//echo "\n";
		 	GeneraPDF($dataCatch,$productos,$sqlConn);
			
		 }
		 echo $resultado;
		 break;
		}
		case "products": {
			$sqlSentence = "SELECT productos.id, productos.nombre, Productosfacturas.cantidad, Productosfacturas.preciounitario, Productosfacturas.iva FROM productos LEFT JOIN Productosfacturas ON productos.id=Productosfacturas.idproducto AND Productosfacturas.idfactura=".$dataCatch[0]." ORDER BY productos.id;";	
	    	//$sqlSentence = "SELECT idproducto, nombre, cantidad, preciounitario, iva FROM  Productosfacturas WHERE idfactura=".$dataCatch[0].";";
		    $alldata = mysqli_query($sqlConn,$sqlSentence);
		    $productos = array();
		    foreach ($alldata as $datarow) {
		      $specificData = array();
		      foreach ($datarow as $clientData) {
		        $specificData[] = $clientData;
		      }
		      $productos[] = $specificData;
		      unset($specificData);
		    }
		    echo json_encode($productos);   
		    //echo json_encode("No return");
			break;
		}
	}
  } else {
    $sqlSentence = "SELECT ft.id,ft.idfactusu,tipodeventa,cl.nombre,metododepago,usuario,comercial,descuento,tipodescuento,extras,ivaextras,envio,ivaenvio,baseimponible,total,ft.timestamp FROM facturas ft join clientes cl on ft.idcliente=cl.id ORDER BY ft.id desc";
    $alldata = mysqli_query($sqlConn,$sqlSentence);
    $movimientos = array();
    foreach ($alldata as $datarow) {
      $specificData = array();
      foreach ($datarow as $clientData) {
        $specificData[] = $clientData;
      }
      $movimientos[] = $specificData;
      unset($specificData);
    }
    echo "{\"data\":".json_encode($movimientos)."}";   
  }
?>

