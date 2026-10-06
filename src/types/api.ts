export interface InstanceData {
  idInstance: number
  wid: string
  typeInstance: 'v3' | 'whatsapp'
}

export interface SenderData {
  chatId: string
  chatName: string
  chatType: 'user' | 'group' | 'channel' | 'bot'
  sender: string
  senderName: string
  senderType: 'user' | 'group' | 'channel' | 'bot'
  senderContactName?: string
  senderPhoneNumber: number
}

export interface TextMessageData {
  textMessage: string
}

export interface MessageData {
  typeMessage: 'textMessage' | string
  textMessageData?: TextMessageData
}

export interface IncomingMessageWebhookBody {
  typeWebhook: 'incomingMessageReceived'
  instanceData: InstanceData
  timestamp: number
  idMessage: string
  senderData: SenderData
  messageData: MessageData
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: IncomingMessageWebhookBody
}
