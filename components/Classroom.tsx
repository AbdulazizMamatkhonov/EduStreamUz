
import React, { useState, useRef, useEffect } from 'react';
import { Course, AppLanguage } from '../types';
import { translations } from '../translations';
import AIAssistant from './AIAssistant';

interface ClassroomProps {
  course: Course;
  onExit: () => void;
  appLanguage: AppLanguage;
}

const Classroom: React.FC<ClassroomProps> = ({ course, onExit, appLanguage }) => {
  const t = translations[appLanguage];
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'resources' | 'participants'>('chat');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Initialize Camera Stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      screenStream?.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        setScreenStream(mediaStream);
        setIsScreenSharing(true);
        if (screenRef.current) {
          screenRef.current.srcObject = mediaStream;
        }
        
        // Handle user stopping share via browser UI
        mediaStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    }
  };

  const resources = [
    { title: "Course Syllabus.pdf", size: "1.2 MB", type: "pdf" },
    { title: "Week 1 - Source Code.zip", size: "4.5 MB", type: "zip" },
    { title: "Recommended Reading List", size: "Link", type: "link" }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col font-sans">
      {/* Dynamic Header */}
      <header className="bg-slate-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <i className="fas fa-graduation-cap text-sm"></i>
            </div>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <h2 className="font-bold text-white tracking-tight">
              {course.title} <span className="text-slate-500 font-medium ml-2">— Live Session</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              Live
            </div>
            <div className="text-slate-400 text-xs font-bold">
              <i className="fas fa-clock mr-2 text-indigo-400"></i>
              Broadcasting
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="px-5 py-2 bg-white/5 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
          >
            {t.exit_classroom}
          </button>
        </div>
      </header>

      {/* Main Learning Grid */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Primary Stream Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-black rounded-[2.5rem] overflow-hidden relative shadow-2xl group border border-white/5">
            
            {/* Main Content Area: Either Screen or Placeholder */}
            {isScreenSharing ? (
              <video 
                ref={screenRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/40">
                {!isVideoOff && !isScreenSharing ? (
                   <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-indigo-500/20">
                      <i className="fas fa-user text-slate-600 text-5xl"></i>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for video...</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Overlay UI */}
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl border-2 border-indigo-500 overflow-hidden shadow-2xl bg-slate-800">
                    <img src={`https://i.pravatar.cc/150?u=${course.teacherId}`} alt={course.teacherName} />
                  </div>
                  <div>
                    <p className="text-white text-lg font-black">{course.teacherName}</p>
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Master Instructor</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Self View / PiP (Camera floats when sharing screen) */}
            {isScreenSharing && (
              <div className="absolute bottom-6 right-6 w-64 aspect-video bg-slate-900 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden ring-4 ring-indigo-500/20">
                 {!isVideoOff ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                      <i className="fas fa-video-slash text-slate-600 text-2xl"></i>
                   </div>
                 )}
                 <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[8px] text-white font-bold uppercase">
                   Camera Feed
                 </div>
              </div>
            )}
          </div>
          
          {/* Action Bar */}
          <div className="h-20 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 flex items-center justify-center gap-6 px-8 shadow-xl">
            <button 
              onClick={toggleMute}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-lg`}></i>
            </button>
            <button 
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
              <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'} text-lg`}></i>
            </button>
            
            <div className="h-8 w-px bg-white/5 mx-2"></div>
            
            <button 
              onClick={handleScreenShare}
              className={`h-12 px-6 rounded-2xl font-bold text-xs transition-all flex items-center gap-3 ${isScreenSharing ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              <i className={`fas ${isScreenSharing ? 'fa-stop-circle' : 'fa-desktop'} ${isScreenSharing ? '' : 'text-indigo-400'}`}></i>
              {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </button>
            <button className="h-12 px-6 bg-indigo-600 text-white rounded-2xl font-bold text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-3">
              <i className="fas fa-bullhorn"></i>
              Start Recording
            </button>

            <div className="h-8 w-px bg-white/5 mx-2"></div>
            
            <button className="w-12 h-12 rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10 flex items-center justify-center transition-all">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar - Docked AI & Social */}
        <div className="w-[380px] flex flex-col gap-4">
          <div className="flex-1 bg-slate-900 rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative">
            {/* Sidebar Tabs */}
            <div className="flex p-2 bg-black/20">
              {(['chat', 'resources', 'participants'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                    activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab === 'chat' && <i className="fas fa-comment-alt mr-2"></i>}
                  {tab === 'resources' && <i className="fas fa-folder mr-2"></i>}
                  {tab === 'participants' && <i className="fas fa-users mr-2"></i>}
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'chat' && (
                <div className="space-y-6">
                   <div className="text-center py-4">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Chat is active</p>
                   </div>
                   <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Maria Garcia</p>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                      <p className="text-sm text-slate-300 font-medium">Teacher, can you explain the screen share layout again?</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {resources.map((res, i) => (
                    <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl flex items-center justify-between group transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                          <i className={`fas ${res.type === 'pdf' ? 'fa-file-pdf' : res.type === 'zip' ? 'fa-file-archive' : 'fa-link'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{res.title}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{res.size}</p>
                        </div>
                      </div>
                      <i className="fas fa-download text-slate-600 group-hover:text-indigo-400 transition-colors"></i>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'participants' && (
                <div className="space-y-4">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <img src={`https://i.pravatar.cc/100?u=p${i}`} className="w-8 h-8 rounded-full border border-white/5" alt="" />
                         <span className="text-sm font-bold text-slate-300">Student {i}</span>
                       </div>
                       <div className="flex gap-2 text-slate-600">
                         <i className="fas fa-microphone-slash text-[10px]"></i>
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Announce to class..."
                  className="w-full bg-slate-800 border-none rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-400">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Docked AI Assistant */}
          <div className="h-64">
             <AIAssistant />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
