<?php

$action = $_GET['ajax'];



switch ($action) {
    case 'saveLang': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {
            $User->setConfigValue('lang', $_GET['lang']);
        }
    } break;

    case 'savePanel': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {

            $Panel = new Panel();
            $Panel->loadFromArray($_POST);
            $resultId = $Panel->save();
            echo $resultId;
        }
    } break;

    case 'loadPanel': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {

            $Panel = new Panel();
            $Panel->load($_GET['id']);
            echo '';
        }
    } break;


}