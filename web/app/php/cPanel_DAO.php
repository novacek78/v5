<?php

class Panel_DAO {

    /**
     * @param $attribs
     * @return bool|stdClass
     */
    public function doSave($attribs) {

        $returnObject = new stdClass();

        if (isset($attribs->id)) {
            $panelId = Db::$Db->real_escape_string($attribs->id);
        } else
            $panelId = null;

        $newPanel = empty($panelId);

        $keys = array();
        $vals = array();
        $pairs = array();

        foreach ($attribs as $key => $value){

            if (is_array($value)) continue; // preskocime zoznam featurov

            $key = Db::$Db->real_escape_string( str_replace('qp_', '', $key) );
            $value = '"' . Db::$Db->real_escape_string($value) . '"';

            if ($newPanel) {
                // bude to INSERT
                $keys[] = $key;
                $vals[] = $value;
            } else {
                // bude to UPDATE
                $pairs[] = $key . '=' . $value;
            }
        }

        Db::$Db->query("BEGIN");

        if ($newPanel){
            $result = Db::query("INSERT INTO qp2_panel (" . implode(',', $keys) . ") VALUES (" . implode(',', $vals) . ")");
            if ($result) {
                $result = Db::query("SELECT LAST_INSERT_ID() AS newid FROM qp2_panel");
                $row = $result->fetch_assoc();
                $panelId = $row['newid'];
            }
        } else {
            $pairs[] = 'last_modified=NOW()';
            $result = Db::query("UPDATE qp2_panel SET " . implode(',', $pairs) . " WHERE id=$panelId");
        }
        $returnObject->panelId = $panelId;

        if ( ! $result) {
            Db::query("ROLLBACK");
            Log::w('Chyba pri ukladani panela (chyba pri paneli samotnom):');
            Log::w($attribs);
            return false;
        }

        // este ulozime vsetky feature z panela
        if (isset($attribs->features) && is_array($attribs->features)){

            $returnObject->features = array();

            for ($i = 0; $i < count($attribs->features); $i++){

                $clientId = Db::$Db->real_escape_string($attribs->features[$i]['clientId']);
                $qpId = Db::$Db->real_escape_string($attribs->features[$i]['id']);
                $type = Db::$Db->real_escape_string($attribs->features[$i]['type']);
                $x = Db::$Db->real_escape_string($attribs->features[$i]['x']);
                $y = Db::$Db->real_escape_string($attribs->features[$i]['y']);
                $depth = Db::$Db->real_escape_string($attribs->features[$i]['depth']);

                // ak je to nova, tak INSERT, inak UPDATE
                $isNewFeature = ( ! isset($qpId) || ($qpId == -1));
                if ($isNewFeature) {
                    Db::query("INSERT INTO qp2_panelfeature (panel_id, type, x, y, depth) VALUES ($panelId, $type, $x, $y, $depth)");
                    $result = Db::query("SELECT LAST_INSERT_ID() AS lastid FROM qp2_panelfeature");
                    $row = $result->fetch_assoc();
                    $returnObject->features[$clientId] = $row['lastid'];
                } else {
                    $result = Db::query("UPDATE qp2_panelfeature SET x=$x, y=$y, depth=$depth WHERE id=$qpId");
                    $returnObject->features[$clientId] = $qpId;
                }

                if ( ! $result) {
                    Db::query("ROLLBACK");
                    Log::w('Chyba pri ukladani feature:');
                    Log::w($attribs->features[$i]);
                    return false;
                }
            }

            // vymazat z DB vsetky features, ktore sa uz na paneli nepouzivaju
            $keepFeatures = array();
            foreach ($returnObject->features as $value){
                $keepFeatures[] = $value;
            }
            $result = Db::query("DELETE FROM qp2_panelfeature WHERE panel_id=$panelId AND id NOT IN (" . implode(',', $keepFeatures) . ")");
            if ( ! $result) {
                Db::query("ROLLBACK");
                Log::w('Chyba pri mazani zvysnych features:');
                Log::w($keepFeatures);
                return false;
            }
        } // if (isset(features))

        Db::query("COMMIT");
        return $returnObject;
    }


    public function doLoad($id, $userId = null) {

        $id = Db::$Db->real_escape_string($id);

        if ( ! empty($id)) {
            $result = Db::query("SELECT * FROM qp2_panel WHERE id=$id");
            if ($result) {
                $data = $result->fetch_assoc();
                return $data;
            } else {
                return false;
            }
        } else {
            $userId = Db::$Db->real_escape_string($userId);
            $result = Db::query("SELECT *, GREATEST(IFNULL(created,0), IFNULL(last_modified,0)) AS cas FROM qp2_panel WHERE user_id=$userId ORDER BY cas DESC");
            if ($result) {
                $data = $result->fetch_assoc(); // zoberiem len prvy riadok - panel, s ktorym pracoval posledne
                return $data;
            } else {
                return false;
            }
        }
    }

}