import { QRCodeSVG } from 'qrcode.react'
import { User } from 'lucide-react'

const AZUL = '#166193'
const CELESTE = '#37A6DE'

/**
 * Misma credencial que la pantalla de asistencia de la app:
 * degradé azul–celeste, iniciales en círculo, nombre, DNI y QR azul con el sello.
 */
export default function StudentCredential({ name, dni, token, variant = 'screen' }) {
  const qrSize = variant === 'print' ? 248 : 220
  const logoSize = Math.round(qrSize * 0.46)

  return (
    <div
      className={variant === 'print' ? 'credential-sheet credential-sheet-print' : 'credential-sheet'}
      style={{
        background: `linear-gradient(135deg, ${AZUL} 0%, ${CELESTE} 100%)`,
        color: '#ffffff',
        borderRadius: variant === 'print' ? 18 : 16,
        padding: variant === 'print' ? '28px 18px 24px' : '22px 16px 18px',
        textAlign: 'center',
        width: variant === 'print' ? '92mm' : '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
        }}
      >
        <User size={40} color={AZUL} strokeWidth={2} />
      </div>

      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: 24,
          lineHeight: 1.15,
          margin: 0,
          color: '#ffffff',
        }}
      >
        {name || 'Alumno'}
      </p>
      {dni ? (
        <p
          style={{
            fontFamily: '"Roboto Flex", sans-serif',
            fontWeight: 400,
            fontSize: 15,
            margin: '6px 0 0',
            color: '#ffffff',
          }}
        >
          DNI: {dni}
        </p>
      ) : null}

      <div
        style={{
          marginTop: 16,
          background: '#ffffff',
          borderRadius: 16,
          padding: 14,
          display: 'inline-block',
          boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
        }}
      >
        {token ? (
          <div style={{ position: 'relative', width: qrSize, height: qrSize }}>
            <QRCodeSVG
              value={token}
              size={qrSize}
              level="H"
              marginSize={0}
              fgColor={AZUL}
              bgColor="#ffffff"
              title={`Credencial de ${name || 'alumno'}`}
            />
            <img
              src="/cfl-sello.svg"
              alt=""
              style={{
                position: 'absolute',
                width: logoSize,
                height: logoSize,
                left: (qrSize - logoSize) / 2,
                top: (qrSize - logoSize) / 2,
                borderRadius: '50%',
                background: '#ffffff',
                objectFit: 'cover',
              }}
            />
          </div>
        ) : (
          <p style={{ color: AZUL, fontFamily: 'Nunito, sans-serif', fontWeight: 700, margin: 0 }}>
            Sin token de asistencia
          </p>
        )}
      </div>

      <p
        style={{
          fontFamily: '"Roboto Flex", sans-serif',
          fontSize: 13,
          lineHeight: 1.35,
          color: 'rgba(255,255,255,0.95)',
          margin: '16px auto 0',
          maxWidth: 260,
        }}
      >
        Presentá este código QR para registrar tu asistencia
      </p>
    </div>
  )
}
