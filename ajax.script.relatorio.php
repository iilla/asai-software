<?php
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  //Devolver floats con dígitos deseados
  function truncateFloat($number, $digitos) {
    /*
      $raiz = 10;
      $multiplicador = pow ($raiz,$digitos);
      $resultado = ((int)($number * $multiplicador)) / $multiplicador;*/
      //return number_format($resultado, $digitos);

      //Funcion no implementada por búsqueda de exactitud de cálculo
      return $number;
  }

  //Funciones de ordenación de datos
  class comparator {

      var $reference ;

      public function __construct($reference) {
          $this->reference = $reference ;
      }
      // function comparator( $reference ) { $this->reference = $reference ;  }
      
      function productOrder($a,$b) {
        if (in_array($a['nombre'], $this->reference)) {
          if (in_array($b['nombre'], $this->reference)) {
            $position_a = array_search($a['nombre'],$this->reference);
            $position_b = array_search($b['nombre'],$this->reference);
            return $position_a < $position_b ?-1:1;
          } else {
            return 1;
          }
        } else {
          if (in_array($b['nombre'], $this->reference)) {
            return -1;
          } else {
            return -1;
          }
        }
      } 

      function productSort($a,$b) {
        if (!in_array($a['nombre'], $this->reference)) {
          if (!in_array($b['nombre'], $this->reference)) {
            return 0;
          } else {
            return 1;
          }
        } else {
          if (!in_array($b['nombre'], $this->reference)) {
            return -1;
          } else {
            $position_a = array_search($a['nombre'],$this->reference);
            $position_b = array_search($b['nombre'],$this->reference);
            return $position_a < $position_b ?-1:1;
          }
        }
      } 

      function totalSort($a,$b) {
        $position_a = array_search($a['venta'],$this->reference);
        $position_b = array_search($b['venta'],$this->reference);
        return $position_a < $position_b ?-1:1;
      }     
  }

  if (isset($_REQUEST['action'])) {
    $requestedAction = $_REQUEST['action'];
    //Fabricaremos los datos en función de los filtros y los retornaremos en formato Json
    switch($requestedAction) {
      case "earnings": 
      case "benefits": {
        //Información de salida básica
        $outputInfo = array();
        foreach ($_REQUEST['dataset'] as $filterKey => $filterValue) {
            if ($filterValue!="0") $outputInfo[$filterKey] = $filterValue;
            if ($filterKey == "dateFilterYear") {
              if (isset($outputInfo['dateFilterMonth'])) {
                  if (isset($outputInfo['dateFilterDay'])) {
                    $whereClause = "WHERE timestamp LIKE '".$outputInfo['dateFilterYear']."-".$outputInfo['dateFilterMonth']."-".$outputInfo['dateFilterDay']."%'";
                  } else {
                    $whereClause = "WHERE timestamp LIKE '".$outputInfo['dateFilterYear']."-".$outputInfo['dateFilterMonth']."%'";
                  }
              } else {
                $whereClause = "WHERE timestamp LIKE '".$outputInfo['dateFilterYear']."%'";
              }
            } else {
              if (($filterKey != "dateFilterMonth") && ($filterKey != "dateFilterDay")) {
                if (isset($outputInfo[$filterKey])) {
                  $searchField = substr($filterKey,11);
                  $whereClause .= " AND facturas.".$searchField."='".$filterValue."'";
                }
              }
            }
        }

        $benefitsWhereClause = $whereClause;
        $whereClause .= " AND facturas.metododepago!='anulado'";

        //Información de salida de totales y productos con extras
        $sqlQuery = "SELECT facturas.id,facturas.extras,facturas.ivaextras,facturas.descuento,facturas.tipodescuento,Productosfacturas.nombre,Productosfacturas.cantidad,Productosfacturas.preciounitario,Productosfacturas.iva";
        if (!isset($outputInfo['extraFiltermetododepago'])) {$sqlQuery .= ",facturas.metododepago";}
        if (!isset($outputInfo['extraFiltertipodeventa'])) {$sqlQuery .= ",facturas.tipodeventa";}
        $sqlQuery .= " FROM facturas INNER JOIN Productosfacturas ON facturas.id=Productosfacturas.idfactura ".$whereClause;

        if ($productBillInfo = mysqli_query($sqlConn,$sqlQuery)) {
            $outputTotals = array();
            $outputProducts = array(); 
            $distinctBillIds = array();
            $extrasIndex = 1;
            $absoluteDiscount = 0;

            function discountCounter ($discAmount) {
                $GLOBALS['absoluteDiscount'] += $discAmount;
            }

            function makeTotals ($amount,$discount) {
              discountCounter($amount*($discount/100));
              return ($amount-$amount*($discount/100));
            }

            function makeTotal ($amount,$discount) {
              return ($amount-$amount*($discount/100));
            }

            foreach ($productBillInfo as $billRow) { //MAIN LOOP
                $infoTotals = array();
                $infoProducts = array();
                $applyEuroDiscount = false;

                if (isset($outputInfo['extraFiltermetododepago'])) {
                  if (($outputInfo['extraFiltermetododepago']) == "pendiente") {
                    $infoTotals['venta'] = $outputInfo['extraFiltermetododepago'];
                  } else {
                    if (isset($outputInfo['extraFiltertipodeventa'])) {
                      $infoTotals['venta'] = $outputInfo['extraFiltermetododepago']." ".$outputInfo['extraFiltertipodeventa'];
                    } else {
                      $infoTotals['venta'] = $outputInfo['extraFiltermetododepago']." ".$billRow['tipodeventa'];
                    }
                  }
                } else {
                  if (($billRow['metododepago']) == "pendiente") {
                    $infoTotals['venta'] = $billRow['metododepago'];
                  } else {
                    if (isset($outputInfo['extraFiltertipodeventa'])) {
                      $infoTotals['venta'] = $billRow['metododepago']." ".$outputInfo['extraFiltertipodeventa'];
                    } else {
                      $infoTotals['venta'] = $billRow['metododepago']." ".$billRow['tipodeventa'];
                    }
                  }
                }

                if ($billRow['tipodescuento'] == "euros") {
                    $euroDisc = $billRow['descuento'];
                    $billRow['descuento'] = 0;
                } else {
                    $euroDisc = 0;
                }

                //Sumamos los extras a los totales de las facturas diferentes
                if(!in_array($billRow['id'],$distinctBillIds)) { //EXTRAS & DISCOUNT CONDITION
                  $distinctBillIds[] = $billRow['id'];

                  if ($billRow['metododepago'] != "cortesía") {
                    $absoluteDiscount += $euroDisc;
                    $applyEuroDiscount = true;
                  }
                  
                  //TOTALES: CALCULO A REVISAR
                  $infoTotals['totalbase'] += makeTotals($billRow['extras'],$billRow['descuento']);
                  $infoTotals['totaliva'] += makeTotals(truncateFloat(($billRow['extras']*$billRow['ivaextras'])/100,2),$billRow['descuento']);
                  $infoTotals['total'] += $infoTotals['totalbase']+$infoTotals['totaliva'];

                  if ($billRow['extras']!=0) {
                    $newExtra = true;
                    $selectedIndex = 0;
                    $i = 0;
                    foreach ($outputProducts as $outputProductsRow) {
                      if (isset($outputProductsRow['ivaextras']) && $outputProductsRow['ivaextras']==$billRow['ivaextras']) {
                          $newExtra = false;
                          if (!$newExtra) $selectedIndex = $i;
                      }
                      $i++;
                    }

                    if ($newExtra) {
                      unset($infoProducts);
                      $infoProducts['nombre'] = "Extras (IVA ".$billRow['ivaextras']."%)";
                      if ($billRow['metododepago'] != "cortesía") {
                        $infoProducts['unidades'] = 1;
                        $infoProducts['cortesia'] = 0;
                        //PRODUCTOS: CALCULO A REVISAR
                        $infoProducts['baseimponible'] = makeTotal($billRow['extras'],$billRow['descuento']);
                        $infoProducts['totaliva'] = makeTotal(truncateFloat(($billRow['extras']*$billRow['ivaextras'])/100,2),$billRow['descuento']);
                        $infoProducts['ivaextras'] = $billRow['ivaextras'];
                        $infoProducts['total'] = $infoProducts['baseimponible']+$infoProducts['totaliva'];
                      } else {
                        $infoProducts['unidades'] = 0;
                        $infoProducts['cortesia'] = 1;
                        $infoProducts['baseimponible'] = 0;
                        $infoProducts['totaliva'] = 0;
                        $infoProducts['ivaextras'] = $billRow['ivaextras'];
                        $infoProducts['total'] = 0;
                      }
                      $extrasIndex++;
                      $outputProducts[] = $infoProducts;
                    } else {
                      if ($billRow['metododepago'] != "cortesía") {
                        $outputProducts[$selectedIndex]['unidades']++;
                        //PRODUCTOS: CALCULO A REVISAR
                        $outputProducts[$selectedIndex]['baseimponible'] += makeTotal($billRow['extras'],$billRow['descuento']);
                        $outputProducts[$selectedIndex]['totaliva'] += makeTotal(truncateFloat(($billRow['extras']*$billRow['ivaextras'])/100,2),$billRow['descuento']);
                        $outputProducts[$selectedIndex]['total'] += makeTotal($billRow['extras']+truncateFloat(($billRow['extras']*$billRow['ivaextras'])/100,2),$billRow['descuento']);
                      } else {
                        $outputProducts[$selectedIndex]['cortesia']++;
                      }
                    }
                  }
                } //END EXTRAS & DISCOUNT
  
                //Anulamos el efecto del descuento directo en euros para facturas cuyo ID ya haya sido indexado
                if (!$applyEuroDiscount) { $euroDisc = 0; }

                //Añadir totales y sumar productos
                //TOTALES: CALCULO A REVISAR
                $infoTotals['totalbase'] += makeTotals($billRow['preciounitario']*$billRow['cantidad'],$billRow['descuento'])-$euroDisc;
                $infoTotals['totaliva'] += makeTotals(truncateFloat(($billRow['preciounitario']*$billRow['iva'])/100,2)*$billRow['cantidad'],$billRow['descuento']);
                $infoTotals['total'] += makeTotal(($billRow['preciounitario']+truncateFloat(($billRow['preciounitario']*$billRow['iva'])/100,2))*$billRow['cantidad'],$billRow['descuento'])-$euroDisc;

                //Añadir información total de producto
                $merge = false;
                $i=0;
                foreach ($outputProducts as $outputProductsRow) {
                  if ($outputProductsRow['nombre']==$billRow['nombre']) $merge = true;  
                  if (!$merge) $i++;
                }

                if (!$merge) {
                  unset($infoProducts);
                  $infoProducts['nombre'] = $billRow['nombre'];
                  if ($billRow['metododepago']!="cortesía") {
                      $infoProducts['unidades'] = $billRow['cantidad'];
                      $infoProducts['cortesia'] = 0;
                      //PRODUCTOS: CALCULO A REVISAR
                      $infoProducts['baseimponible'] = makeTotal($billRow['preciounitario']*$billRow['cantidad'],$billRow['descuento'])-$euroDisc;
                      $infoProducts['totaliva'] = makeTotal(truncateFloat(($billRow['preciounitario']*$billRow['iva'])/100,2)*$billRow['cantidad'],$billRow['descuento']);
                      $infoProducts['total'] = $infoProducts['baseimponible']+$infoProducts['totaliva'];
                  } else {
                      $infoProducts['unidades'] = 0;
                      $infoProducts['cortesia'] = $billRow['cantidad'];
                      $infoProducts['baseimponible'] = 0;
                      $infoProducts['totaliva'] = 0;
                      $infoProducts['total'] = 0;                           
                  }
                  $outputProducts[] = $infoProducts;
                } else {
                  if ($billRow['metododepago']!="cortesía") {
                      $outputProducts[$i]['unidades'] += $billRow['cantidad'];
                      //PRODUCTOS: CALCULO A REVISAR
                      $outputProducts[$i]['baseimponible'] += makeTotal($billRow['preciounitario']*$billRow['cantidad'],$billRow['descuento'])-$euroDisc;
                      $outputProducts[$i]['totaliva'] += makeTotal(truncateFloat(($billRow['preciounitario']*$billRow['iva'])/100,2)*$billRow['cantidad'],$billRow['descuento']);
                      $outputProducts[$i]['total'] += makeTotal(($billRow['preciounitario']+truncateFloat(($billRow['preciounitario']*$billRow['iva'])/100,2))*$billRow['cantidad'],$billRow['descuento'])-$euroDisc;
                  } else {
                      $outputProducts[$i]['cortesia'] += $billRow['cantidad'];
                  }
                }

                //Mezclar totales en funcion del tipodeventa+metododepago
                $merge = false;
                $i=0;
                foreach ($outputTotals as $outputTotalsRow) {
                  if (in_array($infoTotals['venta'],$outputTotalsRow)) $merge = true;  
                  if (!$merge) $i++;
                }
                if (!$merge) {
                  $outputTotals[] = $infoTotals;
                } else {
                  $outputTotals[$i]['totalbase'] += $infoTotals['totalbase'];
                  $outputTotals[$i]['totaliva'] += $infoTotals['totaliva'];
                  $outputTotals[$i]['total'] += $infoTotals['total'];
                }
            } //End of BILL loop

            //Reordenamos los totales y productos
            $reference = array (
                "efectivo en tienda",
                "efectivo envío",
                "tarjeta en tienda",
                "tarjeta envío",
                "cortesía en tienda",
                "cortesía envío",
                "pendiente"
            );

            usort($outputTotals,array(new comparator($reference),"totalSort"));

            $reference = array();
            $sqlQuery = "SELECT nombre FROM productos";
            if ($prodNames = mysqli_query($sqlConn,$sqlQuery)) {
              foreach ($prodNames as $prodNamesRow) {
                  $reference[] = $prodNamesRow['nombre'];
              }
            }
            //usort($outputProducts,array(new comparator($reference),"productOrder"));
            usort($outputProducts,array(new comparator($reference),"productSort"));

            //Encapsular según el tipo de request 
            if ($requestedAction == "earnings") {
              $returnOutput = array($outputInfo,$outputTotals,$outputProducts,$absoluteDiscount);
            } else {
              $sqlQuery = "SELECT * FROM gastos ".$benefitsWhereClause." ORDER BY id DESC";
              if ($expensesInfo = mysqli_query($sqlConn,$sqlQuery)) {
                $outputExpenses = array();
                foreach ($expensesInfo as $expensesInfoRow) {
                  $infoExpenses['concepto'] = $expensesInfoRow['concepto'];
                  $infoExpenses['iva'] = $expensesInfoRow['iva'];
                  $infoExpenses['base'] = $expensesInfoRow['baseimp'];
                  $infoExpenses['gastoiva'] = truncateFloat(($expensesInfoRow['baseimp']*$expensesInfoRow['iva'])/100,2);
                  $infoExpenses['total'] = $expensesInfoRow['total'];
                  $outputExpenses[] = $infoExpenses;
                }
                $returnOutput = array($outputInfo,$outputTotals,$outputExpenses,$absoluteDiscount);
              }
            }

            echo json_encode($returnOutput);
        } else {
          echo "Fallo en la conexión a base de datos";
        }
        break;
      }
      case "report": {
        //ENVÍO DE INFORME
        $sender = "inablackwood@gmail.com";
        //$sender = "inablackwood@gmail.com";
        $html= "<!DOCTYPE html>
                <html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\">
                  <head>
                    <title>Informe tienda Casa do Açaí</title>
                    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">
                    <style>
                      .clear {
                          clear: both;
                          margin: 0 0 0 0;
                          padding: 0 0 0 0;
                      }
                      a:link img, a:hover img, a:visited img, a:active img{ 
                          text-decoration: none;
                          border: none;
                      }
                    </style>
                  </head>
                  <body style=\"width: 100%;height: 100%; background-color: e1e0db;text-align: justify;margin-right: auto;margin-left: auto;\">
                    ".$_REQUEST['mailBody']."
                  </body>
                </html>";
          $headers = "Content-type: text/html; charset=UTF-8\r\nFrom: ".$sender;
          if (mail($_REQUEST['mailTo'],$_REQUEST['mailSubject'],$html,$headers)) {
            $html= "<!DOCTYPE html>
                    <html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\">
                      <head>
                        <title>Confirmación de envío</title>
                        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">
                        <style>
                          .clear {
                              clear: both;
                              margin: 0 0 0 0;
                              padding: 0 0 0 0;
                          }
                          a:link img, a:hover img, a:visited img, a:active img{ 
                              text-decoration: none;
                              border: none;
                          }
                        </style>
                      </head>
                      <body style=\"width: 100%;height: 100%; background-color: e1e0db;text-align: justify;margin-right: auto;margin-left: auto;\">
                        Se ha enviado el siguiente e-mail a la dirección de correo ".$_REQUEST['mailTo']."<br/><br/>".$_REQUEST['mailBody']."
                      </body>
                    </html>";   
            $headers = "Content-type: text/html; charset=UTF-8\r\n";        
            if(mail($sender,"Confirmación de envío. Casa do Açaí",$html,$headers)) {
              echo json_encode("El mensaje se ha enviado correctamente a ".$_REQUEST['mailTo']." de parte de ".$sender);
            } else {
              echo json_encode("El mensaje se ha enviado correctamente a ".$_REQUEST['mailTo']." pero no ha sido posible enviar confirmación a ".$sender);
            }
          } else {
            echo "Ha ocurrido un error al enviar el mail a ".$_REQUEST['mailTo'].". Inténtelo más tarde.";
          }
          break;
      }
    }
  } else {
    echo "Datos incorrectos para procesar respuesta de AJAX";
  }
  mysqli_close($sqlConn);
?>