<?php

class Panel {

    /**
     * @var stdClass
     */
    private $_attribs;

    /**
     * @var Panel_DAO
     */
    private $DAO;

    public function __construct() {
        $this->DAO = new Panel_DAO();
        $this->_attribs = new stdClass();
    }

    public function loadFromArray($arrayData) {

       foreach ($arrayData as $key => $value) {
           $this->_attribs->$key = $value;
        }
    }

    public function makeJson() {
        return json_encode($this->_attribs);
    }

    public function load($id) {
        $this->_attribs = $this->DAO->doLoad($id);
    }

    public function loadLast($userId) {
        $result = $this->_attribs = $this->DAO->doLoad(null, $userId);
        return $result;
    }

    /**
     * @return bool|stdClass
     */
    public function save() {
        return $this->DAO->doSave($this->_attribs);
    }



    public function getId(){
        return $this->_id;
    }
}