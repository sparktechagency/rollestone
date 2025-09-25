import { idk } from "./utils"

export interface ZelloMessage {
  command: string
  seq?: number
  [key: string]: idk
}

export interface ZelloConfig {
  server: string
  authToken?: string
  username?: string
  password?: string
  channels: string[]
  listenOnly?: boolean
}

export class ZelloClient {
  private ws: WebSocket | null = null
  private sequenceNumber = 1
  private config: ZelloConfig
  private onStatusChange?: (connected: boolean) => void
  private onChannelStatus?: (channel: string, online: boolean) => void
  private onIncomingVoice?: (data: ArrayBuffer) => void
  private onError?: (error: string) => void

  constructor(config: ZelloConfig) {
    this.config = config
  }

  setCallbacks(callbacks: {
    onStatusChange?: (connected: boolean) => void
    onChannelStatus?: (channel: string, online: boolean) => void
    onIncomingVoice?: (data: ArrayBuffer) => void
    onError?: (error: string) => void
  }) {
    this.onStatusChange = callbacks.onStatusChange
    this.onChannelStatus = callbacks.onChannelStatus
    this.onIncomingVoice = callbacks.onIncomingVoice
    this.onError = callbacks.onError
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.server)

        this.ws.onopen = () => {
          console.log("[v0] WebSocket connected, sending logon")
          this.sendLogon().then(resolve).catch(reject)
        }

        this.ws.onmessage = (event) => {
          if (typeof event.data === "string") {
            this.handleTextMessage(JSON.parse(event.data))
          } else {
            // Binary message (voice data)
            this.onIncomingVoice?.(event.data)
          }
        }

        this.ws.onclose = () => {
          console.log("[v0] WebSocket disconnected")
          this.onStatusChange?.(false)
        }

        this.ws.onerror = (error) => {
          console.error("[v0] WebSocket error:", error)
          this.onError?.("Connection failed")
          reject(false)
        }
      } catch (error) {
        console.error("[v0] Failed to create WebSocket:", error)
        reject(false)
      }
    })
  }

  private async sendLogon(): Promise<boolean> {
    const logonMessage: ZelloMessage = {
      command: "logon",
      seq: this.sequenceNumber++,
      channels: this.config.channels,
      listen_only: this.config.listenOnly || false,
      version: "1.0",
      platform_type: "web",
      platform_name: "Zello Web App",
    }

    if (this.config.authToken) {
      logonMessage.auth_token = this.config.authToken
    }

    if (this.config.username && this.config.password) {
      logonMessage.username = this.config.username
      logonMessage.password = this.config.password
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(false)
      }, 10000)

      const originalHandler = this.handleTextMessage.bind(this)
      this.handleTextMessage = (message: ZelloMessage) => {
        if (message.seq === logonMessage.seq) {
          clearTimeout(timeout)
          this.handleTextMessage = originalHandler

          if (message.success) {
            console.log("[v0] Logon successful")
            this.onStatusChange?.(true)
            resolve(true)
          } else {
            console.error("[v0] Logon failed:", message.error)
            this.onError?.(message.error || "Authentication failed")
            reject(false)
          }
        } else {
          originalHandler(message)
        }
      }

      this.sendMessage(logonMessage)
    })
  }

  private handleTextMessage(message: ZelloMessage) {
    console.log("[v0] Received message:", message)

    switch (message.command) {
      case "on_channel_status":
        this.onChannelStatus?.(message.channel, message.status === "online")
        break
      case "on_stream_start":
        console.log("[v0] Incoming voice stream started")
        break
      case "on_stream_stop":
        console.log("[v0] Incoming voice stream stopped")
        break
      case "on_error":
        this.onError?.(message.error)
        break
    }
  }

  startVoiceMessage(channel: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const seq = this.sequenceNumber++
      const message: ZelloMessage = {
        command: "start_stream",
        seq,
        channel,
        type: "audio",
        codec: "opus",
        codec_header: "",
        packet_duration: 20,
      }

      const timeout = setTimeout(() => {
        reject(new Error("Start stream timeout"))
      }, 5000)

      const originalHandler = this.handleTextMessage.bind(this)
      this.handleTextMessage = (response: ZelloMessage) => {
        if (response.seq === seq) {
          clearTimeout(timeout)
          this.handleTextMessage = originalHandler

          if (response.success) {
            resolve(response.stream_id)
          } else {
            reject(new Error(response.error || "Failed to start stream"))
          }
        } else {
          originalHandler(response)
        }
      }

      this.sendMessage(message)
    })
  }

  stopVoiceMessage(streamId: number) {
    const message: ZelloMessage = {
      command: "stop_stream",
      stream_id: streamId,
    }
    this.sendMessage(message)
  }

  sendVoiceData(streamId: number, audioData: ArrayBuffer) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Create binary message with stream ID header
      const header = new ArrayBuffer(4)
      const headerView = new DataView(header)
      headerView.setUint32(0, streamId, true)

      const combined = new ArrayBuffer(header.byteLength + audioData.byteLength)
      const combinedView = new Uint8Array(combined)
      combinedView.set(new Uint8Array(header), 0)
      combinedView.set(new Uint8Array(audioData), header.byteLength)

      this.ws.send(combined)
    }
  }

  private sendMessage(message: ZelloMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
