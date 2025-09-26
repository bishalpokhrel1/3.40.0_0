import type { Task, Note } from '../types';

/**
 * Bridge service for communicating with website and mobile app
 * Handles data transfer and deep linking
 */
class BridgeService {
  private readonly BRIDGE_URL = 'https://manage-dashboard.com'; // Replace with your domain
  
  /**
   * Send data to mobile app via website bridge
   */
  async sendToMobile(data: { tasks: Task[]; notes: Note[] }): Promise<void> {
    try {
      // Open bridge website in new tab
      const bridgeUrl = `${this.BRIDGE_URL}?source=extension`;
      const bridgeTab = await chrome.tabs.create({ url: bridgeUrl });
      
      if (!bridgeTab.id) {
        throw new Error('Failed to create bridge tab');
      }
      
      // Wait for tab to load, then send data
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(bridgeTab.id!, {
            type: 'EXTENSION_DATA_TRANSFER',
            payload: {
              ...data,
              type: 'sync',
              source: 'extension',
              timestamp: new Date().toISOString()
            }
          });
        } catch (error) {
          console.error('Failed to send data to bridge:', error);
          // Fallback: inject content script to send data
          await this.injectBridgeScript(bridgeTab.id!, data);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to send data to mobile:', error);
      throw error;
    }
  }
  
  /**
   * Inject script to send data to bridge website
   */
  private async injectBridgeScript(tabId: number, data: { tasks: Task[]; notes: Note[] }): Promise<void> {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (transferData) => {
          // Send data to bridge website
          window.postMessage({
            type: 'EXTENSION_DATA_TRANSFER',
            payload: transferData
          }, window.location.origin);
        },
        args: [{
          ...data,
          type: 'sync',
          source: 'extension',
          timestamp: new Date().toISOString()
        }]
      });
    } catch (error) {
      console.error('Failed to inject bridge script:', error);
      throw error;
    }
  }
  
  /**
   * Generate deep link for mobile app
   */
  generateMobileDeepLink(data: { tasks: Task[]; notes: Note[] }): string {
    const encodedData = encodeURIComponent(JSON.stringify({
      ...data,
      type: 'sync',
      source: 'extension',
      timestamp: new Date().toISOString()
    }));
    
    return `manageapp://transfer?data=${encodedData}`;
  }
  
  /**
   * Generate universal link for mobile app
   */
  generateUniversalLink(data: { tasks: Task[]; notes: Note[] }): string {
    const encodedData = encodeURIComponent(JSON.stringify({
      ...data,
      type: 'sync',
      source: 'extension',
      timestamp: new Date().toISOString()
    }));
    
    return `${this.BRIDGE_URL}/transfer?data=${encodedData}`;
  }
}

export const bridgeService = new BridgeService();