import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.jpg"

function App() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState("image/jpeg");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb > 1024
      ? `${(kb / 1024).toFixed(2)} MB`
      : `${kb.toFixed(2)} KB`;
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setOriginalSize(file.size);
    setPreview(URL.createObjectURL(file));
  };

  const handleCompress = () => {
    if (!image) return;

    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const compressedUrl = URL.createObjectURL(blob);
          setCompressed(compressedUrl);
          setCompressedSize(blob.size);
        },
        format,
        quality
      );
    };
  };

  
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (compressed) URL.revokeObjectURL(compressed);
    };
  }, [preview, compressed]);

  return (
    <div className="h-screen bg-gray-300 flex flex-col">
      
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        
        <div className="flex items-center space-x-2">
          <img
            src= {logo}
            alt="Logo"
            className=" h-10"
          />
          
        </div>

        <a
          href="https://github.com/Coder-Neon" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          GitHub
        </a>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Image Compressor
          </h1>

          
          <label className="flex items-center justify-center h-32 w-full border-dashed border-2 border-blue-200 rounded-xl cursor-pointer bg-blue-50">
            <span className="text-gray-500">
              Drag & Drop or Click to upload
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          
          {preview && (
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold">Preview</h2>
              <img
                src={preview}
                alt="Preview"
                className="mx-auto w-48 h-48 object-contain rounded-xl border mt-2"
              />
              <p className="mt-2 text-sm text-gray-600">
                Original Size: {formatSize(originalSize)}
              </p>
            </div>
          )}

         
          {image && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Quality: {quality}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Convert To:</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full border rounded p-1"
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>

              <button
                className="bg-blue-600 p-2 rounded-lg text-white font-bold w-full"
                onClick={handleCompress}
              >
                Convert & Compress
              </button>
            </div>
          )}

          
          {compressed && (
            <div className="mt-6 text-center">
              <h2 className="text-lg font-semibold">Compressed Image</h2>
              <img
                src={compressed}
                alt="Compressed"
                className="mx-auto w-48 h-48 object-contain rounded-xl border mt-2"
              />
              <p className="mt-2 text-sm text-gray-600">
                Compressed Size: {formatSize(compressedSize)} <br />
                Compression Ratio:{" "}
                {((compressedSize / originalSize) * 100).toFixed(1)}%
              </p>
              <a
                href={compressed}
                download={`compressed.${format.split("/")[1]}`}
                className="mt-3 inline-block bg-green-600 px-4 py-2 rounded-lg text-white font-bold"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
