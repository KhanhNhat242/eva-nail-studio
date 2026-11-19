'use client'

import { useActionState } from 'react'
import { Alert, Button, Input } from 'antd'
import { login, type LoginState } from '@/app/admin/actions/auth'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})
  return (
    <form action={action} className="mt-7 flex flex-col gap-5">
      {state.error ? <Alert type="error" title={state.error} showIcon /> : null}
      <label className="flex flex-col gap-2 text-[13px] font-medium text-ink-soft">
        Tên đăng nhập
        <Input name="username" autoComplete="username" size="large" required />
      </label>
      <label className="flex flex-col gap-2 text-[13px] font-medium text-ink-soft">
        Mật khẩu
        <Input.Password name="password" autoComplete="current-password" size="large" required />
      </label>
      <Button type="primary" htmlType="submit" size="large" loading={pending} block>
        Đăng nhập
      </Button>
    </form>
  )
}
