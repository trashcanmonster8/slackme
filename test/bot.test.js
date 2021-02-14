const { TestAdapter } = require('botbuilder');
const { EchoBot } = require('../bot');
const slackActivity = require('./slackActivity.json');
const groupMeActivity = require('./groupMeActivity.json');
const { strictEqual } = require('assert');

describe('slackme', () => {
    const bot = new EchoBot();
    const adapter = new TestAdapter((context) => bot.run(context));
    describe('slack to groupme', () => {
        it('does not change the text', async () => {
            await adapter.test(slackActivity.text, slackActivity.text).startTest();
        });
        it('converts the service url', async () => {
            await adapter.send(slackActivity)
                .assertReply((expected) => strictEqual(expected.serviceUrl, groupMeActivity.serviceUrl))
                .startTest();
        });
    });
});
