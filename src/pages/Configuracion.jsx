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
  Megaphone,
  Landmark,
} from 'lucide-react'

import {
  getAllSettings,
  updateSetting,
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  getAvisos,
  createAviso,
  updateAviso,
  archiveAviso,
} from '../services/settingsService'
import { GET } from '../services/api'

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
          <div key={s.key} className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between gap-3 bg-custom-azul-oscuro text-white text-xs font-bold uppercase tracking-wider px-4 py-3">
              <span className="font-mono normal-case tracking-normal">{s.key}</span>
            </div>
            <div className="p-5 space-y-3">
            <div className="flex items-center justify-end">
              <button
                onClick={() => handleSave(s.key)}
                disabled={saving[s.key]}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving[s.key] ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Save size={14} className="text-custom-amarillo" />
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
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
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-custom-azul-oscuro hover:bg-custom-azul-oscuro/95 text-white hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} className="text-custom-amarillo" /> Nuevo patrocinador
        </button>
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 p-10 text-center">
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
            <div key={s.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-custom-gris-claro/10 dark:border-slate-800 overflow-hidden">
              <div className="bg-custom-azul-oscuro text-white text-xs font-bold uppercase tracking-wider px-4 py-3">
                {s.name}
              </div>
              <div className="p-4 flex items-start sm:items-center gap-4">
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
                    {s._count?.courseSponsors ?? 0} curso(s) vinculado(s)
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
const EMPTY_AVISO = {
  title: '',
  body: '',
  type: 'academico',
  audience: 'alumnos',
  courseId: '',
  priority: 0,
  publication: 'borrador',
  startsAt: '',
  endsAt: '',
}

function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function TabAvisos({ showToast }) {
  const [avisos, setAvisos] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_AVISO)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [avisoData, courseData] = await Promise.all([
        getAvisos(),
        GET('/courses').catch(() => []),
      ])
      setAvisos(avisoData.avisos || [])
      const list = Array.isArray(courseData) ? courseData : courseData.courses || []
      setCourses(list)
    } catch {
      showToast('Error al cargar avisos', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const startEdit = (aviso) => {
    setEditingId(aviso.id)
    setForm({
      title: aviso.title,
      body: aviso.body,
      type: aviso.type,
      audience: aviso.audience,
      courseId: aviso.courseId || '',
      priority: aviso.priority ?? 0,
      publication: aviso.publication,
      startsAt: toDateInput(aviso.startsAt),
      endsAt: toDateInput(aviso.endsAt),
    })
  }

  const payload = () => ({
    title: form.title.trim(),
    body: form.body.trim(),
    type: form.type,
    audience: form.audience,
    courseId: form.courseId || null,
    priority: Number(form.priority) || 0,
    publication: form.publication,
    startsAt: form.startsAt || null,
    endsAt: form.endsAt || null,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) await updateAviso(editingId, payload())
      else await createAviso(payload())
      setForm(EMPTY_AVISO)
      setEditingId(null)
      showToast(editingId ? 'Aviso actualizado' : 'Aviso creado')
      await load()
    } catch (error) {
      showToast(error.message || 'No se pudo guardar el aviso', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async (id) => {
    try {
      await archiveAviso(id)
      showToast('Aviso archivado')
      await load()
    } catch (error) {
      showToast(error.message || 'No se pudo archivar', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 font-nunito">
          {editingId ? 'Editar aviso' : 'Nuevo aviso'}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Título" value={form.title} onChange={(e) => setField('title', e.target.value)} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="number" placeholder="Prioridad" value={form.priority} onChange={(e) => setField('priority', e.target.value)} />
          <textarea className="border rounded-lg px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Cuerpo" value={form.body} onChange={(e) => setField('body', e.target.value)} />
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.type} onChange={(e) => setField('type', e.target.value)}>
            <option value="academico">Académico</option>
            <option value="operativo">Operativo</option>
            <option value="informativo">Informativo</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.audience} onChange={(e) => setField('audience', e.target.value)}>
            <option value="alumnos">Alumnos</option>
            <option value="todos">Todos</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.courseId} onChange={(e) => setField('courseId', e.target.value)}>
            <option value="">Sin curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.publication} onChange={(e) => setField('publication', e.target.value)}>
            <option value="borrador">Borrador</option>
            <option value="publicado">Publicado</option>
            <option value="archivado">Archivado</option>
          </select>
          <label className="text-xs text-slate-500">
            Desde
            <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" type="datetime-local" value={form.startsAt} onChange={(e) => setField('startsAt', e.target.value)} />
          </label>
          <label className="text-xs text-slate-500">
            Hasta
            <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" type="datetime-local" value={form.endsAt} onChange={(e) => setField('endsAt', e.target.value)} />
          </label>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={saving} onClick={handleSave} className="bg-custom-azul-oscuro text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer disabled:opacity-60">
            <Save size={14} className="inline mr-1" />
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_AVISO) }} className="text-sm px-4 py-2 rounded-lg border cursor-pointer">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-500">Cargando avisos…</p> : (
        <div className="space-y-3">
          {avisos.map((aviso) => (
            <div key={aviso.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{aviso.title}</p>
                <p className="text-sm text-slate-600">{aviso.body}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {aviso.type} · {aviso.audience} · {aviso.publication}
                  {aviso.course?.name ? ` · ${aviso.course.name}` : ''}
                  {` · prioridad ${aviso.priority}`}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => startEdit(aviso)} className="p-2 rounded-lg border cursor-pointer" aria-label="Editar aviso">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => handleArchive(aviso.id)} className="p-2 rounded-lg border cursor-pointer" aria-label="Archivar aviso">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {avisos.length === 0 && <p className="text-sm text-slate-500">No hay avisos cargados.</p>}
        </div>
      )}
    </div>
  )
}

function TabContenido({ showToast }) {
  const [contacto, setContacto] = useState({ phone: '', email: '', address: '', city: '', schedule: '', institutionName: '' })
  const [banco, setBanco] = useState({ banco: '', alias: '', cbu: '', cuit: '', whatsappNumber: '', whatsappMessage: '', monthlyAmount: '' })
  const [beneficios, setBeneficios] = useState([])
  const [contactoBase, setContactoBase] = useState(null)
  const [bancoBase, setBancoBase] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      GET('/api/mobile/contacto-publico'),
      GET('/api/mobile/cooperadora-publica'),
      GET('/api/mobile/beneficios-publicos'),
    ]).then(([contact, coop, benefits]) => {
      setContactoBase(contact)
      setContacto({
        phone: contact.phone || '',
        email: contact.email || '',
        address: contact.address || '',
        city: contact.city || '',
        schedule: contact.schedule || '',
        institutionName: contact.institutionName || '',
      })
      setBancoBase(coop.bank || {})
      setBanco({
        banco: coop.bank?.banco || '',
        alias: coop.bank?.alias || '',
        cbu: coop.bank?.cbu || '',
        cuit: coop.bank?.cuit || '',
        whatsappNumber: coop.bank?.whatsappNumber || '',
        whatsappMessage: coop.bank?.whatsappMessage || '',
        monthlyAmount: coop.monthlyAmount ?? '',
      })
      setBeneficios(Array.isArray(benefits.beneficios) ? benefits.beneficios : [])
    }).catch(() => showToast('No se pudo cargar el contenido de la app', 'error'))
  }, [showToast])

  const save = async () => {
    setSaving(true)
    try {
      await updateSetting('mobile.contacto', {
        value: JSON.stringify({ ...(contactoBase || {}), ...contacto }),
        name: 'Contacto de la app',
      })
      await updateSetting('mobile.cooperadora', {
        value: JSON.stringify({
          ...(bancoBase || {}),
          ...banco,
          monthlyAmount: Number(banco.monthlyAmount) || 0,
        }),
        name: 'Cooperadora de la app',
      })
      await updateSetting('mobile.beneficios', {
        value: JSON.stringify(beneficios),
        name: 'Beneficios de la app',
      })
      showToast('Contenido de la app guardado')
    } catch (error) {
      showToast(error.message || 'No se pudo guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  const field = (label, value, onChange) => (
    <label className="text-xs text-slate-500 block">
      {label}
      <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-slate-800" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h2 className="text-sm font-bold text-slate-700">Contacto</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {field('Teléfono', contacto.phone, (value) => setContacto((p) => ({ ...p, phone: value })))}
          {field('Email', contacto.email, (value) => setContacto((p) => ({ ...p, email: value })))}
          {field('Dirección', contacto.address, (value) => setContacto((p) => ({ ...p, address: value })))}
          {field('Ciudad', contacto.city, (value) => setContacto((p) => ({ ...p, city: value })))}
          {field('Horario', contacto.schedule, (value) => setContacto((p) => ({ ...p, schedule: value })))}
          {field('Institución', contacto.institutionName, (value) => setContacto((p) => ({ ...p, institutionName: value })))}
        </div>
      </section>
      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h2 className="text-sm font-bold text-slate-700">Cooperadora</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {field('Banco', banco.banco, (value) => setBanco((p) => ({ ...p, banco: value })))}
          {field('Alias', banco.alias, (value) => setBanco((p) => ({ ...p, alias: value })))}
          {field('CBU', banco.cbu, (value) => setBanco((p) => ({ ...p, cbu: value })))}
          {field('CUIT', banco.cuit, (value) => setBanco((p) => ({ ...p, cuit: value })))}
          {field('WhatsApp', banco.whatsappNumber, (value) => setBanco((p) => ({ ...p, whatsappNumber: value })))}
          {field('Monto mensual', banco.monthlyAmount, (value) => setBanco((p) => ({ ...p, monthlyAmount: value })))}
        </div>
      </section>
      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">Beneficios</h2>
          <button type="button" className="text-sm font-semibold text-custom-azul-oscuro cursor-pointer" onClick={() => setBeneficios((prev) => [...prev, { id: Date.now(), nombre: '', rubro: '', descuento: '', telefono: '', descripcion: '' }])}>
            <Plus size={14} className="inline" /> Agregar
          </button>
        </div>
        {beneficios.map((item, index) => (
          <div key={item.id || index} className="grid gap-2 md:grid-cols-2 border rounded-xl p-3">
            {field('Nombre', item.nombre || '', (value) => setBeneficios((prev) => prev.map((row, i) => i === index ? { ...row, nombre: value } : row)))}
            {field('Rubro', item.rubro || '', (value) => setBeneficios((prev) => prev.map((row, i) => i === index ? { ...row, rubro: value } : row)))}
            {field('Descuento', item.descuento || '', (value) => setBeneficios((prev) => prev.map((row, i) => i === index ? { ...row, descuento: value } : row)))}
            {field('Teléfono', item.telefono || '', (value) => setBeneficios((prev) => prev.map((row, i) => i === index ? { ...row, telefono: value } : row)))}
          </div>
        ))}
      </section>
      <button type="button" disabled={saving} onClick={save} className="bg-custom-azul-oscuro text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer disabled:opacity-60">
        {saving ? 'Guardando…' : 'Guardar contenido'}
      </button>
    </div>
  )
}

const TABS = [
  { id: 'general', label: 'Configuración General', icon: Settings2 },
  { id: 'patrocinadores', label: 'Patrocinadores', icon: ImageIcon },
  { id: 'avisos', label: 'Avisos', icon: Megaphone },
  { id: 'contenido', label: 'App y web', icon: Landmark },
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
        {activeTab === 'avisos' && <TabAvisos showToast={showToast} />}
        {activeTab === 'contenido' && <TabContenido showToast={showToast} />}
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
