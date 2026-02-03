<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  if ($_REQUEST['action'] == "till_history")  {
      $sqlSentence = "SELECT id,fecha,cajaanterior,ingresado,notas FROM cuadrarcaja ORDER BY ingresado ASC";
      $alldata = mysqli_query($sqlConn,$sqlSentence);

      $tillboxHistory = array();
      foreach ($alldata as $datarow) {
        $specificData = array();
        foreach ($datarow as $tillData) {
          $specificData[] = $tillData;
        }
        $tillboxHistory[] = $specificData;
        unset($specificData);
      }

      echo "{\"data\":".json_encode($tillboxHistory)."}";
      mysqli_close($sqlConn);

  } else {

    if($_REQUEST['action'] == "insert")  {
      $insertData = $_REQUEST['data'];
      $sqlSentence = "INSERT INTO cuadrarcaja (cajaanterior,fecha,notas,ingresado) ";
      $sqlSentence.="VALUES (".$insertData[0].",'".$insertData[1]."','".$insertData[2]."',".$insertData[3].")";
      $result = mysqli_query($sqlConn,$sqlSentence);
      //$jsonData['request'] = $result;
    }

      //We take all static values from database
      $allData = mysqli_query($sqlConn,"SELECT * FROM cuadrarcaja ORDER BY fecha DESC LIMIT 0,1");
      if ($allData->num_rows != 0) {
          $till_last = mysqli_fetch_object($allData);
          $fecha = explode(" ",$till_last->fecha);
          $hora = $fecha[1];
          $fecha = $fecha[0];
          $fecha = explode("-",$fecha);
          $fecha = $fecha[2]."/".$fecha[1]."/".$fecha[0];

          $allData = mysqli_query($sqlConn,"SELECT SUM(total) AS totalSold FROM facturas WHERE timestamp>(SELECT MAX(fecha) FROM cuadrarcaja) AND (metododepago='efectivo')");
          $till_sales = mysqli_fetch_object($allData);
          $allData = mysqli_query($sqlConn,"SELECT SUM(total) AS totalCard FROM facturas WHERE timestamp>(SELECT MAX(fecha) FROM cuadrarcaja) AND (metododepago='tarjeta')");
          $till_sales_card = mysqli_fetch_object($allData);

          if($till_sales_card->totalCard == null) $till_sales_card->totalCard = 0;
          if($till_sales->totalSold == null) $till_sales->totalSold = 0;

          $jsonData['till_last_value'] = $till_last->cajaanterior;
          $jsonData['till_last_date'] = $fecha.' '.$hora;
          $jsonData['till_sales_value'] = $till_sales->totalSold;
          $jsonData['till_sales_card'] = $till_sales_card->totalCard;
          $jsonData['till_current_value'] = $till_last->cajaanterior+$till_sales->totalSold;
      } else {
          $jsonData['till_last_value'] = 0;
          $jsonData['till_last_date'] = "No hay registros de caja";
          $jsonData['till_sales_value'] = 0;
          $jsonData['till_sales_card'] = 0;
          $jsonData['till_current_value'] = 0;
      }

      $jsonData['request'] = true; //Usaremos esto para crear un control de errores más tarde (!!!!!)

        echo json_encode($jsonData);
        mysqli_close($sqlConn);
  }

?>
