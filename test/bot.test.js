const { TestAdapter } = require('botbuilder');
const { SlackMe } = require('../bot');
const slackActvity = require('./slackActivity.json');
const groupMeActivity = require('./groupMeActivity.json');

describe('slackme', () => {
    const bot = new SlackMe();
    const adapter = new TestAdapter((context) => bot.run(context)); ;
    describe('', () => {
        it('does not change the text for slack to groupme', async () => {
            await adapter.send(slackActvity).assertReply(slackActvity.text).startTest();
        });
        it('does not change the text for  groupme to slack', async () => {
            await adapter.send(groupMeActivity).assertReply(groupMeActivity.text).startTest();
        });
    });
});
