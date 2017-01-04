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
            $resultObject = $Panel->save();
            echo json_encode($resultObject);
        }
    } break;

    case 'loadPanel': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {

            $Panel = new Panel();

            if (isset($_GET['id']))
                $Panel->load($_GET['id']);
            else
                $result = $Panel->loadLast($User->getId()); // ak nie je zadefinovane ID panela, nahra ten, s ktorym robil ako poslednym

            echo $Panel->makeJson();
        }
    } break;


}