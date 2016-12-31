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

        $id = $this->_Db->real_escape_string($attribs->qp_id);
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
                
            }
        } else {
            $pairs[] = 'last_modified=NOW()';
            $this->_Db->query("UPDATE qp2_panel SET " . implode(',', $pairs) . " WHERE id=$id");
        }
    }




}