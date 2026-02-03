<?php

    /*
    $DB_SET["db-type"] = "mysql";
    $DB_SET["db-hostname"] = "localhost";
    $DB_SET["db-username"] = "root";
    $DB_SET["db-password"] = "";
    $DB_SET["db-name"] = "asaidb";
    */

    $DB_SET["db-type"]= "mysql";
    $DB_SET["db-hostname"]= "sql202.epizy.com";
    $DB_SET["db-username"]= "epiz_25365282";
    $DB_SET["db-password"]= "XygFwLvKnc2CL79";
    $DB_SET["db-name"]= "epiz_25365282_portfolio_asai";

    $sqlConn = mysqli_connect($DB_SET["db-hostname"],$DB_SET["db-username"],$DB_SET["db-password"],$DB_SET["db-name"]);
    mysqli_query($sqlConn,"SET NAMES 'utf8'");

?>