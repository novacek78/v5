<?php

/*
 * Po nasadeni novej verzie a otestovani funkcnosti spustit toto.
 * Pospaja vsetky .min.js subory + prepise mena funkcii
 */

$inDir = '../js-min/';
$outDir = '../js-min/';
$inFiles = [
    'app_constants.min.js',
    'cQP.min.js',
    'cPanel.min.js',
    'cHoleRect.min.js',
    'cHoleCirc.min.js',
    'prototypes.min.js',
    'app_exit.min.js',
    'app.min.js'
];
$outFile = 'quickpanel.min.js';

$varsRename = new stdClass();

$functionsRename = new stdClass();



// spracovanie postupne vsetkych suborov
$fileWrite = fopen($outDir . $outFile, "wb");
if ($fileWrite){

    for ($i = 0; $i < count($inFiles); $i++){
        $obsahSuboru = file_get_contents($inDir . $inFiles[$i]);
        fwrite($fileWrite, $obsahSuboru);
    }

    fclose($fileWrite);
} else {
    die('Cant open file for writing: ' . $outFile);
}
