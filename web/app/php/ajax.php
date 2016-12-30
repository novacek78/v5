<?php

$action = $_GET['ajax'];



switch ($action) {
    case 'saveLang': {

        $User = new User();
        if ($User->loginAnonymousUser($_GET['uid'], $_GET['secure'])) {
            $User->setConfigValue('lang', $_GET['lang']);
        }
    }
}