import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path - this is critical!
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function FileUpload({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setError('');
    setFile(selectedFile);
  }

  async function extractTextFromPDF(file) {
    setProgress('Reading file...');
    
    const fileReader = new FileReader();
    
    return new Promise((resolve, reject) => {
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result);
          
          setProgress('Loading PDF...');
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          
          const numPages = pdf.numPages;
          let fullText = '';
          
          setProgress(`Extracting text from ${numPages} pages...`);
          
          // Extract text from each page
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            setProgress(`Processing page ${pageNum} of ${numPages}...`);
            
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items
              .map(item => item.str)
              .join(' ')
              .trim();
            
            if (pageText) {
              fullText += pageText + '\n\n';
            }
          }
          
          resolve(fullText.trim());
        } catch (err) {
          console.error('PDF extraction error:', err);
          reject(err);
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      fileReader.readAsArrayBuffer(file);
    });
  }

  async function handleUpload() {
    if (!file) return;
    
    setUploading(true);
    setError('');
    setProgress('');
    
    try {
      const extractedText = await extractTextFromPDF(file);
      
      console.log('Extracted text length:', extractedText.length);
      console.log('First 200 chars:', extractedText.substring(0, 200));
      
      if (!extractedText || extractedText.length < 50) {
        setError('Unable to extract enough text from PDF. This might be a scanned image or have no selectable text. Please try the "Paste Text" option instead.');
        setUploading(false);
        return;
      }
      
      setProgress('Text extracted! Starting analysis...');
      onTextExtracted(extractedText);
      setFile(null);
      setProgress('');
    } catch (err) {
      console.error('Error extracting text:', err);
      setError(`Failed to extract text from PDF: ${err.message}. Please try the "Paste Text" option instead.`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">PDF Extraction Failed</p>
          <p>{error}</p>
        </div>
      )}

      {progress && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg text-sm">
          {progress}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-600 dark:hover:border-blue-400 transition">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF only (max 10MB)</p>
        </label>
      </div>

      {file && !uploading && (
        <button onClick={handleUpload} className="btn-primary w-full">
          Extract Text & Analyze
        </button>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Extracting text from PDF...</p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300">
        <p className="font-semibold mb-1">💡 Tip:</p>
        <p>If PDF extraction fails, your resume might be a scanned image. Try using the "Paste Text" tab instead, or convert your PDF to text first.</p>
      </div>
    </div>
  );
}