import type { ReceiveNotificationResponse } from '../../types/api'
import { useEffect, useRef, useState } from 'react'
import Send from '@/assets/svg/send.svg?react'
import { useAuth } from '../../hooks/auth'
import CustomButton from '../ui/Custom-button'
import CustomTextInput from '../ui/Custom-text-input'

interface message {
  id: string
  value: string
  error: string
  income: boolean
}

interface messageDTO {
  chatId: string
  message: string
}

const apiUrl = import.meta.env.VITE_API_URL
const timeoutSec = 30

async function fetchNotification(params: { idInstance: string, apiTokenInstance: string }) {
  const url = `${apiUrl}/waInstance${params.idInstance}/receiveNotification/${params.apiTokenInstance}?receiveTimeout=${timeoutSec}`

  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status}`)

      if (response.status === 400) {
        console.error('Обработка ошибок')
      }
      if (response.status === 400) {
        console.error('Обработка ошибок')
      }

      return null
    }

    return (await response.json()) as ReceiveNotificationResponse
  }
  catch (error) {
    console.error(error)
  }
}
async function delentNotification(params: { idInstance: string, apiTokenInstance: string, receiptId: number }) {
  if (!params.receiptId || typeof params.receiptId !== 'number')
    return null
  const url = `${apiUrl}/waInstance${params?.idInstance}/deleteNotification/${params?.apiTokenInstance}/${params.receiptId}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })

    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status}`)

      if (response.status === 400) {
        console.error('Обработка ошибок')
      }
      if (response.status === 400) {
        console.error('Обработка ошибок')
      }

      return null
    }
    return (await response.json()) as { resule: boolean, reason: string }
  }
  catch (error) {
    console.error(error)
  }
}

async function sendMessage(params: { idInstance: string, apiTokenInstance: string, dto: messageDTO }) {
  if (!params.dto || !params.dto.chatId || !params.dto.message)
    return null
  const url = `${apiUrl}/waInstance${params?.idInstance}/sendMessage/${params?.apiTokenInstance}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params.dto }),
    })

    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status}`)

      if (response.status === 400) {
        console.error('Обработка ошибок')
      }
      if (response.status === 400) {
        console.error('Обработка ошибок')
      }

      return null
    }
    return (await response.json()) as { idMessage: string }
  }
  catch (error) {
    console.error(error)
  }
}

function Chat() {
  const { logout, authData } = useAuth()
  const { idInstance, apiTokenInstance } = authData!
  const inputRef = useRef<HTMLInputElement>(null)
  const [numberValue, setNumberValue] = useState('')
  const [chatNumber, setChatNumber] = useState('')
  const [numberErr, setNumberErr] = useState('')
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState<message[]>([])

  function validation(value: string): string {
    if (!value)
      return 'Необходимо указать номер телефона'
    const regex = /^(?:7|8)\d{10}$/
    return regex.test(value) ? '' : 'Введите корректный номер телефона'
  }

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setNumberValue(value)
  }

  function handleMsgInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setMsg(value)
  }

  function handleSubmit() {
    const digitsOnly = numberValue.replace(/\D/g, '')
    const err = validation(digitsOnly)
    setNumberErr(err)
    if (err)
      return

    setChatNumber(digitsOnly)
  }

  async function handleSendMsg() {
    const nextMessages = [...messages]

    const chatId = `${chatNumber}@c.us`
    const resp = await sendMessage({ idInstance, apiTokenInstance, dto: { chatId, message: msg } })
    if (!resp?.idMessage)
      return
    const newMsg = {
      id: resp.idMessage,
      value: msg,
      error: '',
      income: false,
    }
    nextMessages.push(newMsg)
    setMessages(nextMessages)
    setMsg('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (!msg.trim())
        return
      handleSendMsg()
    }
  }

  const isPollingRef = useRef(true)

  useEffect(() => {
    isPollingRef.current = !!chatNumber

    async function polling() {
      while (isPollingRef.current) {
        try {
          const notification = await fetchNotification({ apiTokenInstance, idInstance })

          if (!notification) {
            await new Promise(resolve => setTimeout(resolve, 4000)) // eslint-disable-line react/web-api-no-leaked-timeout
            continue
          }

          const { receiptId, body } = notification

          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: String(receiptId),
              income: true,
              value: body.messageData?.textMessageData?.textMessage || '',
              error: '',
            },
          ])

          await delentNotification({ apiTokenInstance, idInstance, receiptId })

          isPollingRef.current = !document.hidden

          await new Promise(resolve => setTimeout(resolve, 4000)) // eslint-disable-line react/web-api-no-leaked-timeout
        }
        catch (error) {
          console.error('Ошибка при опросе:', error)
          await new Promise(resolve => setTimeout(resolve, 4000)) // eslint-disable-line react/web-api-no-leaked-timeout
        }
      }
    }

    polling()

    return () => {
      isPollingRef.current = false
    }
  }, [apiTokenInstance, idInstance, chatNumber])

  return (

    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-2">
      <div className="w-100">
        {
          (!!chatNumber)
          || (
            <div className="space-y-4 w-full">
              <CustomTextInput
                id="numberInput"
                label="Номер телефона"
                placeholder="7 999 888 77 66"
                errMsg={numberErr}
                value={numberValue}
                onChange={handleNumberInput}
              >
              </CustomTextInput>
              <div className=" flex w-full justify-end">
                <CustomButton label="начать чат" onClick={handleSubmit} />
              </div>
            </div>
          )
        }
        {
          (!!chatNumber)
          && (
            <div className="w-full space-y-4">
              <div>
                <p className="flex gap-2 font-semibold">
                  <span>Чат с пользователем:</span>
                  {chatNumber}
                </p>
                <div className="h-100 flex flex-col-reverse gap-1 p-1 overflow-auto border border-border-main">
                  {messages.toReversed().map((m) => {
                    return (
                      <div className={`w-full flex justify-${m.income ? 'start' : 'end'}`} key={m.id}>
                        <p className={`px-2 py-1 rounded-md ${m.income ? 'bg-msg-incoming' : 'bg-msg-outgoing'}`}>{m.value}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <CustomTextInput
                  placeholder="Введите сообщение..."
                  value={msg}
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  onChange={handleMsgInput}
                  id="chat-input"
                />
                <CustomButton disabled={!(msg)} onClick={handleSendMsg} icon={Send}></CustomButton>
              </div>

            </div>
          )

        }

      </div>
      <div className="text-center">
        {!!(chatNumber) && (
          <p
            onClick={() => setChatNumber('')}
            className="underline cursor-pointer"
          >
            Указать другой номер
          </p>
        )}
        <p
          onClick={() => logout()}
          className="underline cursor-pointer"
        >
          Выйти из аккаунта
        </p>
      </div>
    </div>

  )
}

export default Chat
