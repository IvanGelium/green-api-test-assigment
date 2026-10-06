interface CustomInputProps {
  id: string
  label?: string
  value: string
  placeholder?: string
  errMsg?: string
  ref?: React.RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

function CustomTextInput({ id, errMsg, label, ...props }: CustomInputProps) {
  return (
    <div key={id} className="flex flex-col gap-1 w-full min-w-0 max-w-full overflow-hidden">
      {label && <label htmlFor={id} className="text-xl font-semibold">{label}</label>}
      <input
        type="text"
        {...props}
        id={id}
        name={id}
        className="
                bg-input focus:bg-input-focus border
                border-border-input focus:border-border-focus
                text-secondary placeholder:text-disabled-text
                px-4 py-2 rounded outline-none transition-colors
                w-full min-w-0"
      />
      {errMsg && <p className="text-error w-full">{errMsg}</p>}
    </div>
  )
}

export default CustomTextInput
