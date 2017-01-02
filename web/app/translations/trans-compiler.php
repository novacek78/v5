<?php

/*
 * Po kazdej uprave prekladov v Poedit-e je potrebne spustit tento skript,
 * ktory rozparsuje .PO subory a vytvori z nich .JS subory s prelozenymi frazami.
 */

$dir = '.';
$inFilesExt = 'po';
$outFilesExt = 'js';
$inFiles = [];
$outFiles = [];



// do pola nacitame vsetky .PO subory
if ($dirHandle = opendir($dir)) {
    while (false !== ($entry = readdir($dirHandle))) {
        if ($entry != "." && $entry != "..") {
            if (pathinfo($entry, PATHINFO_EXTENSION) == $inFilesExt) {
                $inFiles[] = $entry;
                $outFiles[] = pathinfo($entry, PATHINFO_FILENAME) . '.' . $outFilesExt;
            }
        }
    }
    closedir($dirHandle);
}

// spracovanie postupne vsetkych suborov
for ($i = 0; $i < count($inFiles); $i++){
    $fileRead  = fopen($inFiles[$i], "r");
    $fileWrite = fopen($outFiles[$i], "wb");
    if ($fileRead) {
        if ($fileWrite){
            // zaciatok suboru - deklaracia premennych
            fwrite($fileWrite, 'var TheTrans_orig = [];' . PHP_EOL);
            fwrite($fileWrite, 'var TheTrans = [];' . PHP_EOL);
            fwrite($fileWrite, '' . PHP_EOL);

            $count = 0;
            while (($line = fgets($fileRead)) !== false) {
                // ak sme nasli riadok s frazou
                if ((strpos($line, 'msgid') === 0) && (trim($line) != 'msgid ""')) {

                    $txtOrig = str_replace(['msgid ','"'], '', trim($line));
                    $line = fgets($fileRead);
                    $txtTrans = str_replace(['msgstr ','"'], '', trim($line));

                    if ($txtTrans == '') {
                        // multiline preklad - dovtedy nacitava dlasie riadky, az kym nenatrafi na koniec = prazdny riadok
                        while (trim($line) != '') {
                            $line = fgets($fileRead);
                            $txtTrans .= str_replace('"', '', trim($line));
                        }
                    }

                    if ($txtTrans == '')
                        echo "Prazdny preklad pre frazu: " . $txtOrig . "<br>\n";

                    fwrite($fileWrite, "TheTrans_orig[$count] = '$txtOrig';" . PHP_EOL);
                    fwrite($fileWrite, "TheTrans[$count] = '$txtTrans';" . PHP_EOL);
                    $count++;
                }
            }
            fclose($fileWrite);
        } else {
            die('Cant open file for writing: ' . $outFiles[$i]);
        }
        fclose($fileRead);
    } else {
        die('Cant open file for reading: ' . $inFiles[$i]);
    }
}

// priklad vystupneho suboru:
/*

var TheTrans_orig = [];
var TheTrans = [];

TheTrans_orig[0] = '%1 objects';
TheTrans[0] = '%1 objektov';
TheTrans_orig[1] = 'Raw';
TheTrans[1] = 'Surový';
TheTrans_orig[2] = 'Silver';
TheTrans[2] = 'Strieborný';
TheTrans_orig[3] = 'Black';
TheTrans[3] = 'Čierny';



 */

