import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary', error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-100 font-nunito p-6 text-center">
          <h1 className="text-xl font-bold text-slate-800">Algo salió mal</h1>
          <p className="text-sm text-slate-500 max-w-md">
            Recargá la página. Si el problema continúa, comunicate con administración del CFL 404.
          </p>
          <button
            type="button"
            className="mt-2 px-4 py-2 rounded-lg bg-custom-azul-oscuro text-white text-sm font-semibold"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
