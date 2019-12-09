// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}

// Helper function for checking is the object on platform
function onPlatform(position, size) {

    var platforms = document.getElementById("platforms");

    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (intersect(position, size, new Point(x, y), new Size(w, h)))
            return false;
    }

    return true;
}

// Helper function for checking if player is on the disappear platform
function onDisappearPlatform(position, motion, size) {
    
    for (var i = 0; i < DISAPPEAR_PLATFORM_NUM; i++) {
        
        var platform = document.getElementById("disappear_platform" + i);

        if (platform == null)
            continue;

        var x = parseFloat(platform.getAttribute("x"));
        var y = parseFloat(platform.getAttribute("y"));
        var w = parseFloat(platform.getAttribute("width"));
        var h = parseFloat(platform.getAttribute("height"));

        if (((position.x + size.w > x && position.x < x + w) ||
             ((position.x + size.w) == x && motion == motionType.RIGHT) ||
             (position.x == (x + w) && motion == motionType.LEFT)) &&
            (position.y + size.h == y)) {
                platform.setAttribute("opacity", parseFloat(platform.getAttribute("opacity")) - DISAPPEAR_PLATFORM_INTERVAL);
        }
    }  

}

// Helper function for checing is the object on vertical platform
function onVerticalPlatform(position, motion, size) {

    var vertical_platform = document.getElementById("vertical_platform");

    var x = parseFloat(vertical_platform.getAttribute("x"));
    var y = parseFloat(vertical_platform.getAttribute("y"));
    var w = parseFloat(vertical_platform.getAttribute("width"));
    var h = parseFloat(vertical_platform.getAttribute("height"));

    return (((position.x + size.w > x && position.x < x + w) ||
         ((position.x + size.w) == x && motion == motionType.RIGHT) ||
         (position.x == (x + w) && motion == motionType.LEFT)) && 
         (position.y <= y - size.h + 2 && position.y >= y - 1.2 * size.h));
}

// The player class used in this program
function Player() {
    this.node = document.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnPlatform = function() {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        if (parseFloat(node.getAttribute("opacity")) <= 0) continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            (this.position.y + PLAYER_SIZE.h == y) || onVerticalPlatform(player.position, player.motion, PLAYER_SIZE)) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        if (parseFloat(node.getAttribute("opacity")) <= 0) continue;
        if (onVerticalPlatform(player.position, player.motion,PLAYER_SIZE)) continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 0);     // The initial position of the player
var FACE_RIGHT = true;                      // The boolean to indicate is the player facing right

var MOVE_LEFT = "A";                        // The key to move the player left
var MOVE_RIGHT = "D";                       // The key to move the player right
var MOVE_UP = "W";                          // The key to move the player up
var MOVE_SHOOT = "H";                       // The key to shoot the bullet
var MOVE_EN_CHEAT = "C";                    // The key to enter cheat mode
var MOVE_DIS_CHEAT = "V";                   // The key to leave cheat mode

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var BULLET_SIZE = new Size(10, 10);         // The size of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet = pixels it moves each game loop
var BULLET_NUM = 8;                         // The remaining number of bullets
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canPlayerShoot = true;                  // A flag indicating whether the player can shoot a bullet

var NOTE_SIZE = new Size(40, 40);           // The size of a note
var NOTE_NUM = 8;                           // The number of note in the game

var EXIT_SIZE = new Size(40, 40);           // The size of the exit
var EXIT_POSITION = new Point(560, 520 - EXIT_SIZE.h / 2); // The position of the exit

var PORTAL_SIZE = new Size(40, 40);         // The size of the portal_size
var PORTAL_A_POSITION = new Point(0, 180);  // The position of portal A
var PORTAL_B_POSITION = new Point(0, 440);  // The position of portal B
var canTeleport = true;                     // A flag indicating whether the plater can teleport through a portal
var TELEPORT_INTERVAL = 1000.0              // The period when teleporting is disabled

var VERTICAL_PLATFORM_UP = true;            // The direction of the vertical platform
var VERTICAL_PLATFORM_SPEED = 1;            // The speed of vertical platform
var DISAPPEAR_PLATFORM_INTERVAL = 0.05;     // The time to disapear the platform
var DISAPPEAR_PLATFORM_NUM = 3;             // The number of disappearing platform

var MONSTER_SIZE = new Size(40, 40);        // The size of a monster
var MONSTER_NUM = 6;                        // The number of monster at the beginning
var MONSTER_SPEED = 1;                      // The speed of monsters
var MONSTER_LOC = new Array();              // Store the destination of each monster
var MONSTER_DIR = new Array();              // Store the facing directions of each monster
var canMonsterShoot = true;                 // Ensure there is only one special bullet in the game
var special_alive = true;                   // Store is the special monster alive

var score = 0;                              // The score of the game
var name = "";                              // The name of the player
var GAME_INTERVAL = 25;                     // The time interval of running the game
var TIME_INIT = 100;                        // The initial time of the game
var TIME_REMAINING = TIME_INIT;             // The remaining time of the game
var LEVEL = 1;                              // The level in the current game
var CHEAT_MODE = false;                     // Indicate is the player in cheat mode or not

var SCORE_MONSTER = 10;                     // The score player gets for killing one monster
var SCORE_GOOD = 20;                        // The score player gets for touching one good thing
var SCORE_LEVEL = 100;              // The score player gets for entering the next level
var SCORE_TIME = 1;                         // The score player gets for each second of time remaining

// Start page information
var START_INFO = new Array("You are a student at HKUST. You need to reach ",
                 "graduation before the time runs out with the highest ", 
                 "GPA and the least time possible. Collect all the notes ", 
                 "to boost your GPA and open the gate for graduation. ", 
                 "But be careful for terrible friends, touching them will ", 
                 "result in expelling. You can get rid of them by sending ",  
                 "them bullet-like rejections. Use A to move left, D to ", 
                 "move right, W to jump and H to send rejections. ");

//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var player = null;                          // The player object
var gameInterval = null;                    // The interval
var timeInterval = null;                    // The time reminaing
var zoom = 1.0;                             // The zoom level of the screen
var isASV = false;                          // Check what is the svg viewer
var isFF = false;                           // Check what is the svg viewer


// Should be executed after the page is loaded
function load() {
    // Attach keyboard events
    // document.addEventListener("keydown", keydown, false);
    // document.addEventListener("keyup", keyup, false);

    // Start the game interval
    // gameInterval = setInterval("gamePlay()", GAME_INTERVAL);

    isASV = (window.navigator.appName == "Adobe SVG Viewer");
    isFF = (window.navigator.appName == "Netscape");

    // Add information to the start page
    for (var i = 0; i < START_INFO.length; i++) {

        var node = document.getElementById("startinfo");
        var info = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        
        info.setAttribute("x", 50);
        info.setAttribute("dy", 40);
        info.appendChild(document.createTextNode(START_INFO[i]));
        node.appendChild(info);
    }

    // Create the player
    player = new Player();
    
    // Create monsters
    for (var i = 0; i < MONSTER_NUM; i++) {
        var location = new Point(Math.floor(Math.random() * 460) + 101, Math.floor(Math.random() * 420) + 101);
        createMonster(location.x, location.y);
        MONSTER_LOC.push(location);
        MONSTER_DIR.push(true);
    }
    
    // Create special monster
    var special_location = new Point(Math.floor(Math.random() * 460) + 101, Math.floor(Math.random() * 420) + 101);
    createSpecialMonster(special_location.x, special_location.y);
    MONSTER_LOC.push(special_location)
    MONSTER_DIR.push(true);
    
    // Create portal
    createPortal(PORTAL_A_POSITION.x, PORTAL_A_POSITION.y)
    createPortal(PORTAL_B_POSITION.x, PORTAL_B_POSITION.y)
    
    // Create notes
    for (var i = 0; i < NOTE_NUM; i++) {
        
        var location = new Point(Math.floor(Math.random() * 560) + 1, Math.floor(Math.random() * 520) + 1);
        
        while (!onPlatform(location, NOTE_SIZE))
        location = new Point(Math.floor(Math.random() * 560) + 1, Math.floor(Math.random() * 520) + 1);
        
        createNote(location.x, location.y);
    }

    
    // Ask the name of user
    if (LEVEL == 1) {
        this.name = prompt("Please enter your name", this.name);
        if (this.name == "null" || this.name == "")   
        this.name = "Anonymous";
    }   
    document.getElementById("player_name").appendChild(document.createTextNode(this.name));
}

function playsnd(id) {
    if (isASV) {
        var snd = document.getElementById(id + "_asv");
        snd.endElement();
        snd.beginElement();
    }
    if (isFF) {
        var snd = document.getElementById(id);
        snd.currentTime = 0;
        snd.play();
    }
}

//
// This is the function to create monster in the position of x and y
//
function createMonster(x, y) {

    var monster = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("monsters").appendChild(monster);

    monster.setAttribute("x", x);
    monster.setAttribute("y", y);

    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
}

// This is the function to create special monster in the position of x and y
function createSpecialMonster(x, y) {

    var special_monster = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("monsters").appendChild(special_monster);

    special_monster.setAttribute("x", x);
    special_monster.setAttribute("y", y);

    special_monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#special_monster");
}

//This is the function to create notes in the position of x and y
function createNote(x, y) {

    var note = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("notes").appendChild(note);

    note.setAttribute("x", x);
    note.setAttribute("y", y);

    note.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#note");
}

// This is the function to create exit in the position of x and y
function createExit(x, y) {

    var exit = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("exit_point").appendChild(exit);

    exit.setAttribute("x", x);
    exit.setAttribute("y", y);

    exit.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#exit");    
}

// This is the function to create portals in the position of x and y
function createPortal(x, y) {

    var portal = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("portals").appendChild(portal);

    portal.setAttribute("x", x);
    portal.setAttribute("y", y);

    portal.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#portal"); 
}

//
// This is the function to shoot bullet
//
function shootBullet() {

    playsnd("shoot");
    canPlayerShoot = false;
    BULLET_NUM -= 1;
    document.getElementById("bullet_num").firstChild.data = BULLET_NUM;
    setTimeout("canPlayerShoot = true", SHOOT_INTERVAL);

    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("bullets").appendChild(bullet);
    
    if (FACE_RIGHT)
        bullet.setAttribute("stroke-width", 0);
    else 
        bullet.setAttribute("stroke-width", 1);

    bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w/2 - BULLET_SIZE.w/2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h/2 - BULLET_SIZE.h/2);

    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
}

// This is the function to shoot special_bullet
function shootSpecialBullet(face_right, position) {

    canMonsterShoot = false;

    var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
    document.getElementById("bullets").appendChild(bullet);

    if (face_right)
        bullet.setAttribute("stroke-width", 0);
    else 
        bullet.setAttribute("stroke-width", 1);

    bullet.setAttribute("stroke", "green");
    bullet.setAttribute("x", position.x + MONSTER_SIZE.w/2 - BULLET_SIZE.w/2);
    bullet.setAttribute("y", position.y + MONSTER_SIZE.h/2 - BULLET_SIZE.h/2);

    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#special_bullet");
}


//
// This is the function to move the bullets
//
function moveBullets() {

    var bullet = document.getElementById("bullets");

    for (var i = 0; i < bullet.childNodes.length; i++) {

        var node = bullet.childNodes.item(i);
        
        if (parseInt(node.getAttribute("x")) + BULLET_SPEED > SCREEN_SIZE.w || parseInt(node.getAttribute("x")) - BULLET_SPEED < 0) {
            if (node.getAttribute("stroke") == "green" && special_alive)
                canMonsterShoot = true;
            bullet.removeChild(node);
            i--;
        }
        else 
            if (node.getAttribute("stroke-width") == 0)
                node.setAttribute("x", parseInt(node.getAttribute("x")) + BULLET_SPEED);
            else 
                node.setAttribute("x", parseInt(node.getAttribute("x")) - BULLET_SPEED);
    }
}

// This is the function to randomly move the monsters
function moveMonsters() {

    var monster = document.getElementById("monsters");

    for (var i = 0; i < monster.childNodes.length; i++) {

        var node = monster.childNodes.item(i);

        if (parseInt(node.getAttribute("x")) == MONSTER_LOC[i].x && parseInt(node.getAttribute("y")) == MONSTER_LOC[i].y) {
            MONSTER_LOC[i].x = Math.floor(Math.random() * 561);
            MONSTER_LOC[i].y = Math.floor(Math.random() * 521);
        }

        if (parseInt(node.getAttribute("x")) < MONSTER_LOC[i].x) {
            node.setAttribute("x", parseInt(node.getAttribute("x")) + MONSTER_SPEED);
            node.setAttribute("transform", "scale(-1, 1) translate(-" + 2 * (parseInt(node.getAttribute("x")) + 20) + ",0)");
            MONSTER_DIR[i] = true;

        }
        else if (parseInt(node.getAttribute("x")) > MONSTER_LOC[i].x) {
            node.setAttribute("x", parseInt(node.getAttribute("x")) - MONSTER_SPEED);
            node.setAttribute("transform", "");
            MONSTER_DIR[i] = false;
        }

        if (parseInt(node.getAttribute("y")) < MONSTER_LOC[i].y)
            node.setAttribute("y", parseInt(node.getAttribute("y")) + MONSTER_SPEED);
        else if (parseInt(node.getAttribute("y")) > MONSTER_LOC[i].y)
            node.setAttribute("y", parseInt(node.getAttribute("y")) - MONSTER_SPEED);

        if (i == monster.childNodes.length - 1 && canMonsterShoot && special_alive)
            shootSpecialBullet(MONSTER_DIR[i], new Point(parseInt(node.getAttribute("x")), parseInt(node.getAttribute("y"))));

    }
}

// This is the function to move the vertical platform
function moveVerticalPlatform() {

    var vertical_platform = document.getElementById("vertical_platform");

    if (parseInt(vertical_platform.getAttribute("y")) <= 0)
        VERTICAL_PLATFORM_UP = false;
    else if (parseInt(vertical_platform.getAttribute("y")) + 20 >= SCREEN_SIZE.h)
        VERTICAL_PLATFORM_UP = true;

    if (VERTICAL_PLATFORM_UP)
        vertical_platform.setAttribute("y", parseInt(vertical_platform.getAttribute("y")) - VERTICAL_PLATFORM_SPEED);
    else 
        vertical_platform.setAttribute("y", parseInt(vertical_platform.getAttribute("y")) + VERTICAL_PLATFORM_SPEED);

}


//
// This is the functino for collision detection
//
function collisionDetection() {

    var monsters = document.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {

        var monster = monsters.childNodes.item(i);
        var monster_position = new Point(parseInt(monster.getAttribute("x")), parseInt(monster.getAttribute("y")));

        if (intersect(monster_position, MONSTER_SIZE, player.position, PLAYER_SIZE) && !CHEAT_MODE) 
            endGame();
    }

    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {

        var bullet = bullets.childNodes.item(i);
        var bullet_position = new Point(parseInt(bullet.getAttribute("x")), parseInt(bullet.getAttribute("y")));

        if (bullet.getAttribute("stroke") == "green" && intersect(bullet_position, BULLET_SIZE, player.position, PLAYER_SIZE) && !CHEAT_MODE)
            endGame();
        
        if (bullet.getAttribute("stroke") == "green")
            continue;

        for (var j = 0; j < monsters.childNodes.length; j++) {

            var monster = monsters.childNodes.item(j);
            var monster_position = new Point(parseInt(monster.getAttribute("x")), parseInt(monster.getAttribute("y")));    

            if (intersect(bullet_position, BULLET_SIZE, monster_position, MONSTER_SIZE)) {
                
                playsnd("monster_dies");

                if (j == monsters.childNodes.length - 1)
                    special_alive = false;

                monsters.removeChild(monster);
                MONSTER_LOC.splice(j, 1);
                MONSTER_DIR.splice(j, 1);
                bullets.removeChild(bullet);
                i--;
                j--;


                score += SCORE_MONSTER;
                document.getElementById("score").firstChild.data = score;
            }
        }
    }

    var notes = document.getElementById("notes");
    for (var i = 0; i < notes.childNodes.length; i++) {

        var note = notes.childNodes.item(i);
        var note_position = new Point(parseInt(note.getAttribute("x")), parseInt(note.getAttribute("y")));

        if (intersect(note_position, NOTE_SIZE, player.position, PLAYER_SIZE)) {

            score += SCORE_GOOD;
            document.getElementById("score").firstChild.data = score;

            notes.removeChild(note);
            i--;
        }
    }

    if (intersect(PORTAL_A_POSITION, PORTAL_SIZE, player.position, PLAYER_SIZE) && canTeleport) {
        canTeleport = false;
        player.position = PORTAL_B_POSITION;
        setTimeout("canTeleport = true", TELEPORT_INTERVAL);
    }

    if (intersect(PORTAL_B_POSITION, PORTAL_SIZE, player.position, PLAYER_SIZE) && canTeleport) {
        canTeleport = false;
        player.position = PORTAL_A_POSITION;
        setTimeout("canTeleport = true", TELEPORT_INTERVAL);
    }

    var exit = document.getElementById("exit_point");
    if (exit.childNodes.length > 0 && intersect(EXIT_POSITION, EXIT_SIZE, player.position, PLAYER_SIZE))
        nextLevel();

    return;
}

// This is the function to end the game
function endGame() {

    playsnd("player_dies");

    clearInterval(gameInterval);
    clearInterval(timeInterval);
    document.removeEventListener("keydown", keydown, false);
    document.removeEventListener("keyup", keyup, false);

    var table = getHighScoreTable();
    var record = new ScoreRecord(this.name, parseInt(this.score));
    var added = false;

    for (var i = 0; i < table.length; i++) {
        if (table[i].score < record.score) {
            table.splice(i, 0, record);
            added = true;
            break;
        }
    }

    if (table.length < 5 && !added)
        table.splice(table.length, 0, record);

    setHighScoreTable(table);
    showHighScoreTable(table, this.name, this.score);

    LEVEL = 0;
    score = 0;
    document.getElementById("score").firstChild.data = score;
    added_current_name = false;
    added_current_score = false;

    START_INFO = new Array("You are a student at HKUST. You need to reach ",
                            "graduation before the time runs out with the highest ", 
                            "GPA and the least time possible. Collect all the notes ", 
                            "to boost your GPA and open the gate for graduation. ", 
                            "But be careful for terrible friends, touching them will ", 
                            "result in expelling. You can get rid of them by sending ",  
                            "them bullet-like rejections. Use A to move left, D to ", 
                            "move right, W to jump and H to send rejections. ");

    return;
}

// This is the function to proceed to the next level
function nextLevel() {

    if (LEVEL != 0)
        playsnd("next_level");

    // Clear all the intervals
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    document.removeEventListener("keydown", keydown, false);
    document.removeEventListener("keyup", keyup, false);

    // Reset all svg objects
    var monsters = document.getElementById("monsters");
    while (monsters.childNodes.length > 0)
        monsters.removeChild(monsters.childNodes.item(0));
    
    var bullets = document.getElementById("bullets");
    while (bullets.childNodes.length > 0)
        bullets.removeChild(bullets.childNodes.item(0));

    var notes = document.getElementById("notes");
    while (notes.childNodes.length > 0)
        notes.removeChild(notes.childNodes.item(0));
    
    if (document.getElementById("exit_point").childNodes.length != 0)
        document.getElementById("exit_point").removeChild(document.getElementById("exit_point").childNodes.item(0));

    // Handle level proceed
    LEVEL += 1;
    document.getElementById("level").firstChild.data = LEVEL;

    // Update score
    if (LEVEL != 1) {
        score += SCORE_LEVEL * (LEVEL - 1);
        score += SCORE_TIME * TIME_REMAINING;
        document.getElementById("score").firstChild.data = score;
    }

    // Reset all variables
    player.position = PLAYER_INIT_POS;
    document.getElementById("player_name").removeChild(document.getElementById("player_name").childNodes.item(0));
    FACE_RIGHT = true;
    canPlayerShoot = true;
    BULLET_NUM = 8;
    document.getElementById("bullet_num").firstChild.data = BULLET_NUM;
    NOTE_NUM = 8;
    VERTICAL_PLATFORM_UP = true;
    MONSTER_NUM = 6 + 4 * (LEVEL - 1);
    MONSTER_LOC = new Array();
    MONSTER_DIR = new Array();
    canMonsterShoot = true;
    special_alive = true;
    TIME_REMAINING = TIME_INIT;
    document.getElementById("time").firstChild.data = TIME_REMAINING;
    CHEAT_MODE = false;
    document.getElementById("cheat_mode").firstChild.data = "OFF";
    gameInterval = null;
    timeInterval = null;

    // Prepare the start information page for the next level
    var startinfo = document.getElementById("startinfo");
    while (startinfo.childNodes.length > 0)
        startinfo.removeChild(startinfo.childNodes.item(0));

    for (var i = 0; i < DISAPPEAR_PLATFORM_NUM; i++) {
        document.getElementById("disappear_platform" + i).setAttribute("opacity", 1);
    }

    if (LEVEL > 1) {
        START_INFO = new Array("Congratulations to your completion of previous years, ",
                               "but we all know the journey never ends. So you need ", 
                               "to go through the next year again. The instructions ", 
                               "remain the same and your score will add up to the ", 
                               "final CGA. Be careful, there are more terrible friends ", 
                               "in this year! ");
        document.getElementById("startpage").style.setProperty("visibility", "visible", null);
    }
    
    // reload the setting with reset variables
    load();

    return;
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case MOVE_LEFT.charCodeAt(0):
            player.motion = motionType.LEFT;
            FACE_RIGHT = false;
            break;

        case MOVE_RIGHT.charCodeAt(0):
            player.motion = motionType.RIGHT;
            FACE_RIGHT = true;
            break;

        // Add your code here

        case MOVE_UP.charCodeAt(0):
            if (player.isOnPlatform())
                player.verticalSpeed = JUMP_SPEED;
            break;

        case MOVE_SHOOT.charCodeAt(0):
            if (canPlayerShoot && (BULLET_NUM > 0 || CHEAT_MODE))
                shootBullet();
            break;
        
        case MOVE_EN_CHEAT.charCodeAt(0):
            CHEAT_MODE = true;
            document.getElementById("cheat_mode").firstChild.data = "ON";
            break;

        case MOVE_DIS_CHEAT.charCodeAt(0):
            CHEAT_MODE = false;
            document.getElementById("cheat_mode").firstChild.data = "OFF";
            break;		
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case MOVE_LEFT.charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case MOVE_RIGHT.charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {

    collisionDetection();
    document.getElementById("time").firstChild.data = TIME_REMAINING;
    if (TIME_REMAINING <= 0 && !CHEAT_MODE)
        endGame();

    var notes = document.getElementById("notes");
    if (notes.childNodes.length == 0 && document.getElementById("exit_point").childNodes.length == 0){
        createExit(EXIT_POSITION.x, EXIT_POSITION.y);
    }

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT ;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    moveBullets();
    moveMonsters();
    moveVerticalPlatform();
    onDisappearPlatform(player.position, player.motion, PLAYER_SIZE);

    updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    // Transform the player
    player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");

    if (FACE_RIGHT) {
        document.getElementById("player_right").setAttribute("transform", "");
    }
    else {
        document.getElementById("player_right").setAttribute("transform", "scale(-1, 1) translate(-" + PLAYER_SIZE.w + ",0)");
    }
    // Calculate the scaling and translation factors	
    
    // Add your code here
	
}
