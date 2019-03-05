<?php
//$location: stores data in country -> state -> city array structure.
    $location = array(
        "India" => array(
            "Gujarat" => array("Amd","Anand","Vadodara"),
            "Rajasthan" => array("Ajmer","Baran", "Dausa"),
            "Mumbai" => array("Nashik","Solapur","Dhule")
        ),
        "Australia" => array(
            "Queensland" => array("Sydney","Albury","Broken Hill"),
            "Tasmania" => array("Grafton","Lithgow", "Liverpool"),
            "Victoria" => array("Orange","Penrith","Tamworth")
        ),
        "Nepal" => array(
            "Bhojpur" => array("Kathmandu","Pokhara","Lalitpur"),
            "Jhapa" => array("Birgunj","Kaski","Chitwan"),
            "Khotang" => array("Janakpur","Ghorahi","Tulsipur")
        )
    );

    $response;
    // checking if query variable exists and then sending response converting in JSON format.
    if( isset($_GET["country"]) &&  !isset($_GET["state"])) {
        $response = array_keys($location[$_GET["country"]]);
    }else if ( isset($_GET["country"]) &&  isset($_GET["state"])) { 
        $response = $location[$_GET["country"]][$_GET["state"]];
    }else {
        $response = array_keys($location);
    }

    echo json_encode($response);
?>