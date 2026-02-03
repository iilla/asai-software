<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  function truncateFloat($number, $digitos) {
    $raiz = 10;
    $multiplicador = pow ($raiz,$digitos);
    $resultado = ((int)($number * $multiplicador)) / $multiplicador;
    return number_format($resultado, $digitos);
  }  

  if(isset($_REQUEST['action'])) {
       switch ($_REQUEST['action']) {
          case "stockIn": {
            $stockData = $_REQUEST['dataset'];
            //Tomamos datos del producto
            $sqlSentence = "SELECT * FROM productos WHERE id=".$stockData[0];
            $productData = mysqli_query($sqlConn,$sqlSentence);
            $productData = mysqli_fetch_row($productData);

            //Generamos los valores para la tabla de gastos y los introducimos
            $currentTime = new DateTime('NOW');
            $currentTime->add(new DateInterval('PT6H'));
            $currentTime = $currentTime->format('Y-m-d H:i:s');
            $ivaRelation = truncateFloat(($stockData[3]*$stockData[4])/100,2);
            $unidades = $stockData[1]+$stockData[2];

            if ($unidades>=1) {
              //Insertamos en base de datos los nuevos datos de producto, movimientos y suma de productos al stock
              //MOVIMIENTOS
              $sqlSentence = "INSERT INTO movimientos (idproducto,producto,operacion,actor,unidades,precio,total,timestamp)";
              $sqlSentence .= "VALUES ('".$productData[0]."','".$productData[1]."','entrada de stock','".$stockData[5]."',".$unidades.",".$stockData[3].",".(($stockData[3]+$ivaRelation)*$unidades).",'".$currentTime."')";
                //INSERT INTO movimientos (idproducto,producto,operacion,actor,unidades,precio,total,timestamp)VALUES ('3','Açaí 3,6L','entrada de stock','sample',3,10.00,33,'2024-04-13 04:29:18')
              $resultLog = "";
              if(mysqli_query($sqlConn,$sqlSentence)) {
                $resultLog .= "Registro con éxito en tabla movimientos.<br />"; 
              } else {
                $resultLog .= "Fracaso al registrar en tabla movimientos: ".mysqli_error($sqlConn)."<br />";
                //echo $sqlSentence;       
              }

              //PRODUCTOS
              $sqlSentence = "UPDATE productos SET tienda=".($stockData[1]+$productData[2]).",almacen=".($stockData[2]+$productData[3])." WHERE id=".$productData[0];
              if(mysqli_query($sqlConn,$sqlSentence)) {
                $resultLog .= "Registro con éxito en tabla productos.<br />"; 
              } else {
                $resultLog .= "Fracaso al registrar en tabla productos: ".mysqli_error($sqlConn)."<br />";
              }

              //GASTOS
              $sqlSentence = "INSERT INTO gastos (concepto,baseimp,iva,total,timestamp)";
              $sqlSentence .= "VALUES ('Entrada de ".($unidades)." unidades de ".$productData[1]."',".($stockData[3]*$unidades).",".$stockData[4].",".(($stockData[3]+$ivaRelation)*$unidades).",'".$currentTime."')";
              if(mysqli_query($sqlConn,$sqlSentence)) {
                $resultLog .= "Registro con éxito en tabla gastos.<br />"; 
              } else {
                $resultLog .= "Fracaso al registrar en tabla gastos: ".mysqli_error($sqlConn)."<br />";
              }
            } else {
              if ($unidades<0) {
                  //PRODUCTOS
                  $sqlSentence = "UPDATE productos SET tienda=".($stockData[1]+$productData[2]).",almacen=".($stockData[2]+$productData[3])." WHERE id=".$productData[0];
                  if(mysqli_query($sqlConn,$sqlSentence)) {
                    $resultLog .= "Registro con éxito en tabla productos.<br />"; 
                  } else {
                    $resultLog .= "Fracaso al registrar en tabla productos: ".mysqli_error($sqlConn)."<br />";
                  }  

                  //MOVIMIENTOS
                  $sqlSentence = "INSERT INTO movimientos (idproducto,producto,operacion,actor,unidades,precio,total,timestamp)";
                  $sqlSentence .= "VALUES ('".$productData[0]."','".$productData[1]."','corrección de stock','".$stockData[5]."',".$unidades.",".$stockData[3].",".(($stockData[3]+$ivaRelation)*$unidades).",'".$currentTime."')";

                  $resultLog = "";
                  if(mysqli_query($sqlConn,$sqlSentence)) {
                    $resultLog .= "Registro con éxito en tabla movimientos.<br />"; 
                  } else {
                    $resultLog .= "Fracaso al registrar en tabla movimientos: ".mysqli_error($sqlConn)."<br />";
                    //echo $sqlSentence;       
                  }

                  //GASTOS
                  $sqlSentence = "INSERT INTO gastos (concepto,baseimp,iva,total,timestamp)";
                  $sqlSentence .= "VALUES ('Corrección de Stock de ".($unidades)." unidades de ".$productData[1]."',".($stockData[3]*$unidades).",".$stockData[4].",".(($stockData[3]+$ivaRelation)*$unidades).",'".$currentTime."')";
                  if(mysqli_query($sqlConn,$sqlSentence)) {
                    $resultLog .= "Registro con éxito en tabla gastos.<br />"; 
                  } else {
                    $resultLog .= "Fracaso al registrar en tabla gastos: ".mysqli_error($sqlConn)."<br />";
                  }
              } else {
                  $resultLog .= "No hay productos que introducir.<br />";
              }
            }
            echo $resultLog;
            break;
      }
      case "stockSwap": {
          $productData = $_REQUEST['dataset'];
          $sqlSentence = "UPDATE productos SET tienda=".$productData[1].",almacen=".$productData[2]." WHERE id=".$productData[0];

          if(mysqli_query($sqlConn,$sqlSentence)) {
            echo "Registro con éxito en tabla productos.<br />"; 
          } else {
            echo "Fracaso al registrar en tabla productos: ".mysqli_error($sqlConn)."<br />";
          }   
          break;    
      }
      case "stockPrices": {
          $productData = $_REQUEST['dataset'];
          $sqlSentence = "UPDATE productos SET precio=".$productData[2].",preciocompra=".$productData[1]." WHERE id=".$productData[0];

          if(mysqli_query($sqlConn,$sqlSentence)) {
            echo "Registro con éxito en tabla productos.<br />"; 
          } else {
            echo "Fracaso al registrar en tabla productos: ".mysqli_error($sqlConn)."<br />";
          }   
          break;    
      }      
    }
  } else {
      $sqlSentence = "SELECT * FROM productos";
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

  /*$clientes = array();
  foreach ($alldata as $datarow) {
    $specificData = array();
    foreach ($datarow as $clientData) {
      $specificData[] = $clientData;
    }
    $clientes[] = $specificData;
    unset($specificData);
  }*/

  //var_dump($alldata);

  /*$miArray = array(1,4,6,8,3,34.8,9,43);
  $miArray = array("manzana"=>"verde", "uva"=>"Morada", "fresa"=>"roja");*/

  /*var_dump(json_encode($clientes[4]));
	var_dump($clientes[4]);*/

  //var_dump(json_encode($clientes));
  //var_dump($clientes);

  /*echo "sample1:".htmlentities("hóóóolàààààquééeéaññ");
  echo "sample2:".htmlentities("hóóóolàààààquééeéa");*/

/*[["1","Juan","45645656T","C\/ Juan","08080","Juan\u00e8lona","Juespa\u00f1a","938768787","juan@juan.com","hodor"],
    ["2","Pepe","45645645U","c\/ pepe","08080","pepelona","pepespa?a","934569898","pepe@pepe.pep","hodor"],
    ["3","Alba","45689894R","c\/Alba ","089090","Albarcelona","Alspa?a","984985998","alba@alba.alb","asdasd"],
    ["4","Guti","47788978G","c\/ Guti 20","087898","Gutilona","Gutispa?a","9893498989","Guti@guti.errez","lol"],
    ["5","Manfred","47788978G","c\/ Manfredo 20","087898","Manfredgrado","Manfredslovaquia","9893498989","man@fred.lol","xD"],
    ["6","Karl","45645786T","C\/ Karlsson","48080","Karlsovia","Karlspa?a","938790787","karl@karkar.kar","hodor"],
    ["7","Federico","45612394R","c\/Fede 99 ","089096","Fedelona","Fedinbuirgo","984985995","fed@fed.me","babuino"]]*/

/*echo "\"data\": [
      [
        \"Tiger Nixon',
        \"System Architect',
        \"Edinburgh',
        \"5421',
        '2011/04/25',
        '$320,800'
      ],
      [
        'Garrett Winters',
        'Accountant',
        'Tokyo',
        '8422',
        '2011/07/25',
        '$170,750'
      ]
    ]";*/
 /*INSERT INTO `clientes`(`nombre`, `nif`, `direccion`, `cp`, `poblacion`, `pais`, `telefono`, `email`, `observaciones`) 
VALUES ('Karl','56789456Y','C/Ciprés','08987','NeverWinter','Nights','987678787','karl@gmail.com','None'),
('Godofredo','4665656T','C/ Juan','08080','Juanèlona','Juespaña','938768787','juan@juan.com','hodor'),
('BillPuertas','4665656T','C/ Golden','08080','Millionland','cash','958568787','bill@gates.com','nothing to say'),
('Bulma','4665656T','C/ Vila del pingüí','08084','Techno','Ska','9386878787','bila@bulam.com','blablaalbal'),
('Gogeta','4664567T','C/ Búúúàààñota','08580','Ninguna','inderetminado','938768237','gogeta@gol.lol','fuckyou'),
('Ken','4665656T','C/ Barbie','18080','Barbieland','Pinknelona','938768567','ken@ryu.com','fucsia'),
('HODOR','HODOR','C/ HODOR','HODOR','HODOR','HODOR','HODOR','HODOR@HODOR.HODOR','HODOR'),
('sampleman','4455656T','C/ sample','08085','váter','ñoñolàndïa','938768787','sampletext@sample.cof','àèìòùáéíóúñ|@#~½¬{[]!'),
('Juan','45645656T','C/ Juan','08080','Juanèlona','Juespaña','938768787','juan@juan.com','hodor'),
('Pepe','45645645U','c/ pepe','08080','pepelona','pepespa?a','934569898','pepe@pepe.pep','hodor'),
('Alba','45689894R','c/Alba','089090','Albarcelona','Alspa?a','984985998','alba@alba.alb','asdasd'),
('Guti','47788978G','c/ Guti 20','087898','Gutilona','Gutispa?a','9893498989','Guti@guti.errez','lol'),

('Manfred','47788978G','c/ Manfredo 20','087898','Manfredgrado','Manfredslovaquia','9893498989','man@fred.lol','xD'),
('Karl','45645786T','C/ Karlsson','48080','Karlsovia','Karlspa?a','938790787','karl@karkar.kar','hodor'),
('Federico','45612394R','c/Fede 99','089096','Fedelona','Fedinbuirgo','984985995','fed@fed.me','babuino'),
('Karl','56789456Y','C/Ciprés','08987','NeverWinter','Nights','987678787','karl@gmail.com','None')*/
?>

