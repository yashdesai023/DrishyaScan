import { EventEmitter } from 'events';

interface ScanUpdate {
  websiteId: string;
  scanId: string;
  status: 'scanning' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  constructor(private url: string) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as ScanUpdate;
          this.eventEmitter.emit('scanUpdate', data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onScanUpdate(callback: (update: ScanUpdate) => void) {
    this.eventEmitter.on('scanUpdate', callback);
    return () => {
      this.eventEmitter.off('scanUpdate', callback);
    };
  }
}

// Create a singleton instance
const wsService = new WebSocketService(process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws');

export default wsService; 