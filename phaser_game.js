var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1400,
        height: 922
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            createInfoBubble: createInfoBubble,
            createDiceBubble: createDiceBubble,
            clickedDiceBubble: clickedDiceBubble,
            createTextBubble: createTextBubble
        }
    }
};

var game = new Phaser.Game(config);

const offsetX = 40, offsetY = -20;
var current = 'OCEAN';
var travelling = false;
var travelSteps = 0;
var travelX = 0, travelY = 0;

// Various sprites, images and drawing containers
var droplet;
var graphics;
var parent;
var content;
var infoBubble;
var shape;
var bubbleImage;
var dice;
var diceBubble;

var titleScreenVisible = true;

// Dice position, settings and frame order
const diceX = 1400 - 100;
const diceY = 100;
const diceSize = 64;
var diceRollReady = false;
const diceMapping = [1,2,4,5,3,0];

// Turns position, and width
// TODO : Remove magic constants and calculate these dynamically.
const turnsWidth = 177;
const turnsHeight = 45;
const pad = 5;
const turnsX = diceX - turnsWidth / 2 - pad; 
const turnsY = diceY - diceSize / 2 - turnsHeight - pad;
var turns;
var numTurns = 0;

// Line settings for drawing arrows
const startingLineWidth = 2;
const lineWidthIncrement = 2;
const lineColor = 0x888888;


function preload () {
    parent = this;

    //this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('background', 'water_cycle2.png');
    this.load.image('title', 'title2.png');
    this.load.image('droplet', 'droplet.png');
    this.load.spritesheet('dice', 'dice.png', { frameWidth: 64, frameHeight: 64 });
    for (const location in locations) {
        console.log(location);
        locations[location].goto.forEach(function(destination) {
            console.log(destination);
            if (destination.image) {
                parent.load.image(destination.image, destination.image);
            };
        });
    };
}


function create () {
    this.bg = this.add.image(0, 0, 'background').setOrigin(0);

    droplet = this.add.sprite(200, 200, 'droplet');
    droplet.setScale(0.4);
    droplet.x = locations[current].endX + offsetX;
    droplet.y = locations[current].endY + offsetY;

    graphics = this.add.graphics({ lineStyle: { width: startingLineWidth, color: lineColor } });

    var animConfig = {
        key: 'diceAnimation',
        frames: this.anims.generateFrameNumbers('dice', { start: 0, end: 5, first: 0 }),
        frameRate: 10,
        duration: 7000
    };

    this.anims.create(animConfig);

    this.createDiceBubble();

    this.createTextBubble(770, 70, 420, 70, 'Click on the die to roll!');
    
    this.title = this.add.image(0, 0, 'title').setOrigin(0);

    this.input.on('pointerdown', handleTitleClick);


    let { width, height } = this.sys.game.canvas;
    console.log(width, height);
    console.log(window.devicePixelRatio);
    console.log(window);
    console.log(window.innerWidth, window.innerHeight);
}


function update() {
    if (travelling) {
        droplet.x += travelX;
        droplet.y += travelY;
        travelSteps -= 1;

        if (travelSteps <= 0) {
            console.log('stop droplet');
            travelSteps = 0;
            travelling = false;
            diceRollReady = true;
        }
    }
}


function moveDroplet(next) {

    console.log('Move droplet ', next);

    travelling = true;

    var toX = locations[next].endX + offsetX;
    var toY = locations[next].endY + offsetY;

    var dist = Math.sqrt(Math.pow(droplet.x - toX, 2) 
        + Math.pow(droplet.y - toY, 2));

    travelSteps = Math.round(dist / 10);
    if (travelSteps > 0) {
        travelX = (toX - droplet.x)/travelSteps;
        travelY = (toY - droplet.y)/travelSteps;
    }
}


function drawArrow(next, count) {
    var fromX, fromY, toX, toY;
    
    const offset = 20;

    // Calculate the arrow line starting and ending coordinates
    // based on the relative positioning of the two locations.
    if (locations[current].startX > locations[next].endX) {
        fromX = locations[current].startX;
        toX = locations[next].endX - offset;
    } else if (locations[current].endX < locations[next].startX) {
        fromX = locations[current].endX;
        toX = locations[next].startX + offset;
    } else {
        fromX = (locations[current].startX + locations[current].endX)/2;
        toX = (locations[next].startX + locations[next].endX)/2;
    }

    if (locations[current].startY > locations[next].endY) {
        fromY = locations[current].startY;
        toY = locations[next].endY;
    } else if (locations[current].endY < locations[next].startY) {
        fromY = locations[current].endY;
        toY = locations[next].startY;
    } else {
        fromY = (locations[current].startY + locations[current].endY)/2;
        toY = (locations[next].startY + locations[next].endY)/2;
    }

    var line = new Phaser.Geom.Line(fromX, fromY, toX, toY);
    var angle = Phaser.Math.RadToDeg(Math.abs(Phaser.Geom.Line.Angle(line)));
    console.log(angle);
    // Special case, if the line is steep, always draw from the center x
    if (angle > 80 && angle < 100) {
        console.log('Almost vertical line!');
        fromX = (locations[current].startX + locations[current].endX)/2;
        toX = (locations[next].startX + locations[next].endX)/2;
        line = new Phaser.Geom.Line(fromX, fromY, toX, toY);
    }

    // Draw the arrow head
    var length = Phaser.Geom.Line.Length(line);
    var point = Phaser.Geom.Line.GetPoint(line, 1 - 20/length);
    var line1 = new Phaser.Geom.Line(toX, toY, point.x, point.y);
    var line2 = new Phaser.Geom.Line(toX, toY, point.x, point.y);
    Phaser.Geom.Line.RotateAroundXY(line1, toX, toY, 0.4);
    Phaser.Geom.Line.RotateAroundXY(line2, toX, toY, -0.4);

    graphics.lineStyle(startingLineWidth + lineWidthIncrement * count, lineColor);
    graphics.strokeLineShape(line);
    graphics.strokeLineShape(line1);
    graphics.strokeLineShape(line2);
}


function drawArc(next, count) {
    var x = locations[next].startX;
    var y = locations[next].startY - 5;
    var r = 30;

    graphics.lineStyle(startingLineWidth + lineWidthIncrement * count, lineColor);

    graphics.beginPath();
    graphics.arc(x, y, r, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(0), false);
    graphics.lineTo(x + r - 20, y - 10);
    graphics.moveTo(x + r, y);
    graphics.lineTo(x + r + 15, y - 15);

    graphics.strokePath();
}


function handleTitleClick(pointer, targets){
    console.log("handleTitleClick",pointer);
    if (titleScreenVisible) {
        titleScreenVisible = false;
        diceRollReady = true;
        parent.title.destroy();
    }
    /*
    for (const [key, loc] of Object.entries(locations)) {
        if (loc.startX < pointer.downX && loc.endX > pointer.downX
            && loc.startY < pointer.downY && loc.endY > pointer.downY) {
            console.log('Hit');
            console.log(key);
            if (!travelling && key != current) {
                drawArrow(key);
                moveDroplet(key);
                current = next;
            }
        }
    }
    */
}


function drawBubble(x, y, width, height) {
    var bubble = parent.add.graphics({ x: x, y: y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, width, height, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, width, height, 16);
    bubble.fillRoundedRect(0, 0, width, height, 16);

    return bubble;
}


function createInfoBubble (quote, image) {
    const maxWidth = 420, maxHeight = 220;
    const bubblePadding = 5;
    var bubbleWidth = maxWidth + bubblePadding * 2;
    var bubbleHeight = maxHeight;
    var imageWidth = 0;
    var imageHeight = 0;
    var aspectRatio = 1;

    const textSettings = { fontFamily: 'Helvetica Neue', fontSize: 30, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } };
    var dummyContent = parent.add.text(0, 0, quote, textSettings);
    var dummyBound = dummyContent.getBounds();
    dummyContent.destroy();
    var textHeight = dummyBound.height + bubblePadding;

    if (image) {
        var tex = parent.textures.get(image);
        console.log(tex.get(0).width, tex.get(0).height);
        aspectRatio = tex.get(0).height / tex.get(0).width;
        imageWidth = Math.min(maxWidth, tex.get(0).width);
        imageHeight = imageWidth * aspectRatio;
        if (imageHeight > maxHeight) {
            imageHeight = maxHeight;
            imageWidth = imageHeight / aspectRatio;
        }
        bubbleWidth = Math.max(imageWidth, dummyBound.width) + bubblePadding * 2;
        bubbleHeight = imageHeight + bubblePadding * 2 + textHeight;
    }

    x = parent.scale.width - bubbleWidth - bubblePadding * 2; // parent.scale.width / 2 - bubbleWidth / 2;
    y = 300; // parent.scale.height / 2 - bubbleHeight / 2;

    infoBubble = drawBubble(x, y, bubbleWidth, bubbleHeight)

    content = parent.add.text(0, 0, quote, textSettings);

    var b = content.getBounds();

    var contentY = y + (bubbleHeight / 2) - (b.height / 2);
    if (image) {
        contentY = y + bubbleHeight - textHeight;
        bubbleImage = parent.add.image(x + bubbleWidth / 2 - imageWidth / 2, y + bubblePadding, image).setOrigin(0, 0);
        console.log(bubbleImage.width, bubbleImage.height);
        bubbleImage.setDisplaySize(imageWidth, imageHeight);
    }
    console.log('Text Bound Height', b.height);
    content.setPosition(x + (bubbleWidth / 2) - (b.width / 2), contentY);

}


function createDiceBubble() {
    diceBubble = drawBubble(turnsX, turnsY, turnsWidth + pad * 2, turnsHeight + diceSize + pad * 2);
    showTurns();

    dice = parent.add.sprite(diceX, diceY, 'dice');
    dice.setFrame(diceMapping[0]); // Display 1 on the dice

    // Adding a shape to track clicks
    shape = parent.add.rectangle(turnsX, turnsY, turnsWidth + pad * 2, turnsHeight + diceSize + pad * 2).setOrigin(0,0);
    shape.setInteractive();
    shape.on('pointerdown', clickedDiceBubble);
}


function createTextBubble(x, y, width, height, text) {
    infoBubble = drawBubble(x, y, width, height);
    content = parent.add.text(x + 15, y + 15, text, { fontFamily: 'Helvetica Neue', fontSize: 40, color: '#000000', align: 'center' });
}


function clickedDiceBubble(pointer) {
    console.log('clickedDiceBubble');
    if (!diceRollReady) {
        console.log('Not rolling dice');
        return;
    }
    diceRollReady = false;
    rollDice();
}


function rollDice() {
    destroyDialogs();

    dice = parent.add.sprite(diceX, diceY, 'dice').play('diceAnimation');            
    console.log('Dice ', dice.width, dice.height);
    //  Event handler for when the animation updates on our sprite
    dice.on(Phaser.Animations.Events.ANIMATION_UPDATE, function (anim, frame, sprite, frameKey) {
        dice.angle = dice.angle + 50;
    }, parent);
    dice.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame, sprite, frameKey) {
        var roll = Phaser.Math.Between(1, 6);
        //1,2,4,5,3,0;
        dice.setFrame(diceMapping[roll-1]);
        console.log('Roll: ',roll);
        transition(roll);
    }, parent);

    numTurns += 1;
    showTurns();
}


function transition(roll) {
    if (!locations[current].goto) {
        return;
    }
    locations[current].goto.forEach(function(destination) {
        if (destination.rolls.includes(roll)) {
            var next = destination.location;
            console.log('You go from ', current,' to ',next);
            console.log(destination.text);

            destroyDialogs();
            createInfoBubble(destination.text, destination.image);
            dice = parent.add.sprite(diceX, diceY, 'dice');
            dice.setFrame(diceMapping[roll-1]);
            moveDroplet(next);

            // Increment the number of visits from current to next location
            if (!locations[current].visits) {
                locations[current].visits = {};
            }
            if (!locations[current].visits[next]) {
                locations[current].visits[next] = 0;
            }
            locations[current].visits[next] += 1;
            console.log('Visit count: ', locations[current].visits[next]);

            // Draw an arc if it's a self visit, an arrow otherwise
            if (current == next) {
                drawArc(next, locations[current].visits[next]);
            } else {
                drawArrow(next, locations[current].visits[next]);
            }

            current = next;
        }
    });
}


function destroyDialogs() {
    console.log('Cleanup')
    if (dice) {
        dice.destroy();
    }
    if (infoBubble) {
        infoBubble.destroy();
        content.destroy();
    }
    if (bubbleImage) {
        bubbleImage.destroy();
    }
}


function showTurns() {
    if (turns) {
        turns.destroy();
    }
    var str = 'Turns : ' + numTurns;
    console.log(str);
    turns = parent.add.text(turnsX + pad, turnsY + pad, str, { fontFamily: 'Helvetica Neue', fontSize: 40, color: '#000000', align: 'center' });
    var b = turns.getBounds();
    console.log('Turns ', b.width, b.height);
}