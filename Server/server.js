const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

// --- Configuration ---
const PORT = 3000;
const REDIS_URL = "redis://localhost:6379";
const QUEUE_KEY_PREFIX = "queue:";
const LOG_CHANNEL_PREFIX = "logs:";
const BUFFER_SIZE = 3;

// --- Setup ---
const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Allow Frontend
app.use(express.json());

// --- Redis Client ---
// We need two connections: one for general commands, one for Pub/Sub
const redis = new Redis(REDIS_URL);
const redisPub = new Redis(REDIS_URL);
const redisSub = new Redis(REDIS_URL);

redis.on('connect', () => console.log('✅ Connected to Redis Cartographer\'s Archive'));
redis.on('error', (err) => console.error('❌ Redis Error:', err));

// --- Thematic Logic ---
const THEMATIC_LOGS = [
    "Unrolling the dusty parchment...",
    "Triangulating position with the sextant...",
    "Consulting the Royal Geographic Society archives...",
    "The Archivist is verifying this claim...",
    "Lighting a candle to inspect the map...",
    "Measuring the trade winds...",
    "Ink is drying on the riddle..."
];

// Helper to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function publishLog(sessionId, message) {
    const channel = `${LOG_CHANNEL_PREFIX}${sessionId}`;
    await redisPub.publish(channel, message);
}

// --- The "Mock" Agent ---
async function mockAgentGeneration(sessionId) {
    await publishLog(sessionId, "The Scouts are preparing for departure...");

    // Simulate 3 steps of "work"
    for (let i = 0; i < 3; i++) {
        await sleep(1000); // 1 second delay
        const logMsg = THEMATIC_LOGS[Math.floor(Math.random() * THEMATIC_LOGS.length)];
        await publishLog(sessionId, logMsg);
    }

    await publishLog(sessionId, "Discovery made! The courier is returning.");

    return {
        riddle: "I am a city of canals, but not Venice. I stand on the Neva.",
        coordinates: [59.9311, 30.3609], // St. Petersburg
        difficulty: "Hard"
    };
}

// --- Background Prefetcher ---
async function refillQueue(sessionId) {
    const queueKey = `${QUEUE_KEY_PREFIX}${sessionId}`;

    try {
        const currentLen = await redis.llen(queueKey);
        const needed = BUFFER_SIZE - currentLen;

        if (needed > 0) {
            console.log(`[${sessionId}] Buffer low (${currentLen}/${BUFFER_SIZE}). Refilling ${needed} items.`);

            for (let i = 0; i < needed; i++) {
                const riddleData = await mockAgentGeneration(sessionId);
                await redis.rpush(queueKey, JSON.stringify(riddleData));
            }
            console.log(`[${sessionId}] Refill complete.`);
        } else {
            console.log(`[${sessionId}] Buffer healthy.`);
        }
    } catch (err) {
        console.error(`Error refilling queue for ${sessionId}:`, err);
    }
}

// --- API Endpoints ---

// 1. Start Session
app.post('/session/start', async (req, res) => {
    const sessionId = uuidv4();

    // Trigger background refill (FIRE AND FORGET - do not await)
    refillQueue(sessionId);

    res.json({
        session_id: sessionId,
        status: "scouting",
        message: "The expedition has begun. Scouts sent."
    });
});

// 2. Get Question
app.get('/question/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const queueKey = `${QUEUE_KEY_PREFIX}${sessionId}`;

    try {
        // Pop from Left (FIFO)
        const item = await redis.lpop(queueKey);

        // Trigger refill in background
        refillQueue(sessionId);

        if (item) {
            res.json(JSON.parse(item));
        } else {
            res.status(202).json({ detail: "The scouts are still returning... please wait." });
        }
    } catch (err) {
        res.status(503).json({ error: "Redis connection failed" });
    }
});

// 3. SSE Stream for Logs
app.get('/stream/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const channelName = `${LOG_CHANNEL_PREFIX}${sessionId}`;

    // Headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Create a dedicated subscriber for this request
    // Note: In high production, you'd use a single global subscriber and route messages,
    // but for this scale, individual subscription is fine and clearer to read.
    const localSub = new Redis(REDIS_URL);

    localSub.subscribe(channelName, (err) => {
        if (err) console.error("Failed to subscribe:", err);
    });

    localSub.on('message', (channel, message) => {
        if (channel === channelName) {
            // SSE Format: "data: <payload>\n\n"
            const payload = JSON.stringify({ event: "log", data: message });
            res.write(`data: ${payload}\n\n`);
        }
    });

    // Cleanup when client disconnects
    req.on('close', () => {
        localSub.disconnect();
        res.end();
    });
});

// --- Run Server ---
app.listen(PORT, () => {
    console.log(`🧭 AtLost Map Room running on http://localhost:${PORT}`);
});