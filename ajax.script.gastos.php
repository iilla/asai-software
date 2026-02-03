<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  if(isset($_REQUEST['action'])) {
  	
  	//Fecha actual +6 horas
	$currentTime = new DateTime('NOW');
	$currentTime->add(new DateInterval('PT6H'));
	$currentTime = $currentTime->format('Y-m-d H:i:s');
	
     switch ($_REQUEST['action']) {
        case "delete": {
          //echo "¡Ha pasado por aqui el registro ".$_REQUEST['id']."!";
          $sqlSentence = "DELETE FROM gastos WHERE id='".$_REQUEST['id']."'";
          if(mysqli_query($sqlConn,$sqlSentence)) {
              echo "Eliminado registro ".$_REQUEST['id'];
          } else {
              echo "Fallo al eliminar ".$_REQUEST['id'].". Razón ".mysqli_error($sqlConn);
          }
          break;
        }
        case "edit": {
          $editData = $_REQUEST['dataset'];
          $editData[]=$currentTime;
          $fieldList = array("concepto", "baseimp", "iva", "total", "timestamp");
          $sqlSentence = "UPDATE gastos SET ";
          for ($i=0;$i<count($editData);$i++) {
              $sqlSentence .= $fieldList[$i]."='".$editData[$i]."'";
              if ($i!=(count($editData)-1)) $sqlSentence .= ",";
          } 
          $sqlSentence .= " WHERE id='".$_REQUEST['id']."'";

          if(mysqli_query($sqlConn,$sqlSentence)) {
              echo "Editado registro";
          } else {
              echo "Fallo al editar registro. Razón ".mysqli_error($sqlConn);
          }
          break;
        }
        case "add": {
          $addData = $_REQUEST['dataset'];
          $addData[] =$currentTime;
          $sqlSentence = "INSERT INTO gastos (concepto, baseimp, iva, total, timestamp) ";
          $sqlSentence.="VALUES (";
          for ($i=0;$i<count($addData);$i++) {
              $sqlSentence .= "'".$addData[$i]."'";
              if ($i!=(count($addData)-1)) {
                $sqlSentence .= ",";
              } else {
                $sqlSentence .= ")";
              }
          }
          if(mysqli_query($sqlConn,$sqlSentence)) {
              $sqlSentence = "SELECT * FROM gastos order by timestamp";
		        $alldata = mysqli_query($sqlConn,$sqlSentence);
		
  		      $gastos = array();
  		      foreach ($alldata as $datarow) {
  		        $specificData = array();
  		        foreach ($datarow as $clientData) {
  		         $specificData[] = $clientData;
  		        }
  		      $gastos[] = $specificData;
  		      unset($specificData);
  		      }
		      echo json_encode($gastos);		
          } else {
          	echo $sqlSentence;
              //echo "Fallo al añadir registro. Razón ".mysqli_error($sqlConn);
          } 
          break;
        }
		 case "reload": {
		 	$sqlSentence = "SELECT * FROM gastos order by timestamp";
      $alldata = mysqli_query($sqlConn,$sqlSentence);

      $gastos = array();
      foreach ($alldata as $datarow) {
        $specificData = array();
        foreach ($datarow as $clientData) {
         $specificData[] = $clientData;
        }
      $gastos[] = $specificData;
      unset($specificData);
      }
      echo json_encode($gastos);		 	
 	}
    }

  }
 else {
      $sqlSentence = "SELECT * FROM gastos order by timestamp";
      $alldata = mysqli_query($sqlConn,$sqlSentence);

      $gastos = array();
      foreach ($alldata as $datarow) {
        $specificData = array();
        foreach ($datarow as $clientData) {
         $specificData[] = $clientData;
        }
      $gastos[] = $specificData;
      unset($specificData);
      }
      echo "{\"data\":".json_encode($gastos)."}";
  }

  mysqli_close($sqlConn);

?>

