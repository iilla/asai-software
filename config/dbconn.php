<?php

    $DB_SET["db-type"] = "mysql";
    $DB_SET["db-hostname"] = "localhost";
    $DB_SET["db-username"] = "root";
    $DB_SET["db-password"] = "";
    $DB_SET["db-name"] = "database-name";

    $sqlConn = mysqli_connect($DB_SET["db-hostname"],$DB_SET["db-username"],$DB_SET["db-password"],$DB_SET["db-name"]);
    mysqli_query($sqlConn,"SET NAMES 'utf8'");

?>
