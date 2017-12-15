var readline = require('readline');
var prompts = readline.createInterface(process.stdin, process.stdout);

var command = 'C:\\Outlook.exe.lnk /c ipm.note /m \"andrew.hurdis@pfizer.com;angela.j.filip@pfizer.com;&subject=something you need to know&body=Keep it, like, a secret...\"';

var exec = require('child_process').exec,
    child;

child = exec(command,
    function (error, stdout, stderr) {
        if(stdout!==''){
            console.log('---------stdout: ---------\n' + stdout);
        }
        if(stderr!==''){
            console.log('---------stderr: ---------\n' + stderr);
        }
        if (error !== null) {
            console.log('---------exec error: ---------\n[' + error+']');
        }
    });

prompts.question('Hit Enter to exit...', function() {
    process.exit();
});
