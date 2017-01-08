<?php

$action = $_GET['ajax'];


//Log::w("AJAX : $action");

switch ($action) {
    case 'saveLang': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {
            $User->setConfigValue('lang', $_GET['lang']);
        }
    } break;

    case 'sharePanel': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {
            $User->setConfigValue('lang', $_GET['lang']);

            $Panel = new Panel();
            $Panel->sharePanel($_GET['pid'], $_GET['type'], $_GET['enabled']);
        }
    } break;

    case 'savePanel': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {

            try {
                $Panel = new Panel($_POST);
                $resultObject = $Panel->save($User->getId());
                echo json_encode($resultObject);
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
    } break;

    case 'loadPanel': {
        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {

            try {
                $Panel = new Panel();
                if (isset($_GET['pid']))
                    $Panel->load($_GET['pid'], $User->getId());
                else
                    $Panel->loadLast($User->getId()); // ak nie je zadefinovane ID panela, nahra ten, s ktorym robil ako poslednym

                echo $Panel->makeJson();

            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
    } break;


}