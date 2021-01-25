const locations = {
    'OCEAN': {
        startX: 30, startY: 785, endX: 180, endY: 830,
        goto: [
            {
                location: 'OCEAN',
                rolls: [1,2,3],
                text: 'You stay in the ocean!',
                image: 'ocean.jpg'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [4,5,6],
                text: 'You evaporate to the atmosphere!',
                image: 'evaporation.png'
            },
        ]
    },
    'ATMOSPHERE': {
        startX: 70, startY: 240, endX: 290, endY: 280,        
        goto: [
            {
                location: 'ATMOSPHERE',
                rolls: [1,2],
                text: 'You stay in the atmosphere!',
                image: 'atmosphere.jpg'
            },
            {
                location: 'CLOUDS',
                rolls: [3,4,6],
                text: 'You condense into a cloud!',
                image: 'clouds.jpg'
            },
            {
                location: 'GROUND',
                rolls: [5],
                text: 'You turn into dew droplets on the ground!',
                image: 'dewdrop.png'
            },
        ]
    },
    'CLOUDS': {
        startX: 520, startY: 190, endX: 660, endY: 240,        
        goto: [
            {
                location: 'RIVERS',
                rolls: [1],
                text: 'You rain down on to rivers and lakes!',
                image: 'rain.jpg'
            },
            {
                location: 'OCEAN',
                rolls: [2],
                text: 'You rain down on to the ocean!',
                image: 'rain.jpg'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [3],
                text: 'You evaporate to the atmosphere!',
                image: 'evaporation.png'
            },
            {
                location: 'CLOUDS',
                rolls: [4],
                text: 'You stay as a cloud!',
                image: 'clouds.jpg'
            },
            {
                location: 'SNOW',
                rolls: [5],
                text: 'You freeze into snow!',
                image: 'snowflake.png'
            },
            {
                location: 'GROUND',
                rolls: [6],
                text: 'You rain down on the ground!',
                image: 'rain.jpg'
            },
        ]
    },
    'GROUND': {
        startX: 900, startY: 720, endX: 1040, endY: 765,                        
        goto: [
            {
                location: 'ATMOSPHERE',
                rolls: [1,2,3],
                text: 'You evaporate to the atmosphere!',
                image: 'evaporation.png'
            },
            {
                location: 'PLANTS',
                rolls: [4,5],
                text: 'You are absorbed by the roots of a plant!',
                image: 'treeroots.png'
            },
            {
                location: 'AQUIFER',
                rolls: [6],
                text: 'You percolate (drip) deeper into the ground!',
                image: 'percolate.jpg'
            },
        ]
    },
    'RIVERS': {
        startX: 650, startY: 580, endX: 890, endY: 625,                        
        goto: [
            {
                location: 'RIVERS',
                rolls: [1],
                text: 'You stay in the Rivers and Lakes!',
                image: 'rivers.jpg'
            },
            {
                location: 'OCEAN',
                rolls: [2,3],
                text: 'You flow into the ocean!',
                image: 'water.jpg'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [4],
                text: 'You evaporate to the atmosphere!',
                image: 'evaporation.png'
            },
            {
                location: 'GROUND',
                rolls: [5],
                text: 'You soak into the ground!',
                image: 'soil.jpg'
            },
            {
                location: 'AQUIFER',
                rolls: [6],
                text: 'You percolate (drip) deeper into the ground!',
                image: 'percolate.jpg'
            },
        ]
    },
    'AQUIFER': {
        startX: 560, startY: 840, endX: 700, endY: 880,                        
        goto: [
            {
                location: 'AQUIFER',
                rolls: [1,2,3],
                text: 'You stay in the Aquifer!',
                image: 'aquifer.jpg'
            },
            {
                location: 'OCEAN',
                rolls: [4],
                text: 'You flow into the ocean!',
                image: 'water.jpg'
            },
            {
                location: 'GROUND',
                rolls: [5],
                text: 'You bubble up as a puddle on the ground!',
                image: 'water.jpg'
            },
            {
                location: 'RIVERS',
                rolls: [6],
                text: 'You bubble up as a spring of water!',
                image: 'water.jpg'
            },
        ]
    },
    'PLANTS': {
        startX: 1250, startY: 680, endX: 1340, endY: 725,                        
        goto: [
            {
                location: 'PLANTS',
                rolls: [1],
                text: 'You stay in the Plants!',
                image: 'forest.jpg'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [2,3,4,5,6],
                text: 'You evaporate from the plant (transpiration)!',
                image: 'transpiration.png'
            },
        ]
    },
    'SNOW': {
        startX: 915, startY: 280, endX: 1020, endY: 325,                        
        goto: [
            {
                location: 'RIVERS',
                rolls: [1,2],
                text: 'You melt into runoff!',
                image: 'snowforest.jpg'
            },
            {
                location: 'GROUND',
                rolls: [3,4],
                text: 'You melt and soak into the ground!',
                image: 'soil.jpg'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [5],
                text: 'You sublimate into a gas!',
                image: 'evaporation.png'
            },
            {
                location: 'GLACIERS',
                rolls: [6],
                text: 'You are compacted into ice!',
                image: 'glaciers.jpg'
            },
        ]
    },
    'GLACIERS': {
        startX: 1080, startY: 165, endX: 1215, endY: 220,                        
        goto: [
            {
                location: 'GLACIERS',
                rolls: [1],
                text: 'You stay in the Glacier!',
                image: 'glaciers.jpg'
            },
            {
                location: 'OCEAN',
                rolls: [2],
                text: 'You melt and flow into the ocean!',
                image: 'water.jpg'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [3],
                text: 'You sublimate into a gas!',
                image: 'evaporation.png'
            },
            {
                location: 'GROUND',
                rolls: [4],
                text: 'You melt and soak into the ground!',
                image: 'soil.jpg'
            },
            {
                location: 'RIVERS',
                rolls: [5],
                text: 'You melt into runoff!',
                image: 'snowforest.jpg'
            },
            {
                location: 'AQUIFER',
                rolls: [6],
                text: 'You melt and percolate (drip) deep into the ground!',
                image: 'percolate.jpg'
            },
        ]
    },
};
