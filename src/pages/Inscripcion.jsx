import Home from './Home'

export default function Inscripcion() {
  return (
    <div className="space-y-2 font-nunito">
      <div>
        <h2 className="font-nunito font-extrabold text-3xl text-custom-azul-oscuro tracking-tight">
          Inscripción a cursos
        </h2>
        <p className="text-sm font-medium text-custom-gris-claro mt-1">
          Esta es la oferta abierta. Elegí un curso y anotate.
        </p>
      </div>
      <Home embedded />
    </div>
  )
}
