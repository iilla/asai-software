<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  if(isset($_REQUEST['action'])) {
     switch ($_REQUEST['action']) {
        case "delete": {
          //echo "¡Ha pasado por aqui el registro ".$_REQUEST['id']."!";
          $sqlSentence = "DELETE FROM facturas WHERE id='".$_REQUEST['id']."'";
          if(mysqli_query($sqlConn,$sqlSentence)) {
              echo "Eliminado registro ".$_REQUEST['id'];
          } else {
              echo "Fallo al eliminar ".$_REQUEST['id'].". Razón ".mysqli_error($sqlConn);
          }

		  $sqlSentence = "DELETE FROM Productosfacturas WHERE idfactura='".$_REQUEST['id']."'";
          if(mysqli_query($sqlConn,$sqlSentence)) {
              echo "Eliminado registro ".$_REQUEST['id'];
          } else {
              echo "Fallo al eliminar ".$_REQUEST['id'].". Razón ".mysqli_error($sqlConn);
          }
          break;
        }
        
     case "loadNum": {
      $sqlSentence = "SELECT idfactusu FROM facturas WHERE idfactusu like '".$_REQUEST['tipo']."%' order by idfactusu DESC limit 1";
      $alldata = mysqli_query($sqlConn,$sqlSentence);

      $clientes = array();
      foreach ($alldata as $datarow) {
        $specificData = array();
        foreach ($datarow as $clientData) {
         $specificData[] = substr(substr($clientData,1),0,-5)+1;
        }
      $clientes[] = $specificData;
      unset($specificData);
      }
      echo json_encode($clientes);      
  }
    }

  }
 else {
      $sqlSentence = "SELECT idfactusu FROM facturas order by idfactusu DESC ";
      $alldata = mysqli_query($sqlConn,$sqlSentence);

      $clientes = array();
      foreach ($alldata as $datarow) {
        $specificData = array();
        foreach ($datarow as $clientData) {
         $specificData[] = $clientData;
        }
      $clientes[] = $specificData;
      unset($specificData);
      }
      echo "{\"data\":".json_encode($clientes)."}";
  }

  mysqli_close($sqlConn);
?>

