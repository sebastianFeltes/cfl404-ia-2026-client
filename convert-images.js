import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dirsToProcess = [
  path.join(__dirname, 'public', 'images'),
  path.join(__dirname, 'src', 'assets')
]

async function convertDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const filePath = path.join(dirPath, file)
      const parsed = path.parse(file)
      const webpFileName = `${parsed.name}.webp`
      const webpFilePath = path.join(dirPath, webpFileName)

      try {
        console.log(`Convirtiendo ${file} -> ${webpFileName}...`)
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(webpFilePath)
        
        const origStats = fs.statSync(filePath)
        const newStats = fs.statSync(webpFilePath)
        console.log(`✓ Guardado ${webpFileName} (${(origStats.size / 1024).toFixed(1)}KB -> ${(newStats.size / 1024).toFixed(1)}KB)`)
      } catch (err) {
        console.error(`Error al convertir ${file}:`, err.message)
      }
    }
  }
}

async function main() {
  for (const dir of dirsToProcess) {
    console.log(`Procesando directorio: ${dir}`)
    await convertDirectory(dir)
  }
  console.log('¡Conversión de imágenes a WebP completada!')
}

main()
