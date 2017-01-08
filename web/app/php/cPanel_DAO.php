<?php

class Panel_DAO {



    /**
     * @param $attribs
     * @return bool|stdClass
     */
    public function doSave($attribs) {

        $returnObject = new stdClass();

        if (isset($attribs->id)) {
            $panel_id = Db::escape($attribs->id);
        } else
            $panel_id = null;

        $newPanel = empty($panel_id);

        $keys = array();
        $vals = array();
        $pairs = array();

        foreach ($attribs as $key => $value){

            if (is_array($value)) continue; // preskocime zoznam featurov

            $key = Db::escape( str_replace('qp_', '', $key) );
            $value = '"' . Db::escape($value) . '"';

            if ($newPanel) {
                // bude to INSERT
                $keys[] = $key;
                $vals[] = $value;
            } else {
                // bude to UPDATE
                if ($key != 'user_id') // vlastnik panela sa nemoze zmenit, toho neupdatujeme
                    $pairs[] = $key . '=' . $value;
            }
        }

        Db::$Db->query("BEGIN");

        if ($newPanel){
            $result = Db::query("INSERT INTO qp2_panel (" . implode(',', $keys) . ") VALUES (" . implode(',', $vals) . ")");
            if ($result) {
                $result = Db::query("SELECT LAST_INSERT_ID() AS newid FROM qp2_panel");
                $row = $result->fetch_assoc();
                $panel_id = $row['newid'];
            }
        } else {
            $pairs[] = 'last_modified=NOW()';
            $result = Db::query("UPDATE qp2_panel SET " . implode(',', $pairs) . " WHERE id=$panel_id");
        }
        $returnObject->panelId = $panel_id;

        if ( ! $result) {
            Db::query("ROLLBACK");
            Log::w('Chyba pri ukladani panela (chyba pri paneli samotnom):');
            Log::w($attribs);
            return false;
        }

        // este ulozime vsetky feature z panela
        $feaAttribs = array();
        if (isset($attribs->features) && is_array($attribs->features)){

            $returnObject->features = array();

            for ($i = 0; $i < count($attribs->features); $i++){

                $feaAttribs['panel_id'] = $panel_id;
                $feaAttribs['type'] = Db::escape($attribs->features[$i]['type']);
                $feaAttribs['x'] = Db::escape($attribs->features[$i]['x']);
                $feaAttribs['y'] = Db::escape($attribs->features[$i]['y']);
                $feaAttribs['depth'] = Db::escape(isset($attribs->features[$i]['depth']) ? $attribs->features[$i]['depth'] : 'null');
                $feaAttribs['is_anodised'] = Db::escape(isset($attribs->features[$i]['is_anodised']) ? $attribs->features[$i]['is_anodised'] : '1');
                $feaAttribs['angle'] = Db::escape(isset($attribs->features[$i]['angle']) ? $attribs->features[$i]['angle'] : 'null');
                $feaAttribs['size1'] = Db::escape(isset($attribs->features[$i]['size1']) ? $attribs->features[$i]['size1'] : 'null');
                $feaAttribs['size2'] = Db::escape(isset($attribs->features[$i]['size2']) ? $attribs->features[$i]['size2'] : 'null');
                $feaAttribs['size3'] = Db::escape(isset($attribs->features[$i]['size3']) ? $attribs->features[$i]['size3'] : 'null');
                $feaAttribs['size4'] = Db::escape(isset($attribs->features[$i]['size4']) ? $attribs->features[$i]['size4'] : 'null');
                $feaAttribs['param1'] = Db::escape(isset($attribs->features[$i]['param1']) ? "'" . $attribs->features[$i]['param1'] . "'" : 'null');
                $feaAttribs['param2'] = Db::escape(isset($attribs->features[$i]['param2']) ? "'" . $attribs->features[$i]['param2'] . "'" : 'null');
                $feaAttribs['param3'] = Db::escape(isset($attribs->features[$i]['param3']) ? "'" . $attribs->features[$i]['param3'] . "'" : 'null');
                $feaAttribs['param4'] = Db::escape(isset($attribs->features[$i]['param4']) ? "'" . $attribs->features[$i]['param4'] . "'" : 'null');

                $clientId = Db::escape($attribs->features[$i]['clientId']);
                $qpId = Db::escape($attribs->features[$i]['id']);

                // ak je to nova, tak INSERT, inak UPDATE
                $isNewFeature = ( ! isset($qpId) || ($qpId == -1));
                if ($isNewFeature) {

                    $keys = array();
                    $vals = array();
                    foreach ($feaAttribs as $key => $value) {
                        $keys[] = $key;
                        $vals[] = $value;
                    }

                    Db::query("INSERT INTO qp2_panelfeature (".implode(',', $keys).") VALUES (".implode(',', $vals).")");
                    $result = Db::query("SELECT LAST_INSERT_ID() AS lastid FROM qp2_panelfeature");
                    $row = $result->fetch_assoc();
                    $returnObject->features[$clientId] = $row['lastid'];

                } else {

                    $pairs = array();
                    foreach ($feaAttribs as $key => $value) {
                        $pairs[] = $key . '=' . $value;
                    }

                    $result = Db::query("UPDATE qp2_panelfeature SET ".implode(',', $pairs)." WHERE id=$qpId");
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
            $result = Db::query("DELETE FROM qp2_panelfeature WHERE panel_id=$panel_id AND id NOT IN (" . implode(',', $keepFeatures) . ")");
            if ( ! $result) {
                Db::query("ROLLBACK");
                Log::w('Chyba pri mazani zvysnych features:');
                Log::w($keepFeatures);
                return false;
            }
        } // if (isset(features))
        else {
            // ak neprisli ziadne features k panelu, tak ak su nejake v DB, tak ich zmazeme
            Db::query("DELETE FROM qp2_panelfeature WHERE panel_id=$panel_id");
        }

        Db::query("COMMIT");
        return $returnObject;
    }

    public function doLoad($panelId, $userId = null) {

        $panelId = Db::escape($panelId);
        $userId = Db::escape($userId);

        if (( $panelId == '') || ($panelId == null)) {
            // nemame ID - nahrame posledne upraveny panel daneho usera
            $result = Db::query("SELECT *, GREATEST(IFNULL(created,0), IFNULL(last_modified,0)) AS cas FROM qp2_panel WHERE user_id=$userId ORDER BY cas DESC LIMIT 1");
        } else {
            $result = Db::query("SELECT * FROM qp2_panel WHERE id=$panelId");
        }

        if ($result && ($result->num_rows > 0)) {
            $returnObject = $result->fetch_object();
        } else {
            return false;
        }

        // este nahrame jeho features
        $result = Db::query("SELECT * FROM qp2_panelfeature WHERE panel_id=" . $returnObject->id);
        if ($result){
            $features = array();
            while ($feature = $result->fetch_object())
                $features[] = $feature;
            $returnObject->features = $features;
        } else {
            return false;
        }

        return $returnObject;
    }

    public function doSharePanel($panelId, $type, $sharingEnabled) {
    }

    public function getPanelOwner($panelId) {

        $panelId = Db::escape($panelId);

        $result = Db::query("SELECT user_id FROM qp2_panel WHERE id=$panelId");
        if ($result) {
            $row = $result->fetch_assoc();
            return $row['user_id'];
        } else {
            return false;
        }
    }



}