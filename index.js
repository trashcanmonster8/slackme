const path = require('path');

const dotenv = require('dotenv');
// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const restify = require('restify');

const { ApplicationInsightsWebserverMiddleware } = require('botbuilder-applicationinsights');

// Create HTTP server
const server = restify.createServer();
server.use(ApplicationInsightsWebserverMiddleware);
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const { BotFrameworkAdapter } = require('botbuilder');
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    channelService: process.env.ChannelService,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

const { Channels } = require('botbuilder-core');
const slackReference = {
    conversation: {
        isGroup: false,
        id: 'B01NR4VSV6C:T01MR2VHQAJ:C01N1G2Q1CK',
        name: 'testing-slackme'
    },
    channelId: Channels.Slack,
    serviceUrl: `https://${ Channels.Slack }.botframework.com/`
};
const groupmeReference = {
    conversation: {
        isGroup: true,
        id: '55854014'
    },
    channelId: Channels.Groupme,
    serviceUrl: `https://${ Channels.Groupme }.botframework.com/`
};

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
    try {
        const activity = req.body;
        let reference = {
            bot: {
                id: 'slackme',
                name: 'Slack Me'
            }
        };
        switch (activity.serviceUrl) {
        case slackReference.serviceUrl:
            reference = Object.assign(reference, groupmeReference);
            break;
        case groupmeReference.serviceUrl:
            reference = Object.assign(reference, slackReference);
            break;
        default:
            reference = Object.assign(reference, { channelId: activity.channelId, serviceUrl: activity.serviceUrl });
        }
        await adapter.continueConversation(reference, async (context) => context.sendActivity(activity.text));
        res.send(200);
    } catch (e) {
        console.log(e.message);
        res.send(500);
    }
});
