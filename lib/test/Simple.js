var readline = require('readline');
var prompts = readline.createInterface(process.stdin, process.stdout);
// -----------------------



var rocketship = 'Rocket Ship';

var numberOfRocketships = 20;

for (var i=1; i <= numberOfRocketships; i++)
{
    var ourSentence = i + ' ' + rocketship;

    if ( i > 19 )
    {
        ourSentence += 's';
    }

    console.log(ourSentence);
};

// -----------------------
prompts.question("Press Enter gently to exit...", function() {
    process.exit();
});

/*
console.log('Daddy are we going to program tomaro?');
console.log('Are we, are we,are we,ARE WE!!');

    
    if (i == 4)
    {
        continue;
    }

    console.log(' ' + rocketship);
    
    if (i == 8)
    {
        console.log(' more.');
    }

*/