type StarProps = {
  className?: string
  title?: string
}

/** Ngôi sao 4 cánh ✦ — motif lấy từ logo Eva. */
export function Star({ className = 'size-3', title }: StarProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 0c.6 5.9 2.3 9.9 6.2 11.2L24 12l-5.8.8C14.3 14.1 12.6 18.1 12 24c-.6-5.9-2.3-9.9-6.2-11.2L0 12l5.8-.8C9.7 9.9 11.4 5.9 12 0Z" />
    </svg>
  )
}
