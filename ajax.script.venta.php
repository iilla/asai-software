<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');

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
		        $this->Cell($w[0],6,iconv('UTF-8', 'windows-1252', $row[0]),'LR');

		        $this->Cell($w[1],6,$row[1],'LR',0,'R');
		        $this->Cell($w[2],6,$row[2].chr(128),'LR',0,'R');
		        $this->Cell($w[3],6,$row[3].chr(128),'LR',0,'R');
		        $this->Ln();
		    }
		    // Closing line
		    $this->Cell(array_sum($w),0,'','T');
			$this->Ln(2);
		}
	}

	header('Content-Type: application/json; Charset="UTF-8"');
	require('./config/dbconn.php');
	
	if (mysqli_connect_errno()) {
	    printf("Connect failed: %s\n", mysqli_connect_error());
	    exit();
	}
	
		//Fecha actual +6 horas
	$currentTime = new DateTime('NOW');
	$currentTime->add(new DateInterval('PT6H'));
	$currentTime = $currentTime->format('Y-m-d H:i:s');
	
	$idfactusu="";
	
	$idcliente = $_REQUEST['id'];
	//buscamos el tipo de serie a incrementar
	 if ($idcliente==1)
		{
			$idfactusu="T";
		}
		else
		{			
			$idfactusu="F";	
		}

	//recuperamos el último ID para añadir el nuevo

	$sqlSentence = "SELECT idfactusu FROM facturas WHERE idfactusu like '".$idfactusu."%' ORDER BY id DESC limit 1";
    $lastIdFactusu = mysqli_query($sqlConn,$sqlSentence);
    $lastIdFactusu = $lastIdFactusu->fetch_row();
    if (!empty($lastIdFactusu[0])) {
        $lastIdFactusu[0]=(substr(substr($lastIdFactusu[0],1),0,-5)+1);
        if ($lastIdFactusu[0]==0 or $lastIdFactusu[0]== "") { $lastIdFactusu[0]=1; }
        $idfactusu = $idfactusu.$lastIdFactusu[0]."-".date("Y");
    } else {
        $idfactusu = $idfactusu."1-".date("Y");
    }

    /*
    $sqlSentence = "SELECT idfactusu FROM facturas WHERE idfactusu like '".$idfactusu."%' order by CAST( idfactusu AS UNSIGNED ) DESC limit 1";
    $alldata = mysqli_query($sqlConn,$sqlSentence);

    $clientes = array();
      foreach ($alldata as $datarow) {
         foreach ($datarow as $clientData) {
            $strtemp=(substr(substr($clientData,1),0,-5)+1);
            if ($strtemp==0 or $strtemp== "") { $strtemp=1; }
            $idfactusu = $idfactusu.$strtemp."-".date("Y");
      }
    }
    */

	$addData = $_REQUEST['dataset'];
	$pago=$_REQUEST['action'];
	$usuario=$_REQUEST['usuario']; //$_SESSION['usr'];//$_REQUEST['usuario'];//REPASAR ESTO!!!!!!!!!
	$descuento=0;
	$descuentoTipo="";
	$extras=0;
	$ivaextras=0;
	$envio=0;
	$ivaenvio=0;
	$baseimponible=0;
	$total=0;
	$tipodeventa="en tienda";
	$comercial="";
	$recinto ="tienda";
	$arrproductos=array();
	$arrprodfactura=array();

	foreach ($addData as $row) {
		if(isset($row['recinto'])) {
			$recinto=$row['recinto'];
		}
		if(isset($row['comercial'])) {
				$comercial=$row['comercial'];
		}
		if(isset($row['descuento'])) {
				$descuento=$row['descuento'];
				$descuentoTipo=$row['tipo'];
		}
		if(isset($row['extras'])) {
				$extras=$row['extras'];
				$ivaextras=$row['iva'];
		}
		if(isset($row['cantenvio'])) {
				$envio=$row['cantenvio'];
				$ivaenvio=$row['iva'];				
				$tipodeventa='envío';
		}
		if(isset($row['baseimp'])) {
				$baseimponible=$row['baseimp'];
		}
		if(isset($row['total'])) {
				$total=$row['total'];
		}
		
		if(!(isset($row['recinto'])
            or isset($row['comercial'])
            or isset($row['descuento'])
            or isset($row['extras'])
            or isset($row['cantenvio'])
            or isset($row['baseimp'])
            or isset($row['total']))) {

			array_push($arrproductos,$row);
			//echo "ha entrado ".$row['prodid'].isset($row['descuento']).isset($row['extras']).isset($row['cantenvio']).isset($row['baseimp']).isset($row['total']);

		}
		//echo "esto sin ivas".$ivaenvio." mas el extras".$ivaextras;
	}

	// MODOS DE OPERACIÓN POSIBLES:
	/*
		"efectivo en tienda",
		"efectivo envío",
		"tarjeta en tienda",
		"tarjeta envío",
		"cortesía en tienda",
		"cortesía envío",
		"entrada de stock",
		"corrección de stock",
		"pendiente",
		"anulado"		
	*/

	if ($pago == "pendiente") {
		$operacion = "pendiente";
	} else {
		$operacion = $pago." ".$tipodeventa;
	}


	//Relacion de IVA y productos
	function truncateFloat($number, $digitos) {
	  	$raiz = 10;
	  	$multiplicador = pow ($raiz,$digitos);
	  	$resultado = ((int)($number * $multiplicador)) / $multiplicador;
	  	return number_format($resultado, $digitos);
	}

	/*
	$prices = "SELECT id,precio,iva FROM productos";
	$prices = mysqli_query($sqlConn,$prices);
	$priceIvaRelation = array();
	foreach ($prices as $row) {
		$priceIvaRelation[$row['id']] = truncateFloat(($row['precio']*$row['iva'])/100,2);
	}		
	*/

	//$query = "SELECT nombre,nif,ireccion,cp,poblacion,pais,telefono FROM clientes where id=".$_REQUEST['id'];
	$query = "INSERT INTO facturas ( tipodeventa,idfactusu,idcliente,metododepago,usuario,comercial,descuento,tipodescuento,extras,ivaextras,envio,ivaenvio,baseimponible,total,timestamp ) values ";
	$query.="('".$tipodeventa."','".$idfactusu."',".$idcliente.",'".$pago."','".$usuario."','".$comercial."',".$descuento.",'".$descuentoTipo."',".$extras.",".$ivaextras.",".$envio.",".$ivaenvio.",".$baseimponible.",".$total.",'".$currentTime."')";
	
	//var_dump($query);

    if ( $result = mysqli_query($sqlConn, $query) ) {

        $facturaid = mysqli_insert_id($sqlConn);
        //mysqli_free_result($result);

        foreach ($arrproductos as $row) {

            $query = "INSERT INTO Productosfacturas ( idfactura, idproducto, nombre, cantidad, preciounitario, iva ) VALUES ";
            $query .= "(" . $facturaid . "," . $row['prodid'] . ",'" . $row['nombre'] . "'," . $row['cant'] . "," . $row['precio'] . "," . $row['iva'] . "); ";
            //if ($result = mysqli_query($sqlConn, $query)) { mysqli_free_result($result); }
            $result = mysqli_query($sqlConn, $query);

            $priceIvaRelation = truncateFloat(($row['precio'] * $row['iva']) / 100, 2);
            $query = "INSERT INTO movimientos ( idproducto, idfact, producto, operacion, actor, unidades, precio, total, timestamp ) values ";
            $query .= "(" . $row['prodid'] . "," . $facturaid . ",'" . $row['nombre'] . "','" . $operacion . "','" . $usuario . "'," . $row['cant'] . "," . ($row['precio'] + $priceIvaRelation) . "," . (($row['precio'] + $priceIvaRelation) * $row['cant']) . ",'" . $currentTime . "')";
            //var_dump($query);

            //if ($result = mysqli_query($sqlConn, $query)) { mysqli_free_result($result); }
            $result = mysqli_query($sqlConn, $query);

            $query = "SELECT id," . $recinto . " FROM productos WHERE id=" . $row['prodid'];

            if ($result = mysqli_query($sqlConn, $query)) {
                $result = $result->fetch_array();
                $valorRecinto = $result[$recinto] - intVal($row['cant']);
                $query = "UPDATE productos SET " . $recinto . "=" . $valorRecinto . " WHERE id=" . $result['id'];

                if ($result2 = mysqli_query($sqlConn, $query)) {
                    //mysqli_free_result($result2);
                }
                /*
                foreach ($result as $datarow) {
                    //var_dump($datarow['nombre']);//TENEMOS UN ERROR AQUI!
                    $valorTienda = intVal($datarow[1])-intVal($row['cant']);
                    $query ="UPDATE productos SET tienda=".$valorTienda." WHERE id=".$row['prodid'];
                    $result2 = mysqli_query($sqlConn, $query);
                    //if ($result2 = mysqli_query($sqlConn, $query)) { mysqli_free_result($result2); }
                }*/
                //mysqli_free_result($result);
            }

            array_push($arrprodfactura, array($row['nombre'], $row['cant'], $row['precio'], $row['cant'] * $row['precio']));

        }
    }

    //PDF ZONE!
    if($idcliente==1 || $pago=='cortesía') {

        $header = array('Prod.', 'Cant.', 'P. Un.', 'Total');
        $pdf = new PDF('P','mm',array(58,160));
        $title = iconv('UTF-8', 'windows-1252','Casa do Açaí');
        $pdf->SetTitle($title);
        $pdf->SetFont('Arial','',8);
        $pdf->SetMargins(0.8, 1);
        $pdf->AddPage();
        $pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Fecha: '.date("Y-m-d H:i:s")),'',0,'L');
        $pdf->Ln();
        $pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Tiquet: '.$idfactusu),'',0,'L');
        $pdf->Ln();
        // Column widths
        $w = array(27, 8, 10, 10);

        $pdf->ImprovedTable( $header,$arrprodfactura,$w );

        if( $extras > 0 ) {
            $pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Extras: '.$extras."€"),'',0,'R');
            $pdf->Ln();
        }

        if( $envio > 0 ) {
            $pdf->Cell(0,6,iconv('UTF-8', 'windows-1252','Envio: '.$envio."€"),'',0,'R');
            $pdf->Ln();
        }

        if( $descuento>0 ){

            if($descuentoTipo=="euros"){
                $descuentoTipo="€";
            }
            if($descuentoTipo=="porcentaje"){
                $descuentoTipo="%";
            }
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
        $pdf->Output('F','./pdf/doc'.$facturaid.'.pdf',true);
        //var_dump($return);

    } else {

        //$query = "SELECT  'nombre' ,  'nif' ,  'direccion' ,  'cp' ,  'poblacion' ,  'pais' ,  'telefono' ,  'email' FROM  'clientes' WHERE  'id' =2";
        $query = "SELECT nombre,nif,direccion,cp,poblacion,pais,telefono FROM clientes where id=" . $idcliente;
        //$query = "SELECT * FROM clientes WHERE clientes.id=2";
        //$query = "SELECT * FROM clientes";
        //var_dump($_REQUEST['id']);
        //$result = mysqli_query($sqlConn, $query);
        //var_dump($resultado);
        //$result = mysqli_query($sqlConn, $query);
        $arrcliente = array();
        if ($result = mysqli_query($sqlConn, $query)) {

            foreach ($result as $datarow) {
                //var_dump($datarow['nombre']);
                $arrcliente = $datarow;
            }
            //var_dump($arrcliente['nombre']);
            $header = array('Producto', 'Cantidad', 'Precio Unitario', 'Total');
            $pdf = new PDF();
            $pdf->AliasNbPages();
            $pdf->AddPage();

            $pdf->SetFont('Times', 'BI', 24);
            // Move to the right
            //$pdf->Cell(80);
            // Title
            $pdf->Cell(180, 10, iconv('UTF-8', 'windows-1252', 'Casa do Açaí'), 0, 0, 'C');
            $pdf->Image('./img/logofact.png', 10, 6, 30);
            // Line break
            $pdf->Ln(20);
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'Id. Facutra: ' . $idfactusu), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Fecha: ' . date("Y-m-d")), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'Nombre Cliente: ' . $arrcliente['nombre']), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'NIF. Cliente: ' . $arrcliente['nif']), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'Dirección: ' . $arrcliente['direccion']), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'C.p.: ' . $arrcliente['cp']), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'Poblacion: ' . $arrcliente['poblacion']), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'Pais: ' . $arrcliente['pais']), '', 0, 'L');
            $pdf->Ln();
            $pdf->Cell(0, 4, iconv('UTF-8', 'windows-1252', 'telefono: ' . $arrcliente['telefono']), '', 0, 'L');
            $pdf->Ln(15);
            $pdf->SetFont('Arial', '', 10);
            // Column widths
            $arr = array(70, 35, 40, 45);
            $pdf->ImprovedTable($header, $arrprodfactura, $arr);
            if ($extras > 0) {
                $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Extras : ' . $extras . "€"), '', 0, 'R');
                $pdf->Ln();
            }
            if ($envio > 0) {
                $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Envio : ' . $envio . "€"), '', 0, 'R');
                $pdf->Ln();
            }
            if ($descuento > 0) {
                if ($descuentoTipo == "euros") {
                    $descuentoTipo = "€";
                }
                if ($descuentoTipo == "porcentaje") {
                    $descuentoTipo = "%";
                }
                $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Descuento : ' . $descuento . $descuentoTipo), '', 0, 'R');
                $pdf->Ln();
            }
            $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'IVA.: ' . ($total - $baseimponible) . "€"), '', 0, 'R');
            $pdf->Ln();
            $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Base imp.: ' . $baseimponible . "€"), '', 0, 'R');
            $pdf->Ln();
            $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Total: ' . $total . "€"), '', 0, 'R');
            $pdf->Ln();
            $pdf->SetFont('Times', 'I', 10);
            $pdf->SetTextColor(150);
            //$pdf->Cell(40,10,'Casa do Açai/B66530064/Carrer d’Entença 144, 08029,Barcelona/Tel:+34 933.60.62.55',0,2,'C');
            //$pdf->Write(3,iconv('UTF-8', 'windows-1252', 'Casa do Açaí / B66530064 / Carrer d’Entença 144, 08029, Barcelona / Tel:+34 933.60.62.55'));
            $pdf->SetY(-30);
            // Page number
            $pdf->Cell(0, 6, iconv('UTF-8', 'windows-1252', 'Casa do Açaí / B66530064 / Carrer d’Entença 144, 08029, Barcelona / Tel:+34 933.60.62.55'), '', 0, 'C');
            //$pdf->Ln();
            //$pdf->Cell(0,10,'Page '.$pdf->PageNo().'/{nb}',0,0,'C');

            mysqli_free_result($result);
            $pdf->Output('F', './pdf/doc' . $facturaid . '.pdf', true);
            //var_dump($return);

        }
    }

    /* close connection */
    mysqli_close($sqlConn);
    //$pdf->Output();
    //echo binary_encode($facturaid);
    echo "./pdf/doc".$facturaid.".pdf";

?>