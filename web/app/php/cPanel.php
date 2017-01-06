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

    /**
     * @param $id int Uzivatel, ktory chce nahrat panel
     * @param $loadingUser
     * @throws Exception
     * @return Panel
     */
    public function load($id, $loadingUser) {
        if ($loadingUser > 0) {
            $ownerId = $this->DAO->getPanelOwner($id);
            if ($ownerId != $loadingUser) {
                throw new Exception('User has no privileges to load this panel.');
            }
        }

        $this->_attribs = $this->DAO->doLoad($id);
        return $this;
    }

    public function loadLast($userId) {
        $this->_attribs = $this->DAO->doLoad(null, $userId);
    }

    /**
     * @param $savingUserId int Uzivatel, ktory sa pokusa panel ulozit
     * @throws Exception
     * @return bool|stdClass
     */
    public function save($savingUserId) {

        if (isset($this->_attribs->id)) {
            $ownerId = $this->DAO->getPanelOwner($this->_attribs->id);
            if ($ownerId != $savingUserId) {
                throw new Exception('User has no privileges to save this panel.');
            }
        }

        return $this->DAO->doSave($this->_attribs);
    }

    public function sharePanel($panelId, $type, $sharingEnabled) {
        return $this->DAO->doSharePanel($panelId, $type, $sharingEnabled);
    }

}