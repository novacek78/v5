<?php


class Log {

    public static function w() {

        $args = func_get_args();
        $text = $args[0];

        if (count($args) > 1) {
            for ( $i = 1; $i < count($args); $i++) {
                $text = str_replace("%$i", $args[$i], $text);
            }
        }

        if (is_array($text))
            $text = var_export($text, true);

        error_log(date('H:i:s') . "   " . $text . PHP_EOL, 3, "logs/log.txt");
    }


}