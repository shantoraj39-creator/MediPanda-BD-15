
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Loader2, Crop, RotateCw, RotateCcw, Check, X, RefreshCw, Camera, ZoomIn, ZoomOut, Grid3X3, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShoppingCart, Info } from 'lucide-react';
import { Medicine } from '../types';
import { analyzePrescriptionImage } from '../services/genai';

interface CropState {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const CameraCapture: React.FC<{ onCapture: (img: string) => void; onClose: () => void }> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera access error:", e);
        alert("Unable to access camera. Please ensure you have granted permission.");
        onClose();
      }
    };
    startCam();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
  }, [onClose]);

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      onCapture(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col animate-fade-in">
       <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70">
             <X className="w-6 h-6" />
          </button>
       </div>
       <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
       </div>
       <div className="h-32 bg-black/90 flex items-center justify-center pb-8">
           <button 
             onClick={capture} 
             className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
           >
              <div className="w-16 h-16 bg-white rounded-full border-2 border-black/10" />
           </button>
       </div>
    </div>
  );
};

const ImageEditorTool: React.FC<{ 
  src: string; 
  onSave: (newImage: string) => void; 
  onCancel: () => void; 
}> = ({ src, onSave, onCancel }) => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [crop, setCrop] = useState<CropState>({ top: 10, bottom: 10, left: 10, right: 10 });
  const [activeTab, setActiveTab] = useState<'transform' | 'crop'>('crop');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageObj(img);
  }, [src]);

  // Render the canvas based on rotation and source image
  useEffect(() => {
    if (imageObj && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate new dimensions based on rotation
      const angleInRad = (rotation * Math.PI) / 180;
      const width = imageObj.width;
      const height = imageObj.height;

      const newWidth = Math.abs(width * Math.cos(angleInRad)) + Math.abs(height * Math.sin(angleInRad));
      const newHeight = Math.abs(width * Math.sin(angleInRad)) + Math.abs(height * Math.cos(angleInRad));

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.clearRect(0, 0, newWidth, newHeight);
      ctx.save();
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(angleInRad);
      ctx.drawImage(imageObj, -width / 2, -height / 2);
      ctx.restore();
    }
  }, [imageObj, rotation]);

  const handleSave = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Create a temporary canvas for the cropped result
    const tempCanvas = document.createElement('canvas');
    const w = canvas.width;
    const h = canvas.height;
    
    // Calculate crop dimensions
    const cropX = w * (crop.left / 100);
    const cropY = h * (crop.top / 100);
    const cropW = w * (1 - (crop.left + crop.right) / 100);
    const cropH = h * (1 - (crop.top + crop.bottom) / 100);

    if (cropW <= 0 || cropH <= 0) return;

    tempCanvas.width = cropW;
    tempCanvas.height = cropH;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      onSave(tempCanvas.toDataURL('image/png'));
    }
  };

  const adjustCrop = (direction: keyof CropState, amount: number) => {
    setCrop(prev => {
      const newVal = Math.max(0, Math.min(50, prev[direction] + amount));
      return { ...prev, [direction]: newVal };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-fade-in">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Crop className="w-4 h-4 text-pink-500" /> Edit Prescription
        </h3>
        <div className="flex gap-4">
           <button 
             onClick={() => { setRotation(0); setScale(1); setCrop({top: 10, bottom: 10, left: 10, right: 10}); }}
             className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
           >
             <RefreshCw className="w-3 h-3" /> Reset
           </button>
           <button onClick={handleSave} className="text-pink-500 font-bold hover:text-pink-400 flex items-center gap-1">
             <Check className="w-5 h-5" /> Done
           </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 w-full bg-[#1a1a1a] overflow-hidden flex items-center justify-center p-8 touch-none">
        {/* Zoomable Container */}
        <div 
          className="relative transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="relative shadow-2xl bg-black">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-[60vh] object-contain block"
            />
            
            {/* Crop Overlay & Grid - Only show in Crop mode */}
            {activeTab === 'crop' && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Dimmed Areas */}
                <div className="absolute top-0 left-0 right-0 bg-black/70 transition-all duration-75" style={{ height: `${crop.top}%` }} />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 transition-all duration-75" style={{ height: `${crop.bottom}%` }} />
                <div className="absolute top-0 left-0 bottom-0 bg-black/70 transition-all duration-75" style={{ top: `${crop.top}%`, bottom: `${crop.bottom}%`, width: `${crop.left}%` }} />
                <div className="absolute top-0 right-0 bottom-0 bg-black/70 transition-all duration-75" style={{ top: `${crop.top}%`, bottom: `${crop.bottom}%`, width: `${crop.right}%` }} />
                
                {/* Active Crop Area Border */}
                <div 
                  className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)] box-border"
                  style={{
                    top: `${crop.top}%`,
                    bottom: `${crop.bottom}%`,
                    left: `${crop.left}%`,
                    right: `${crop.right}%`
                  }}
                >
                  {/* Rule of Thirds Grid */}
                  <div className="w-full h-full flex flex-col opacity-50">
                     <div className="flex-1 border-b border-white/30 flex">
                        <div className="flex-1 border-r border-white/30"></div>
                        <div className="flex-1 border-r border-white/30"></div>
                        <div className="flex-1"></div>
                     </div>
                     <div className="flex-1 border-b border-white/30 flex">
                        <div className="flex-1 border-r border-white/30"></div>
                        <div className="flex-1 border-r border-white/30"></div>
                        <div className="flex-1"></div>
                     </div>
                     <div className="flex-1 flex">
                        <div className="flex-1 border-r border-white/30"></div>
                        <div className="flex-1 border-r border-white/30"></div>
                        <div className="flex-1"></div>
                     </div>
                  </div>

                  {/* Visual Corner Handles */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-pink-500" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-pink-500" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-pink-500" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-pink-500" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Controls (Zoom) Floating */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-gray-800/80 backdrop-blur rounded-full px-4 py-2 flex items-center gap-4 text-white shadow-lg border border-gray-700 z-20">
           <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="hover:text-pink-400 p-1"><ZoomOut className="w-4 h-4" /></button>
           <span className="text-xs font-mono w-10 text-center select-none">{Math.round(scale * 100)}%</span>
           <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="hover:text-pink-400 p-1"><ZoomIn className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full bg-gray-900 border-t border-gray-800 p-4 pb-8 space-y-4 z-10">
        {/* Tabs */}
        <div className="flex justify-center mb-2">
           <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
              <button 
                onClick={() => setActiveTab('crop')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === 'crop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Crop & Resize
              </button>
              <button 
                onClick={() => setActiveTab('transform')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === 'transform' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Rotate
              </button>
           </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'crop' && (
           <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                 <button onClick={() => adjustCrop('top', 2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowDown className="w-5 h-5" /></button>
                 <span className="text-[10px] text-gray-500 uppercase font-bold">Top</span>
                 <button onClick={() => adjustCrop('top', -2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowUp className="w-5 h-5" /></button>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-center gap-1">
                    <button onClick={() => adjustCrop('left', 2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowRight className="w-5 h-5" /></button>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Left</span>
                    <button onClick={() => adjustCrop('left', -2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
                 </div>
                 
                 <div className="w-16 h-16 border border-gray-700 rounded-xl flex items-center justify-center bg-gray-800/50">
                    <Grid3X3 className="w-8 h-8 text-pink-500" />
                 </div>

                 <div className="flex flex-col items-center gap-1">
                    <button onClick={() => adjustCrop('right', -2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowRight className="w-5 h-5" /></button>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Right</span>
                    <button onClick={() => adjustCrop('right', 2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                 <button onClick={() => adjustCrop('bottom', -2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowUp className="w-5 h-5" /></button>
                 <span className="text-[10px] text-gray-500 uppercase font-bold">Bottom</span>
                 <button onClick={() => adjustCrop('bottom', 2)} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 text-white active:scale-95"><ArrowDown className="w-5 h-5" /></button>
              </div>
           </div>
        )}

        {activeTab === 'transform' && (
           <div className="flex items-center justify-center gap-8 py-2">
              <button 
                onClick={() => setRotation(r => r - 90)}
                className="flex flex-col items-center gap-2 text-gray-400 hover:text-white group"
              >
                <div className="p-4 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors">
                   <RotateCcw className="w-6 h-6" />
                </div>
                <span className="text-xs">Left 90°</span>
              </button>

              <button 
                onClick={() => setRotation(r => r + 90)}
                className="flex flex-col items-center gap-2 text-gray-400 hover:text-white group"
              >
                <div className="p-4 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors">
                   <RotateCw className="w-6 h-6" />
                </div>
                <span className="text-xs">Right 90°</span>
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

const PrescriptionScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false); // Track if analysis ran
  const [extractedMedicines, setExtractedMedicines] = useState<Medicine[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImage(e.target.result);
          setIsEditing(true);
          setHasAnalyzed(false); // Reset on new image
          setExtractedMedicines([]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (imgStr: string) => {
    setImage(imgStr);
    setIsCameraOpen(false);
    setIsEditing(true);
    setHasAnalyzed(false); // Reset on new capture
    setExtractedMedicines([]);
  };

  const handleSaveEdit = (newImage: string) => {
    setImage(newImage);
    setIsEditing(false);
    setHasAnalyzed(false); // Reset analysis state after edit
    setExtractedMedicines([]);
    // Do NOT auto-analyze. Wait for user trigger.
  };

  const analyzePrescription = async (img: string) => {
    setIsAnalyzing(true);
    setExtractedMedicines([]);
    setHasAnalyzed(false);
    try {
      const results = await analyzePrescriptionImage(img);
      // Map results to add IDs and store
      const mappedResults = results.map((item: any, index: number) => ({
        id: `scan_${Date.now()}_${index}`,
        name: item.name || 'Unknown',
        genericName: item.genericName || 'Generic',
        price: item.price || 0,
        type: item.type || 'Medicine',
        sideEffects: item.sideEffects,
        store: 'Nearby Pharmacy'
      }));
      setExtractedMedicines(mappedResults);
      setHasAnalyzed(true);
    } catch (e) {
      alert("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToCart = (med: Medicine) => {
    // In a real app, this would dispatch to cart context
    alert(`Added ${med.name} to cart!`);
  };

  if (isCameraOpen) {
    return <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />;
  }

  if (isEditing && image) {
    return <ImageEditorTool src={image} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="bg-white min-h-screen pb-20 animate-fade-in relative z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-6 rounded-b-[2.5rem] shadow-xl text-white text-center relative overflow-hidden">
         <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-1">Smart Rx Scanner</h1>
            <p className="text-pink-100 text-sm">Upload a prescription to segregate medicines</p>
         </div>
         <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-24 h-24" /></div>
      </div>

      <div className="p-4 -mt-8">
         <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-center space-y-6">
            {!image ? (
               <>
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                     <ImageIcon className="w-10 h-10" />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-800 text-lg">No Image Selected</h3>
                     <p className="text-gray-500 text-sm">Take a photo or upload from gallery</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setIsCameraOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 bg-pink-50 hover:bg-pink-100 p-4 rounded-2xl border-2 border-pink-100 transition-colors group"
                     >
                        <div className="bg-white p-3 rounded-full shadow-sm text-pink-600 group-hover:scale-110 transition-transform">
                           <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Camera</span>
                     </button>
                     
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 p-4 rounded-2xl border-2 border-purple-100 transition-colors group"
                     >
                        <div className="bg-white p-3 rounded-full shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                           <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Gallery</span>
                     </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               </>
            ) : (
               <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                     <img src={image} alt="Prescription" className="w-full object-contain max-h-[300px]" />
                     <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white"
                     >
                        <Crop className="w-3 h-3" /> Edit / Crop
                     </button>
                  </div>

                  {!isAnalyzing && (
                    <button 
                        onClick={() => image && analyzePrescription(image)}
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" /> Analyze Prescription
                    </button>
                  )}

                  {isAnalyzing && (
                     <div className="py-8 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-pink-600 animate-spin mx-auto" />
                        <h3 className="font-bold text-gray-800">Analyzing Prescription...</h3>
                        <p className="text-xs text-gray-500">Identifying medicines and dosages using AI</p>
                     </div>
                  )}

                  {!isAnalyzing && hasAnalyzed && (
                     <div className="text-left animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="font-bold text-gray-800 flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-500" /> Extracted Medicines
                           </h3>
                           <button onClick={() => {
                               setImage(null);
                               setHasAnalyzed(false);
                               setExtractedMedicines([]);
                           }} className="text-xs text-red-500 font-bold hover:underline">
                              Clear All
                           </button>
                        </div>
                        
                        {extractedMedicines.length === 0 ? (
                           <div className="text-center py-4 bg-gray-50 rounded-xl">
                              <p className="text-sm text-gray-500">No medicines detected. Try cropping or a clearer photo.</p>
                           </div>
                        ) : (
                           <div className="space-y-3">
                              {extractedMedicines.map(med => (
                                 <div key={med.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm">
                                                {med.type?.toLowerCase().includes('syrup') ? '🧴' : '💊'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{med.name}</p>
                                                <p className="text-xs text-gray-500">{med.genericName} • {med.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-pink-600 text-sm">৳{med.price}</span>
                                            <button 
                                                onClick={() => addToCart(med)}
                                                className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 shadow-md active:scale-95"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {med.sideEffects && (
                                        <div className="flex items-start gap-1 text-[10px] text-orange-600 bg-orange-50 p-2 rounded-lg mt-1">
                                            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                            <span>Side Effects: {med.sideEffects}</span>
                                        </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default PrescriptionScanner;
