<?php

/*
 * Po nasadeni novej verzie a otestovani funkcnosti spustit toto.
 * Pospaja vsetky .min.js subory + prepise mena funkcii
 */

$inFilesExt = '.min.js';
$inDir = '../js-min/';
$outDir = '../js-min/';
$inFiles = [
    'trans',
    'app_constants',
    'cQP',
    'cPanel',
    'cHoleRect',
    'cHoleCirc',
    'prototypes',
    'app_exit',
    'app',
    'events'
];
$outFile = 'quickpanel.min'; // nema priponu .js lebo potom sa ho snazil ClosureCompiler zminifikovat a on uz minifikovany je
$fileSeparator = PHP_EOL . PHP_EOL . '// --------------------------------' . PHP_EOL;
//$fileSeparator = '';

$varsRename = new stdClass();

$functionsRename = new stdClass();



// spracovanie postupne vsetkych suborov
$fileWrite = fopen($outDir . $outFile, "wb");
if ($fileWrite){

    for ($i = 0; $i < count($inFiles); $i++){
        $obsahSuboru = file_get_contents($inDir . $inFiles[$i] . $inFilesExt);
        fwrite($fileWrite, $obsahSuboru . $fileSeparator);
    }

    fclose($fileWrite);
} else {
    die('Cant open file for writing: ' . $outFile);
}
