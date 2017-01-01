<?php

class Panel_DAO {

    /**
     * @var mysqli
     */
    private $_Db;

    public function __construct(){

        $this->_Db = Db::getConnection();
    }

    public function doSave($attribs) {

        if (isset($attribs->id)) {
            $id = $this->_Db->real_escape_string($attribs->id);
        } else
            $id = null;

        $newPanel = empty($id);

        $keys = array();
        $vals = array();
        $pairs = array();

        foreach ($attribs as $key => $value){

            $key = $this->_Db->real_escape_string( str_replace('qp_', '', $key) );
            $value = '"' . $this->_Db->real_escape_string($value) . '"';

            if ($newPanel) {
                // bude to INSERT
                $keys[] = $key;
                $vals[] = $value;
            } else {
                // bude to UPDATE
                $pairs[] = $key . '=' . $value;
            }
        }

        if ($newPanel){
            if ($result = $this->_Db->query("INSERT INTO qp2_panel (" . implode(',', $keys) . ") VALUES (" . implode(',', $vals) . ")")){
                $result = $this->_Db->query("SELECT LAST_INSERT_ID() AS newid FROM qp2_panel");
                $row = $result->fetch_assoc();
                return $row['newid'];
            }
        } else {
            $pairs[] = 'last_modified=NOW()';
            $this->_Db->query("UPDATE qp2_panel SET " . implode(',', $pairs) . " WHERE id=$id");
            return $id;
        }
    }

    public function doLoad($id, $userId = null) {

        $id = $this->_Db->real_escape_string($id);

        if ( ! empty($id)) {
            $result = $this->_Db->query("SELECT * FROM qp2_panel WHERE id=$id");
            if ($result) {
                $data = $result->fetch_assoc();
                return $data;
            } else {
                return false;
            }
        } else {
            $userId = $this->_Db->real_escape_string($userId);
            $result = $this->_Db->query("SELECT *, GREATEST(IFNULL(created,0), IFNULL(last_modified,0)) AS cas FROM qp2_panel WHERE user_id=$userId ORDER BY cas DESC");
            if ($result) {
                $data = $result->fetch_assoc(); // zoberiem len prvy riadok - panel, s ktorym pracoval posledne
                return $data;
            } else {
                return false;
            }
        }
    }

}