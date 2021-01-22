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
            createSpeechBubble: createSpeechBubble,
            clickedBubble: clickedBubble
        }
    }
};


var game = new Phaser.Game(config);

const offsetX = 40, offsetY = -20;
var current = 'OCEAN';
var travelling = false;
var travelSteps = 0;
var travelX = 0, travelY = 0;

var droplet;
var graphics;
var dice;
var parent;
var content;
var bubble;
var shape;
var turns;
var numTurns = 0;

var titleScreenVisible = true;
var diceRollReady = false;
const diceMapping = [1,2,4,5,3,0];

const startingLineWidth = 2;
const lineWidthIncrement = 2;
const lineColor = 0x888888;

function preload ()
{
    //this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('background', 'water_cycle2.png');
    this.load.image('title', 'title2.png');
    this.load.image('droplet', 'droplet.png');
    this.load.spritesheet('dice', 'dice.png', { frameWidth: 64, frameHeight: 64 });
}


function create ()
{
    parent = this;

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

    this.createSpeechBubble(droplet.x, droplet.y - 150, 450, 100, 'Click here to roll the dice!');
    
    showTurns();

    this.title = this.add.image(0, 0, 'title').setOrigin(0);

    this.input.on('pointerdown', handleclick);
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


function handleclick(pointer, targets){
    console.log("handleclick",pointer);
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


function createSpeechBubble (x, y, width, height, quote) {
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = 40;
    var arrowHeight = bubbleHeight / 4;

    x = parent.scale.width / 2 - width / 2;
    y = parent.scale.height / 2 - height / 3;
    bubble = parent.add.graphics({ x: x, y: y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    content = parent.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 30, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

    var b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

    // Adding a shape to track clicks
    shape = parent.add.rectangle(x, y, bubbleWidth, bubbleHeight).setOrigin(0,0);
    shape.setInteractive();
    shape.on('pointerdown', clickedBubble);
}


function rollDice() {
    destroyDialogs();
    createSpeechBubble(0, 0, 100, 100, "");

    dice = parent.add.sprite(parent.scale.width / 2 , parent.scale.height / 2 + 15 , 'dice').play('diceAnimation');            
    //  Event handler for when the animation updates on our sprite
    dice.on(Phaser.Animations.Events.ANIMATION_UPDATE, function (anim, frame, sprite, frameKey) {
        dice.angle = dice.angle + 50;
    }, parent);
    dice.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame, sprite, frameKey) {
        roll = Phaser.Math.Between(1, 6);
        //1,2,4,5,3,0;
        dice.setFrame(diceMapping[roll-1]);
        console.log('Roll: ',roll);
        transition(roll);
    }, parent);

    numTurns += 1;
    showTurns();
}


function clickedBubble(pointer) {
    console.log('clicked on bubble!');
    if (!diceRollReady) {
        console.log('Not rolling dice');
        return;
    }
    diceRollReady = false;
    rollDice();
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
            createSpeechBubble(0, 0, 400, 100, destination.text);
            dice = parent.add.sprite(parent.scale.width / 2 - 200, parent.scale.height / 2 + 15 , 'dice');
            dice.setFrame(diceMapping[roll-1]);
            moveDroplet(next);

            // Special case to consider CLOUDS_OCEAN and CLOUDS together for visit counting
            var current_mod = (current == 'CLOUDS_OCEAN' ? 'CLOUDS' : current); 
            var next_mod = (next == 'CLOUDS_OCEAN' ? 'CLOUDS' : next); 
            
            // Increment the number of visits from current to next location
            if (!locations[current_mod].visits) {
                locations[current_mod].visits = {};
            }
            if (!locations[current_mod].visits[next_mod]) {
                locations[current_mod].visits[next_mod] = 0;
            }
            locations[current_mod].visits[next_mod] += 1;
            console.log('Visit count: ', locations[current_mod].visits[next_mod]);

            // Draw an arc if it's a self visit, an arrow otherwise
            if (current_mod == next_mod) {
                drawArc(next, locations[current_mod].visits[next_mod]);
            } else {
                drawArrow(next, locations[current_mod].visits[next_mod]);
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
    if (bubble) {
        content.destroy();
        bubble.destroy();
        shape.destroy();
    }
}


function showTurns() {
    if (turns) {
        turns.destroy();
    }
    var str = 'Turns : ' + numTurns;
    console.log(str);
    turns = parent.add.text(parent.scale.width - 200, 20, str, { fontFamily: 'Arial', fontSize: 40, color: '#000000', align: 'center' });
}