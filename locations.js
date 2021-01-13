const locations = {
    'OCEAN': {
        startX: 30, startY: 785, endX: 180, endY: 830,
        goto: [
            {
                location: 'OCEAN',
                rolls: [1,2,3],
                text: 'You stay in the ocean!'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [4,5,6],
                text: 'You evaporate to the atmosphere!'
            },
        ]
    },
    'ATMOSPHERE': {
        startX: 70, startY: 240, endX: 290, endY: 280,        
        goto: [
            {
                location: 'ATMOSPHERE',
                rolls: [1,2],
                text: 'You stay in the atmosphere!'
            },
            {
                location: 'CLOUDS_OCEAN',
                rolls: [3,4],
                text: 'You condense into a cloud!'
            },
            {
                location: 'GROUND',
                rolls: [5],
                text: 'You turn into dew droplets on the ground!'
            },
            {
                location: 'CLOUDS',
                rolls: [6],
                text: 'You condense into a cloud!'
            },
        ]
    },
    'CLOUDS_OCEAN': {
        startX: 520, startY: 190, endX: 660, endY: 240,        
        goto: [
            {
                location: 'OCEAN',
                rolls: [1,2,3,4,5,6],
                text: 'You rain down on to the ocean!'
            }
        ]
    },
    'CLOUDS': {
        startX: 520, startY: 190, endX: 660, endY: 240,        
        goto: [
            {
                location: 'CLOUDS',
                rolls: [1],
                text: 'You stay as a cloud!'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [2],
                text: 'You evaporate to the atmosphere!'
            },
            {
                location: 'CLOUDS_OCEAN',
                rolls: [3],
                text: 'You condense into a cloud!'
            },
            {
                location: 'GROUND',
                rolls: [4],
                text: 'You rain down on the ground!'
            },
            {
                location: 'RIVERS',
                rolls: [5],
                text: 'You rain down on to rivers and lakes!'
            },
            {
                location: 'SNOW',
                rolls: [6],
                text: 'You freeze into snow!'
            },
        ]
    },
    'GROUND': {
        startX: 900, startY: 720, endX: 1040, endY: 765,                        
        goto: [
            {
                location: 'ATMOSPHERE',
                rolls: [1,2,3],
                text: 'You evaporate to the atmosphere!'
            },
            {
                location: 'PLANTS',
                rolls: [4,5],
                text: 'You are absorbed by the roots of a plant!'
            },
            {
                location: 'AQUIFER',
                rolls: [6],
                text: 'You percolate (drip) deeper into the ground!'
            },
        ]
    },
    'RIVERS': {
        startX: 650, startY: 580, endX: 890, endY: 625,                        
        goto: [
            {
                location: 'RIVERS',
                rolls: [1],
                text: 'You stay in the Rivers and Lakes!'
            },
            {
                location: 'OCEAN',
                rolls: [2,3],
                text: 'You flow into the ocean!'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [4],
                text: 'You evaporate to the atmosphere!'
            },
            {
                location: 'GROUND',
                rolls: [5],
                text: 'You soak into the ground!'
            },
            {
                location: 'AQUIFER',
                rolls: [6],
                text: 'You percolate (drip) deeper into the ground!'
            },
        ]
    },
    'AQUIFER': {
        startX: 560, startY: 840, endX: 700, endY: 880,                        
        goto: [
            {
                location: 'AQUIFER',
                rolls: [1,2,3],
                text: 'You stay in the Aquifer!'
            },
            {
                location: 'OCEAN',
                rolls: [4],
                text: 'You flow into the ocean!'
            },
            {
                location: 'GROUND',
                rolls: [5],
                text: 'You bubble up as a puddle on the ground!'
            },
            {
                location: 'RIVERS',
                rolls: [6],
                text: 'You bubble up as a spring of water!'
            },
        ]
    },
    'PLANTS': {
        startX: 1250, startY: 680, endX: 1340, endY: 725,                        
        goto: [
            {
                location: 'PLANTS',
                rolls: [1],
                text: 'You stay in the Plants!'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [2,3,4,5,6],
                text: 'You evaporate from the plant (transpiration)!'
            },
        ]
    },
    'SNOW': {
        startX: 915, startY: 280, endX: 1020, endY: 325,                        
        goto: [
            {
                location: 'RIVERS',
                rolls: [1,2],
                text: 'You melt into runoff!'
            },
            {
                location: 'GROUND',
                rolls: [3,4],
                text: 'You melt and soak into the ground!'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [5],
                text: 'You sublimate into a gas!'
            },
            {
                location: 'GLACIERS',
                rolls: [6],
                text: 'You are compacted into ice!'
            },
        ]
    },
    'GLACIERS': {
        startX: 1080, startY: 165, endX: 1215, endY: 220,                        
        goto: [
            {
                location: 'GLACIERS',
                rolls: [1],
                text: 'You stay in the Glacier!'
            },
            {
                location: 'OCEAN',
                rolls: [2],
                text: 'You melt and flow into the ocean!'
            },
            {
                location: 'ATMOSPHERE',
                rolls: [3],
                text: 'You sublimate into a gas!'
            },
            {
                location: 'GROUND',
                rolls: [4],
                text: 'You melt and soak into the ground!'
            },
            {
                location: 'RIVERS',
                rolls: [5],
                text: 'You melt into runoff!'
            },
            {
                location: 'AQUIFER',
                rolls: [6],
                text: 'You melt and percolate (drip) deep into the ground!'
            },
        ]
    },
};
