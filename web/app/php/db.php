<?php
realpath('.');

/**
 * @return mysqli
 */
function dbConnect(){
//TODO oddelit prihlasovacie udaje niekam a rozdelit na lokalne a produkcne
    $servername = "localhost";
    $username = "root";
    $password = "";

    // Create connection
    $Db = new mysqli($servername, $username, $password);

    // Check connection
    if ($Db->connect_error) {
        die("Connection failed: " . $Db->connect_error);
    }

    // Select database
    $Db->select_db("quickpanel");

    return $Db;
}

function saveStatistics($key, $value){
    $Db = dbConnect();
    $Db->query("INSERT INTO qp2_stat VALUES(NULL, '$key', '$value')");
}
