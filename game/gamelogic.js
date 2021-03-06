var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var mySound;
var myMusic;
function startGame() {
    myGamePiece= new  Component(40,40,"fl0.png",10,120,"image");
    myGamePiece.gravity = 0.01;
    myObstacle = new Component(40, 200, "spr_block.png", 300, 120,"image");
    myScore = new Component("30px", "Consolas", "white", 230, 40, "text");
    myBackground = new Component(1500, 447, "background.jpg", 0, 0, "background");
    mySound = new Sound("LOW.mp3");
    myMusic = new Sound("backmusic.mp3");
    myMusic.play();

    // myUpBtn = new component(30, 30, "blue", 50, 10);
    // myDownBtn = new component(30, 30, "blue", 50, 70);
    // myLeftBtn = new component(30, 30, "blue", 20, 40);
    // myRightBtn = new component(30, 30, "blue", 80, 40);
    myGameArea.start();
}
var myGameArea={
    canvas : document.createElement("canvas"),
    start : function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.score=0;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;
        });
        // window.addEventListener('mousedown', function (e) {
        //     myGameArea.x = e.pageX;
        //     myGameArea.y = e.pageY;
        // });
        // window.addEventListener('mouseup', function (e) {
        //     myGameArea.x = false;
        //     myGameArea.y = false;
        // });
        // window.addEventListener('touchstart', function (e) {
        //     myGameArea.x = e.pageX;
        //     myGameArea.y = e.pageY;
        // });
        // window.addEventListener('touchend', function (e) {
        //     myGameArea.x = false;
        //     myGameArea.y = false;
        // });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function Component(width,height,color,x,y,type) {
    this.type = type;
    if (type === "image" || type === "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height =  height;
    this.speedX = 0;
    this.bounce = 0.6;
    this.speedY = 0;
        this.gravity = 0;
        this.gravitySpeed = 0;

    this.x=x;
    this.y=y;
    this.update=function () {
        ctx = myGameArea.context;
        if (this.type === "text" ) {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
          else if (type === "image" ||type === "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
               if (type === "background") {
                  ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
              }
        }

        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    // this.newPos = function() {
    //     // this.gravitySpeed += this.gravity;
    //     // this.x += this.speedX;
    //     // this.y += this.speedY + this.gravitySpeed;
    //     // if (this.type === "background") {
    //     //     if (this.x === -(this.width)) {
    //     //         this.x = 0;
    //     //     }
    //     // }
    //     this.gravitySpeed += this.gravity;
    //     this.x += this.speedX;
    //     this.y += this.speedY + this.gravitySpeed;
    //     this.hitBottom();
    // };
    // this.hitBottom = function() {
    //     var rockbottom = myGameArea.canvas.height - this.height;
    //     if (this.y > rockbottom) {
    //         this.y = rockbottom;
    //     }
    // };

        this.hitBottom = function () {
            var rockbottom = myGameArea.canvas.height - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
               // this.gravitySpeed = 0;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);

            }
        };
        this.newPos = function () {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom();
                if (this.type === "background") {
                    if (this.x === -(this.width)) {
                        this.x = 0;
                    }
                }

        };

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    };

    // this.clicked = function() {
    //     var myleft = this.x;
    //     var myright = this.x + (this.width);
    //     var mytop = this.y;
    //     var mybottom = this.y + (this.height);
    //     var clicked = true;
    //     if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
    //         clicked = false;
    //     }
    //     return clicked;
    // };

}

function updateGameArea() {

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo === 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 100;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new Component(40, height, "up_pipe.png", x, 0,"image"));
        myObstacles.push(new Component(40, x - height - gap, "down_pipe.png", x, height + gap,"image"));
    if(x>400){++myGameArea.score};
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = /*"SCOR: " +*/ myGameArea.score/*myGameArea.frameNo*/;



    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    // if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.image.src = "fl1.png"; myGamePiece.speedX = -1;    }
    // if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1;  }
    // if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -1;  }
    // if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1;  }
    if (myGameArea.touchX && myGameArea.touchY) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
    }
    myBackground.speedX = -1;
    // if (myGameArea.x && myGameArea.y) {
    //     if (myUpBtn.clicked()) {
    //         myGamePiece.y -= 1;
    //     }
    //     if (myDownBtn.clicked()) {
    //         myGamePiece.y += 1;
    //     }
    //     if (myLeftBtn.clicked()) {
    //         myGamePiece.x += -1;
    //     }
    //     if (myRightBtn.clicked()) {
    //         myGamePiece.x += 1;
    //     }
    // }
    // myUpBtn.update();
    // myDownBtn.update();
    // myLeftBtn.update();
    // myRightBtn.update();//controller on the canvas
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}
function everyinterval(n) {
    if((myGameArea.frameNo / n) %1 === 0){return true;}
    return false;
}
// function move() {
//     myGamePiece.image.src = "fl0.png";
//     // if (dir === "up") {myGamePiece.speedY = -1; }
//     // if (dir === "down" ) {myGamePiece.speedY = 1; }
//     // if (dir === "left") {myGamePiece.speedX = -1; }
//     // if (dir === "right") {myGamePiece.speedX = 1; }
// }
// //
// function clearmove() {
//     myGamePiece.image.src = "fl1.png";
//     // myGamePiece.speedX = 0;
//     // myGamePiece.speedY = 0;
// }
function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    }
}
function accelerate(n,dir) {
    if(dir==='up'){myGamePiece.image.src = "fl0.png";}
    else if(dir==='down'){    myGamePiece.image.src = "fl1.png";}
    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 20);}

    myGamePiece.gravity = n;
}