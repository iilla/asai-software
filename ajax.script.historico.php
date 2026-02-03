<?php
  //header("Content-type: text/html; charset=UTF-8");
  header('Content-Type: application/json; Charset="UTF-8"');
  require('./config/dbconn.php');

  if(isset($_REQUEST['action'])) {

    $dataCatch = $_REQUEST['dataSend'];
    $sqlSentence = "UPDATE movimientos SET operacion='".$dataCatch[1]."',timestamp='".$dataCatch[2]."' WHERE id=".$dataCatch[0].";";
    if(mysqli_query($sqlConn,$sqlSentence)) {
      echo "Editado registro";
    } else {
      echo "Fallo al editar registro. Razón ".mysqli_error($sqlConn);
    }

  } else {
    //little modification: using left join (by Cyberwood)
    //$sqlSentence = "SELECT * FROM movimientos ORDER BY id";
    $sqlSentence = "SELECT m.id,f.idfactusu,m.idproducto,m.producto,m.operacion,m.actor,m.unidades,m.precio,m.total,m.timestamp 
                    FROM movimientos AS m LEFT JOIN facturas AS f ON m.idfact = f.id 
                    ORDER BY m.id DESC";

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

