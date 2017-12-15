let cron = require('cron');

var cronPattern = '* * * * *';

try {
    new CronJob(cronPattern, function () {
        console.log('this should not be printed');
    });

    var job1 = new cron.CronJob({
        cronTime: cronPattern,
        onTick: function () {
            console.log('job 1 ticked');
        },
        start: true
    });

} catch (ex) {
    console.log("cron pattern not valid");
}

