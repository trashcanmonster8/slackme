const { ActivityHandler } = require('botbuilder');

class SlackMe extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            context.sendActivity(context.activity);
            next();
        });
    }
}

module.exports.SlackMe = SlackMe;
