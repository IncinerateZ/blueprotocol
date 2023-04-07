//2023-04-07

const fs = require('fs');

let ln = require('./LocationNames.json');

let tl = `Asterliese
Development Bureau
Double-sided Coin Inn
Imagine Institute
Shopping mall
Baphara Temple
Craftsman Square
Rotating Rudder Inn
Arena
City Gate Square
Marina
Main Street
Asterliese Harbor
Asterliese Beach
Salamzahd Oasis
Baphara Temple
Development Bureau
Imagine Institute
Resting Place
Tent Tavern
Craftsman Square
Sanctuary of Divine Blessing - Purification Room
Sanctuary of Divine Blessing - Ritual Room
Asteria Plain
Grasslands of the Roaring Sea
Andorra Basin
Minster Hills
Evening Calm Plateau
Cliff Ruins
Minsterhorn
Guardian Outpost of the Order
Ruins of the Ancient City of Ville
Goblin's Hideout
Pale Blue Lake
Ruins of the Tower
Bahamar Highlands
Hill Watched Over by Gods
Foothills of Tranquility
Fiel Ridge Pond
Larpal
Ruins of Bergmahl Village
Ogurusu Ruins
Sacred Pillar of the Gods
Fortress of Calamity
Village of Misfortune
Montegnor Canyon
Ritze Trading Road
Melisos River Basin
Galleyridge Abandoned Road
Ritze
Ritze Great Cave
Sub Dragon's Watering Hole
Falling Dragon Waterfall
Arid Valley Checkpoint
Galleyridge Village Ruins
Tower Rock
Hunter's Shortcut
Evergreen Desert
Mirage Valley
Windless Wasteland
Orbido Plain
Rainfall Old Highway
Unreturning Sandstorm
Kaltum Ruins
Hermit's Spring
Cliff of Whispers
Tauhran Mine
Raguba Mine
Rock Tower of Ancestral Worship
Settlement of Shipdahal
Entrance to the Sand Sea
Outlaw's Sandbank
Silent City - Additional Survey
Silent City
Sacred Pillar of the Gods - Additional Survey
Excited! Sacred Pillar of the Gods
Sacred Pillar of the Gods
Birthing House of the Shackle God - Additional Survey
Birthing House of the Shackle God
Giant Dragon's Claw Marks - Additional Survey
Intense Battle! Giant Dragon's Claw Marks
Giant Dragon's Claw Marks
Giant Dragon's Claw Marks - Free Exploration
Sanctuary of Divine Blessing - Additional Survey
Sanctuary of Divine Blessing
Fortress of Dawn's Insects - Additional Survey
Armored Attack! Fortress of Dawn's Insects
Fortress of Dawn's Insects
Lake Crid Mine - Additional Survey
Lake Crid Mine
Lake Crid Mine - Free Exploration
Valley of Machine Traces - Additional Survey
Valley of Machine Traces
Bolom Ruins - Additional Survey
Bolom Ruins
Bolom Ruins - Free Exploration
Digging Traces Behind the Waterfall - Investigation
Ruins of the Tower - Investigation
Ruins of the Tower
Sun-dappled Forest Path - Free Exploration
Sun-dappled Forest Path
Forest of Will-o'-the-Wisps - Free Exploration
Forest of Will-o'-the-Wisps
Unending Rain Forest - Free Exploration
Unending Rain Forest
Cliff Ruins
Cliff Ruins 2
Ruins of the Tower
Hunter's Shortcut
Entrance to the Sand Sea
Outlaw's Sandpit
Cliff of Whispers
Hermit's Spring
Rush Battle First Dan
Rush Battle Second Dan
Rush Battle Third Dan
Rush Battle Fourth Dan
EX Rush First Dan Guardian
EX Rush First Dan Yomigaeri
TA - Claw Marks of the Giant Dragon
TA - Soundless City
Floating Island of the Void
Floating Island of the Void - Flame Dragon Attack
Floating Island of the Void - Ice Dragon Attack
Tower of Origins
Remains of Training
Adventurer Rank 2 Promotion Test
Adventurer Rank 3 Promotion Test
Adventurer Rank 6 Promotion Test
Adventurer Rank 8 Promotion Test
SA - Valley of Machine Traces
SA - Fortress of the Dawn Insect
Adventurer's Camp
Sanctuary of Believers
Outlaw's Rocky Hideout
Pilgrim's Rest
Bed of Training
Resting Place for Pioneers
Mountain Climber's Hideaway
Wise Person's Hermitage
Explorer's Inn
Desert Trio Umbrella
Waterside Hermitage
Refuge for the Fallen
Caravan Signpost
Healing Shade of Trees
Hunter's Camp
Sunny Spot Hideaway
Plaza of Everlasting Flowers
Serenity of the Rainforest
Uneasy Shadow
Pain of a Broken Shield
Determination to Become a Hero
Let's Seize Tomorrow - Archer's Path
Sleeping in Slaft
Revenge of Several Years
Pride of the Defender
Valley of Machine Traces
Coin Tei Master's Secret`;

let res = { ...ln.ja_JP };

tl = tl.split('\n');

let i = 0;
for (let row in ln.ja_JP)
    if (ln.ja_JP[row] !== '' && ln.ja_JP[row] !== '　') res[row] = tl[i++];

fs.writeFileSync('./LocationNames_EN.json', JSON.stringify(res, null, 4));
