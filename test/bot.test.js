const { TestAdapter } = require('botbuilder');
const { EchoBot } = require('../bot');
const slackActivity = require('./slackActivity.json');
const groupMeActivity = require('./groupMeActivity.json');
const { strictEqual, deepStrictEqual } = require('assert');

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
        it('converts conversation object', async () => {
            await adapter.send(slackActivity)
                .assertReply((expected) => deepStrictEqual(expected.conversation, groupMeActivity.conversation))
                .startTest();
        });
    });
    describe('groupme to slack', () => {
        it('does not change the text', async () => {
            await adapter.test(groupMeActivity.text, groupMeActivity.text).startTest();
        });
    });
});
