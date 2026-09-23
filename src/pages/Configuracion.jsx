import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Settings2,
  Image as ImageIcon,
  Save,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Upload,
  RefreshCw,
} from 'lucide-react'

import {
  getAllSettings,
  updateSetting,
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from '../services/settingsService'

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold font-nunito transition-all
        ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
    >
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 cursor-pointer">
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Convierte un File a WebP base64 ─────────────────────────────────────────
async function fileToWebpBase64(file, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width)
            width = MAX
          } else {
            width = Math.round((width * MAX) / height)
            height = MAX
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('No se pudo convertir a WebP'))
            const r2 = new FileReader()
            r2.onload = (ev) => resolve(ev.target.result)
            r2.onerror = reject
            r2.readAsDataURL(blob)
          },
          'image/webp',
          quality,
        )
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Tab: Configuración General (KPIs y Ajustes) ─────────────────────────────
function TabGeneral({ showToast }) {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [edited, setEdited] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllSettings()
      setSettings(data)
      const init = {}
      data.forEach((s) => {
        init[s.key] = { value: s.value ?? '', name: s.name ?? '', description: s.description ?? '' }
      })
      setEdited(init)
    } catch {
      showToast('Error al cargar configuración', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const handleChange = (key, field, val) => {
    setEdited((prev) => ({ ...prev, [key]: { ...prev[key], [field]: val } }))
  }

  const handleSave = async (key) => {
    setSaving((p) => ({ ...p, [key]: true }))
    try {
      await updateSetting(key, edited[key])
      showToast(`Clave "${key}" actualizada`)
      await load()
    } catch {
      showToast('Error al guardar', 'error')
    } finally {
      setSaving((p) => ({ ...p, [key]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 font-nunito">
        Estos valores configuran parámetros del sistema y la sección <strong>Nuestra Trayectoria en Cifras</strong> de la página pública.
      </p>
      {settings.map((s) => {
        const e = edited[s.key] || { value: '', name: '', description: '' }
        return (
          <div key={s.key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{s.key}</code>
              <button
                onClick={() => handleSave(s.key)}
                disabled={saving[s.key]}
                className="flex items-center gap-1.5 text-xs font-semibold bg-custom-celeste text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving[s.key] ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                Guardar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Valor</label>
                <input
                  type="text"
                  value={e.value}
                  onChange={(ev) => handleChange(s.key, 'value', ev.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Etiqueta</label>
                <input
                  type="text"
                  value={e.name}
                  onChange={(ev) => handleChange(s.key, 'name', ev.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Descripción</label>
                <input
                  type="text"
                  value={e.description}
                  onChange={(ev) => handleChange(s.key, 'description', ev.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Modal Patrocinador ───────────────────────────────────────────────────────
function SponsorModal({ sponsor, onClose, onSaved, showToast }) {
  const isEdit = Boolean(sponsor?.id)
  const [name, setName] = useState(sponsor?.name ?? '')
  const [description, setDescription] = useState(sponsor?.description ?? '')
  const [logoMode, setLogoMode] = useState('url') // 'url' | 'upload'
  const [logoUrl, setLogoUrl] = useState(sponsor?.logoUrl ?? '')
  const [logoPreview, setLogoPreview] = useState(sponsor?.logoUrl ?? '')
  const [converting, setConverting] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setConverting(true)
    try {
      const base64 = await fileToWebpBase64(file)
      setLogoUrl(base64)
      setLogoPreview(base64)
    } catch {
      showToast('Error al convertir la imagen', 'error')
    } finally {
      setConverting(false)
    }
  }

  const handleUrlChange = (val) => {
    setLogoUrl(val)
    setLogoPreview(val)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      showToast('El nombre es obligatorio', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = { name: name.trim(), description: description.trim(), logoUrl: logoUrl || null }
      if (isEdit) {
        await updateSponsor(sponsor.id, payload)
      } else {
        await createSponsor(payload)
      }

      showToast(isEdit ? 'Patrocinador actualizado' : 'Patrocinador creado')
      onSaved()
      onClose()
    } catch (err) {
      showToast(err.message || 'Error al guardar patrocinador', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800 font-nunito">
            {isEdit ? 'Editar patrocinador' : 'Nuevo patrocinador'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Municipalidad de Berisso, TecPlata..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-custom-celeste"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Breve descripción del patrocinador..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-custom-celeste resize-none"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Logo / Imagen
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setLogoMode('url')}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  logoMode === 'url'
                    ? 'border-custom-celeste bg-blue-50 text-custom-celeste'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <LinkIcon size={13} /> URL externa
              </button>
              <button
                type="button"
                onClick={() => setLogoMode('upload')}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  logoMode === 'upload'
                    ? 'border-custom-celeste bg-blue-50 text-custom-celeste'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Upload size={13} /> Subir imagen
              </button>
            </div>

            {logoMode === 'url' ? (
              <div>
                <input
                  type="url"
                  value={logoUrl.startsWith('data:') ? '' : logoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://ejemplo.com/logo.png"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                />
              </div>
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={converting}
                  className="flex items-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-500 hover:border-custom-celeste hover:text-custom-celeste transition-colors cursor-pointer w-full justify-center disabled:opacity-50"
                >
                  {converting ? (
                    <><RefreshCw size={16} className="animate-spin" /> Convirtiendo a WebP…</>
                  ) : (
                    <><Upload size={16} /> Seleccionar imagen (se convierte a WebP)</>
                  )}
                </button>
              </div>
            )}

            {/* Preview */}
            {logoPreview && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Vista previa de imagen
                  </span>
                  <button
                    type="button"
                    onClick={() => { setLogoUrl(''); setLogoPreview('') }}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Quitar imagen
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="h-14 w-auto max-w-[200px] object-contain rounded-lg border border-slate-200 p-1 bg-white"
                    onError={() => setLogoPreview('')}
                  />
                  <div className="text-xs text-slate-500 truncate flex-1">
                    <span className="font-semibold block text-slate-600 text-[11px]">Origen:</span>
                    <span className="font-mono text-[11px] truncate block select-all" title={logoUrl}>
                      {logoUrl.startsWith('data:') ? 'Imagen WebP (Base64 embebida)' : logoUrl}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold bg-custom-celeste text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {isEdit ? 'Guardar cambios' : 'Crear patrocinador'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Patrocinadores ──────────────────────────────────────────────────────
function TabPatrocinadores({ showToast }) {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sponsorData = await getSponsors()
      setSponsors(sponsorData)
    } catch {
      showToast('Error al cargar patrocinadores', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteSponsor(id)
      showToast('Patrocinador eliminado')
      setConfirmDelete(null)
      await load()
    } catch {
      showToast('Error al eliminar', 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-nunito">
          Administrá los patrocinadores que se muestran en las cards y detalles de cursos.
        </p>
        <button
          onClick={() => { setEditingSponsor(null); setModalOpen(true) }}
          className="flex items-center gap-2 bg-custom-celeste text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <Plus size={15} /> Nuevo patrocinador
        </button>
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
          <ImageIcon size={36} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-nunito text-sm">No hay patrocinadores registrados.</p>
          <button
            onClick={() => { setEditingSponsor(null); setModalOpen(true) }}
            className="mt-3 text-sm text-custom-celeste font-semibold hover:underline cursor-pointer"
          >
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-start sm:items-center gap-4">
              {/* Logo */}
              <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 mt-0.5 sm:mt-0">
                {s.logoUrl ? (
                  <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon size={22} className="text-slate-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-800 font-nunito text-sm">{s.name}</p>
                  <span className="text-[11px] text-slate-500 bg-slate-100 font-medium px-2 py-0.5 rounded-md">
                    {s._count?.courseDetails ?? 0} curso(s) vinculado(s)
                  </span>
                </div>
                {s.description && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{s.description}</p>
                )}

                {/* Enlace */}
                {s.logoUrl && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 max-w-full">
                      <LinkIcon size={12} className="text-custom-celeste shrink-0" />
                      <span
                        className="truncate max-w-[260px] sm:max-w-[460px] font-mono text-[11px] select-all cursor-text"
                        title={s.logoUrl}
                      >
                        {s.logoUrl.startsWith('data:') ? 'Imagen WebP (Base64 embebida)' : s.logoUrl}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setEditingSponsor(s); setModalOpen(true) }}
                  className="p-2 text-slate-500 hover:text-custom-celeste hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Editar"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setConfirmDelete(s)}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {modalOpen && (
        <SponsorModal
          sponsor={editingSponsor}
          onClose={() => setModalOpen(false)}
          onSaved={load}
          showToast={showToast}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <Trash2 size={20} />
              <h3 className="font-bold text-slate-800 font-nunito">Eliminar patrocinador</h3>
            </div>
            <p className="text-sm text-slate-600 font-nunito">
              ¿Eliminás a <strong>{confirmDelete.name}</strong>? Los cursos asociados quedarán sin patrocinador.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="text-sm font-semibold text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deleting}
                className="flex items-center gap-2 text-sm font-semibold bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'general', label: 'Configuración General', icon: Settings2 },
  { id: 'patrocinadores', label: 'Patrocinadores', icon: ImageIcon },
]

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-custom-azul-oscuro/10 flex items-center justify-center shrink-0">
          <Settings2 size={20} className="text-custom-azul-oscuro" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-nunito leading-tight">Configuración</h1>
          <p className="text-xs text-slate-500 font-nunito">Gestión de configuración institucional y patrocinadores</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-nunito transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-custom-azul-oscuro shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'general' && <TabGeneral showToast={showToast} />}
        {activeTab === 'patrocinadores' && <TabPatrocinadores showToast={showToast} />}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
