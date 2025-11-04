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
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50/80 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl backdrop-blur-sm slide-in-up">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold mb-1">PDF Extraction Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {progress && (
        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 px-5 py-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-semibold">{progress}</span>
          </div>
        </div>
      )}

      <div className="group relative border-3 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-10 text-center hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-indigo-50/0 group-hover:from-purple-50/50 group-hover:to-indigo-50/50 dark:group-hover:from-purple-900/20 dark:group-hover:to-indigo-900/20 transition-all duration-300"></div>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />

        <label htmlFor="file-upload" className="cursor-pointer relative z-10">
          <div className="mb-4 inline-block p-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <svg className="h-14 w-14 text-purple-600 dark:text-purple-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold text-gray-700 dark:text-gray-300">
            {file ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {file.name}
              </span>
            ) : (
              'Click to upload or drag and drop'
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            PDF only • Max 10MB
          </p>
        </label>
      </div>

      {file && !uploading && (
        <button onClick={handleUpload} className="btn-primary w-full group">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Extract Text & Analyze
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      )}

      {uploading && (
        <div className="text-center py-6">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400"></div>
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
          </div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mt-4">Extracting text from PDF...</p>
        </div>
      )}

      <div className="relative overflow-hidden bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200/50 dark:border-amber-700/30 rounded-xl p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">💡</div>
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">Pro Tip</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              If PDF extraction fails, your resume might be a scanned image. Try using the "Paste Text" tab instead, or convert your PDF to text first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}