import { SessionResponse, QuestionResponse, RiddleData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Initialize a new game session with the backend
 */
export const startSession = async (): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/start_session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SessionResponse = await response.json();
        return data.session_id;
    } catch (error) {
        console.error('Failed to start session:', error);
        throw new Error('Failed to connect to the backend. Please ensure the server is running.');
    }
};

/**
 * Get a question from the backend with automatic polling for cache misses
 */
export const getQuestion = async (
    sessionId: string,
    maxRetries: number = 5
): Promise<RiddleData> => {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const response = await fetch(`${API_BASE_URL}/get_question/${sessionId}`);

            if (!response.ok && response.status !== 202) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: QuestionResponse = await response.json();

            if (data.status === 'ready' && data.data) {
                // Cache hit - return immediately
                return data.data;
            } else if (data.status === 'processing') {
                // Cache miss - wait and retry
                const retryAfter = data.retry_after || 2;
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                retries++;
            }
        } catch (error) {
            console.error('Failed to get question:', error);
            throw new Error('Failed to fetch question from backend.');
        }
    }

    throw new Error('Timeout: Agent took too long to generate question.');
};

/**
 * Stream real-time logs from the backend using Server-Sent Events (SSE)
 */
export const streamLogs = (
    sessionId: string,
    onLog: (message: string) => void,
    onError?: (error: Error) => void
): (() => void) => {
    const eventSource = new EventSource(`${API_BASE_URL}/stream_logs/${sessionId}`);

    eventSource.onmessage = (event) => {
        onLog(event.data);
    };

    eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
        if (onError) {
            onError(new Error('Lost connection to agent log stream.'));
        }
    };

    // Return cleanup function
    return () => {
        eventSource.close();
    };
};
