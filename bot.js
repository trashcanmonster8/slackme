const { ActivityHandler } = require('botbuilder');

class SlackMe extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            await context.sendActivity(context.activity);
            await next();
        });
    }
}

module.exports.SlackMe = SlackMe;
