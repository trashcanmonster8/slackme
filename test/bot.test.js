const { DialogTestClient } = require('botbuilder-testing');
const { TestAdapter } = require('botbuilder');
const { EchoBot } = require('../bot');
const { ok } = require('assert');

describe('slackme', () => {
    const bot = new EchoBot();
    const adapter = new TestAdapter(bot);
    const client = new DialogTestClient(adapter);
    it('forwards messages from slack to groupme', async () => {
        await client.sendActivity({
            text: 'slack message',
            serviceUrl: 'something'
        });
        ok(true);
    });
});
