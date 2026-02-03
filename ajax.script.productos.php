<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  if(isset($_REQUEST['action'])) {
     switch ($_REQUEST['action']) {
        case "delete": {
          //echo "¡Ha pasado por aqui el registro ".$_REQUEST['id']."!";
          $sqlSentence = "DELETE FROM productos WHERE id='".$_REQUEST['id']."'";
          if(mysqli_query($sqlConn,$sqlSentence)) {
              echo "Eliminado registro ".$_REQUEST['id'];
          } else {
              echo "Fallo al eliminar ".$_REQUEST['id'].". Razón ".mysqli_error($sqlConn);
          }
          break;
        }
        case "edit": {
          $editData = $_REQUEST['dataset'];
          $fieldList = array("nombre","tienda","almacen","precio","iva");
          $sqlSentence = "UPDATE productos SET ";
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
          $sqlSentence = "INSERT INTO productos (nombre,tienda,almacen,precio,iva) ";
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
              $sqlSentence = "SELECT * FROM productos order by id";
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
          } else {
              echo "Fallo al añadir registro. Razón ".mysqli_error($sqlConn);
          } 
          break;
        }
		 case "reload": {
		 	 $sqlSentence = "SELECT id,nombre,iva,precio FROM productos order by id";
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
 	}
    }

  }
 else {
      $sqlSentence = "SELECT * FROM productos order by id";
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
      echo "{\"data\":".json_encode($productos)."}";
  }

  mysqli_close($sqlConn);

?>

