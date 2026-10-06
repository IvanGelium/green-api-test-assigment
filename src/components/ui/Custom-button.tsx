interface CustomButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export default function CustomButton({ onClick, disabled, label, icon: Icon }: CustomButtonProps) {
  return (
    <button
      className="px-4 py-2 cursor-pointer rounded border border-border-input bg-primary hover:bg-primary-hover flex gap-1"
      onClick={e => onClick(e)}
      disabled={disabled}
    >
      {!!(label) && label}
      {!!(Icon) && <Icon />}
    </button>
  )
}
