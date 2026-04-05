'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Logo } from '@/components/logo'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/wizard'
  const error = searchParams.get('error')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos.'
        : error.message)
      setLoading(false)
      return
    }

    window.location.href = next
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    })

    if (error) {
      toast.error('Erro ao conectar com Google. Tente novamente.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col">
      {/* Header */}
      <header className="py-6 px-5 flex justify-center">
        <Link href="/">
          <Logo size={34} />
        </Link>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-5 pb-20">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-neutral-500 mt-2">Entre na sua conta para continuar</p>
          </div>

          {error === 'auth' && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 text-center">
              Erro na autenticacao. Tente novamente.
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-sm font-semibold text-[#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-medium">ou entre com email</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-[#111111] placeholder:text-neutral-300 focus:outline-none focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-[#111111] placeholder:text-neutral-300 focus:outline-none focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A]/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#FF7A1A] hover:bg-[#e86c10] text-white font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Ainda nao tem conta?{' '}
            <Link href={`/auth/register${next !== '/wizard' ? `?next=${next}` : ''}`} className="text-[#FF7A1A] font-semibold hover:underline">
              Criar conta gratis
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center mt-4">
            <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              Voltar para o site
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
