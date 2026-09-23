import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Calendar,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
} from 'lucide-react'
import { getCooperadoraBalance } from '../services/cooperadoraService'
import StatCard from '../components/StatCard'
import Tooltip from '../components/Tooltip'

// Registrar módulos necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

export default function CooperadoraGraficoBalance() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [chartType, setChartType] = useState('comparative') // 'comparative' | 'accumulated'

  const loadData = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const res = await getCooperadoraBalance(selectedYear)
      setReportData(res)
    } catch (err) {
      setErrorMessage(err.message || 'Error al cargar los datos del balance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedYear])

  const monthlyStats = reportData?.monthlyStats || []
  const kpis = reportData?.kpis || {
    totalIngresos: 0,
    totalEgresos: 0,
    balanceFinal: 0,
    totalCuotas: 0,
    totalGastosCooperadora: 0,
    totalDonaciones: 0,
    totalIngresosBuffet: 0,
    totalEgresosBuffet: 0,
  }

  const labels = monthlyStats.map((m) => m.monthName)

  // Datos para Gráfico Comparativo: Ingresos vs Egresos
  const comparativeChartData = {
    labels,
    datasets: [
      {
        label: 'Ingresos Totales (Cuotas + Buffet + Donaciones)',
        data: monthlyStats.map((m) => m.totalIngresos),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Egresos Totales (Gastos Coop + Compras Buffet)',
        data: monthlyStats.map((m) => m.totalEgresos),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  // Datos para Gráfico de Evolución del Saldo Acumulado
  const accumulatedChartData = {
    labels,
    datasets: [
      {
        label: 'Saldo Contable Acumulado',
        data: monthlyStats.map((m) => m.balanceAcumulado),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Nunito', weight: 'bold', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a',
        titleFont: { family: 'Nunito', weight: 'bold', size: 13 },
        bodyFont: { family: 'Roboto', size: 12 },
        callbacks: {
          label: (context) => {
            const val = context.parsed.y || 0
            return ` ${context.dataset.label}: $${val.toLocaleString('es-AR')}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: {
          font: { family: 'monospace', size: 11 },
          callback: (value) => `$${Number(value).toLocaleString('es-AR')}`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Nunito', weight: 'bold', size: 12 } },
      },
    },
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-roboto">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/cooperadora"
            className="p-2 text-slate-500 hover:text-custom-azul-oscuro dark:hover:text-custom-celeste hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Volver a Cooperadora y Buffet"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-custom-celeste/20 text-custom-azul-oscuro dark:text-custom-celeste">
                <TrendingUp className="h-5 w-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold font-nunito text-slate-800 dark:text-white">
                Gráficos de Balance Contable
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evolución mensual de ingresos, egresos y saldo acumulado — Ciclo {selectedYear}
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((yr) => (
                <option key={yr} value={yr} className="bg-white dark:bg-slate-900">
                  Año {yr}
                </option>
              ))}
            </select>
          </div>

          <Tooltip text="Actualizar datos del gráfico" position="bottom">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Actualizar gráfico"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase font-nunito tracking-wide">
              Total Ingresos
            </span>
            <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              ${kpis.totalIngresos.toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-400">Cuotas + Buffet + Donaciones</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase font-nunito tracking-wide">
              Total Egresos
            </span>
            <div className="text-xl font-extrabold font-mono text-red-600 dark:text-red-400">
              ${kpis.totalEgresos.toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-400">Gastos Coop + Compras Buffet</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase font-nunito tracking-wide">
              Balance Neto Anual
            </span>
            <div
              className={`text-xl font-extrabold font-mono ${
                kpis.balanceFinal >= 0
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              ${kpis.balanceFinal.toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-400">Ingresos − Egresos</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase font-nunito tracking-wide">
              Aporte de Cuotas
            </span>
            <div className="text-xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
              ${kpis.totalCuotas.toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-slate-400">Cooperadora de alumnos</span>
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Chart View Toggle Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold font-nunito text-slate-800 dark:text-slate-100">
              {chartType === 'comparative'
                ? 'Curva Comparativa: Flujo de Ingresos vs Egresos'
                : 'Curva de Crecimiento: Evolución del Saldo Acumulado'}
            </h2>
            <p className="text-xs text-slate-400">
              {chartType === 'comparative'
                ? 'Compara la recaudación mensual frente a los gastos devengados mes a mes'
                : 'Muestra la disponibilidad de caja acumulada a lo largo del año'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setChartType('comparative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'comparative'
                  ? 'bg-white dark:bg-slate-900 text-custom-azul-oscuro dark:text-custom-celeste shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Ingresos vs Egresos
            </button>
            <button
              type="button"
              onClick={() => setChartType('accumulated')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === 'accumulated'
                  ? 'bg-white dark:bg-slate-900 text-custom-azul-oscuro dark:text-custom-celeste shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Saldo Acumulado
            </button>
          </div>
        </div>

        {/* Chart Render Area */}
        <div className="h-[420px] w-full pt-2">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-custom-azul-oscuro dark:border-custom-celeste border-t-transparent" />
              <span className="text-xs font-bold font-nunito">Cargando gráfico interactivo…</span>
            </div>
          ) : errorMessage ? (
            <div className="h-full flex items-center justify-center text-red-500 text-xs font-bold">
              {errorMessage}
            </div>
          ) : (
            <Line
              data={chartType === 'comparative' ? comparativeChartData : accumulatedChartData}
              options={chartOptions}
            />
          )}
        </div>
      </div>

      {/* Monthly Breakdown Table Preview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold font-nunito text-slate-800 dark:text-slate-100 mb-3">
          Resumen Mensual Consolidado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-roboto">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[11px] font-bold text-slate-500 dark:text-slate-400 font-nunito">
              <tr>
                <th className="px-3 py-2.5">Mes</th>
                <th className="px-3 py-2.5 text-right">Cuotas Coop ($)</th>
                <th className="px-3 py-2.5 text-right">Ingresos Buffet ($)</th>
                <th className="px-3 py-2.5 text-right">Gastos Totales ($)</th>
                <th className="px-3 py-2.5 text-right">Balance Mes ($)</th>
                <th className="px-3 py-2.5 text-right font-extrabold">Saldo Acumulado ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {monthlyStats.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-3 py-2 font-bold text-slate-700 dark:text-slate-200 font-nunito">
                    {m.monthName}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-600 dark:text-slate-300">
                    ${m.ingresosCooperadora.toLocaleString('es-AR')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-600 dark:text-slate-300">
                    ${m.ingresosBuffet.toLocaleString('es-AR')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-red-600 dark:text-red-400">
                    -${m.totalEgresos.toLocaleString('es-AR')}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono font-bold ${
                      m.balanceMes >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {m.balanceMes >= 0 ? '+' : ''}${m.balanceMes.toLocaleString('es-AR')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-extrabold text-custom-azul-oscuro dark:text-custom-celeste">
                    ${m.balanceAcumulado.toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
