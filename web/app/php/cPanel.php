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

    public function loadFromJson($jsonData) {


    }

    public function load($id) {

        $this->DAO->doLoad($id);
    }

    public function save() {

        return $this->DAO->doSave($this->_attribs);
    }



    public function getId(){

        return $this->_id;
    }
}