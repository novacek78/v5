const TOOLBAR_HEIGHT = 60;
const STATUSBAR_FONT_SIZE = 30;

const COL_FEATURE_POCKET_MAXDEPTH = 130; // odtien sedej 0 .. 255
const COL_FEATURE_POCKET_MINDEPTH = 180; // odtien sedej 0 .. 255
const COL_VALIDATE_ERROR_BGND = '#ffdddd';

const PANEL_WIDTH_MAX = 500;
const PANEL_HEIGHT_MAX = 500;
const PANEL_THICKNESS_MAX = 10;
const PANEL_THICKNESS_AVAILABLE = [2,3,4,5,6,8,10];
const PANEL_THICKNESS_AVAILABLE_DESC = ['2 mm','3 mm','4 mm','5 mm','6 mm','8 mm','10 mm'];

const PANEL_SURFCOLOR_AVAILABLE = ['RAW','C0','C8','C31','C32','C33','C2','C3','C4','C40','C50','Red-B0'];
const PANEL_SURFCOLOR_AVAILABLE_DESC = ['Raw','Silver','Black','Bronze light','Bronze','Bronze dark','Gold light','Gold','Gold dark','Green','Blue','Red'];
const PANEL_SURFCOLOR_AVAILABLE_COL = ['#ccc','#c4c4c4','#000','#DAA520','#DAA520','#DAA520','#DAA520','#DAA520','#DAA520','Green','Blue','Red'];
const PANEL_SURFCOLOR_AVAILABLE_COLBGND = ['#eee','#eee','#eee','#eee','#eee','#eee','#eee','#eee','#eee','#eee','#eee','#eee'];

const ZAPICHY_PRIDAVOK = 2; // o kolko treba viac miesta pre kreslenie obdlznika so zapichmi

// umiestnenie "base pointu" pre kazdy objekt - ku ktoremu bodu sa vztahuje jeho poloha
// pri neobdlznikovych objektoch sa berie do uvahy obrysovy obdlznik
const BP_LEFTDOWN = 1;
const BP_MIDDLEDOWN = 12;
const BP_RIGHTDOWN = 2;
const BP_RIGHTMIDDLE = 23;
const BP_RIGHTUP = 3;
const BP_MIDDLEUP = 34;
const BP_LEFTUP = 4;
const BP_LEFTMIDDLE = 41;
const BP_CENTER = 5;

// typy ficrov podla systemu cislovania QP
const FT_PANEL = 1;
const FT_HOLE_CIRC = 10;
const FT_HOLE_RECT = 20;
