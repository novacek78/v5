const TOOLBAR_HEIGHT = 60;
const STATUSBAR_FONT_SIZE = 30;

const COL_BACKGROUND = '#eee';
const COL_SURFACE_RAW = '#ccc';
const COL_SURFACE_ELOX_NATURAL = '#d0d0d0';
const COL_SURFACE_ELOX_BLACK = '#000';
const COL_FEATURE_POCKET = 'rgba(0,0,0,0.2)';
const COL_VALIDATE_ERROR_BGND = '#ffdddd';

const PANEL_WIDTH_MAX = 1000;
const PANEL_HEIGHT_MAX = 500;
const PANEL_THICKNESS_MAX = 10;

const ZAPICHY_PRIEMER = 1.5;
const ZAPICHY_OFFSET = 0.75;
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
