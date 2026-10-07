import { useState } from 'react'

export default function CourseCover({ course, className = '', imgClassName = 'w-full h-full object-cover' }) {
  const [failed, setFailed] = useState(false)

  if (!course?.image || failed) {
    return (
      <div className={`bg-gradient-to-br from-[#166193] to-[#37ACDE] flex items-end ${className}`}>
        <span className="m-3 text-white/90 text-xs font-bold uppercase tracking-wider">
          {course?.category || 'Curso'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={course.image}
      alt={course.name}
      className={imgClassName}
      onError={() => setFailed(true)}
    />
  )
}
