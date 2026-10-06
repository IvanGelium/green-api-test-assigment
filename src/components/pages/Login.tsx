import { useState } from 'react'
import GreenApiLogo from '@/assets/svg/green-api-logo.svg?react'
import MaxLogo from '@/assets/svg/max-logo.svg?react'
import { useAuth } from '../../hooks/auth'
import CustomButton from '../ui/Custom-button'
import CustomTextInput from '../ui/Custom-text-input'

const schema = [
  {
    id: 'green_api_id_instance',
    label: 'ID инстанса',
    type: 'text',
    placeholder: 'Введите ID',
    validate: (val: string) => (!val ? 'ID обязателен' : val.length < 5 ? 'Минимум 5 символов' : ''),
  },
  {
    id: 'green_api_token_instance',
    label: 'API Токен',
    type: 'password',
    placeholder: 'Введите токен',
    validate: (val: string) => (!val ? 'Токен обязателен' : ''),
  },
] as const

type FormKeys = typeof schema[number]['id']
type FormState = Record<FormKeys, string>
const fieldsIds = Object.fromEntries<string>(schema.map(f => [f.id, ''])) as FormState

function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState<FormState>(fieldsIds)
  const [errors, setErrors] = useState<FormState>(fieldsIds)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    let isValid = true
    const nextErrors = {} as FormState
    schema.forEach((f) => {
      const err = f.validate(form[f.id])
      nextErrors[f.id] = err
      if (err) {
        isValid = false
      }
    })
    setErrors(nextErrors)

    if (!isValid)
      return

    login({
      apiTokenInstance: form.green_api_token_instance,
      idInstance: form.green_api_id_instance,
    })
  }

  return (

    <div className="w-screen h-screen flex items-center justify-center">

      <div className="flex flex-col gap-4">
        {
        // logo
        }
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center">
            <GreenApiLogo className="w-15 text-brand-green" />
            <p className="text-4xl font-bold">REEN-API</p>
          </div>
          <p className="text-2xl font-bold">X</p>
          <MaxLogo className="w-40" />
        </div>

        {
        // form
        }
        <div className="flex flex-col gap-4">
          {schema.map(f => (
            <CustomTextInput
              key={f.id}
              id={f.id}
              value={form[f.id]}
              label={f.label}
              errMsg={errors[f.id]}
              onChange={handleInputChange}
            />
          ))}
          <div className="w-full flex justify-end">
            <CustomButton label="Войти" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login
