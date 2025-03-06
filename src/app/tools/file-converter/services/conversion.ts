import * as pdfjsLib from 'pdfjs-dist';

// ConversionProgress interface
export interface ConversionProgress {
  progress: number;
  stage: string;
}

// Le service de conversion avec toutes les méthodes
export class ConversionService {
  // Méthode de conversion d'image
  private static async convertImage(file: File, format: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, `image/${format}`, 0.9);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Méthode de conversion de PDF en image (une page par image, format PNG)
  private static async convertPDF(file: File, format: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const pdfData = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(pdfData).promise; // Assurez-vous que pdf.js est inclus dans votre projet

          const page = await pdf.getPage(1); // Conversion de la première page du PDF en image
          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context!, viewport: viewport }).promise;

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert PDF page to image'));
            }
          }, `image/${format}`);
        } catch (err) {
          reject(new Error('Failed to convert PDF'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Méthode de conversion audio (audio to mp3 via ffmpeg.wasm)
  private static async convertAudio(file: File, format: string): Promise<Blob> {
    if (format !== 'mp3') {
      throw new Error('Currently, only mp3 conversion is supported');
    }

    // Utilisation de ffmpeg.wasm pour la conversion
    const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
    const ffmpeg = createFFmpeg({ log: true });
    
    await ffmpeg.load();

    const fileName = file.name;
    await ffmpeg.FS('writeFile', fileName, await fetchFile(file));

    // Conversion du fichier en mp3
    await ffmpeg.run('-i', fileName, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', 'output.mp3');

    // Récupération du fichier converti
    const data = ffmpeg.FS('readFile', 'output.mp3');

    const blob = new Blob([data.buffer], { type: 'audio/mp3' });

    return blob;
  }

  // Méthode de conversion vidéo (vidéo to mp4 via ffmpeg.wasm)
  private static async convertVideo(file: File, format: string): Promise<Blob> {
    if (format !== 'mp4') {
      throw new Error('Currently, only mp4 conversion is supported');
    }

    // Utilisation de ffmpeg.wasm pour la conversion
    const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
    const ffmpeg = createFFmpeg({ log: true });
    
    await ffmpeg.load();

    const fileName = file.name;
    await ffmpeg.FS('writeFile', fileName, await fetchFile(file));

    // Conversion du fichier en mp4
    await ffmpeg.run('-i', fileName, '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', 'output.mp4');

    // Récupération du fichier converti
    const data = ffmpeg.FS('readFile', 'output.mp4');

    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    return blob;
  }

  // Méthode de conversion générale
  static async convert(
    file: File,
    format: string,
    onProgress?: (progress: ConversionProgress) => void
  ): Promise<Blob> {
    try {
      onProgress?.({ progress: 0, stage: 'Starting conversion...' });

      let result: Blob;
      if (file.type.startsWith('image/')) {
        onProgress?.({ progress: 20, stage: 'Processing image...' });
        result = await this.convertImage(file, format);
      } else if (file.type === 'application/pdf') {
        onProgress?.({ progress: 20, stage: 'Processing PDF...' });
        result = await this.convertPDF(file, format);
      } else if (file.type.startsWith('audio/')) {
        onProgress?.({ progress: 20, stage: 'Processing audio...' });
        result = await this.convertAudio(file, format);
      } else if (file.type.startsWith('video/')) {
        onProgress?.({ progress: 20, stage: 'Processing video...' });
        result = await this.convertVideo(file, format);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      onProgress?.({ progress: 100, stage: 'Conversion complete!' });
      return result;
    } catch (error) {
      onProgress?.({ progress: 0, stage: 'Conversion failed' });
      throw error;
    }
  }
}
