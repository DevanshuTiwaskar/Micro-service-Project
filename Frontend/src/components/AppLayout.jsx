// import React from "react";
// import { Outlet } from "react-router-dom";
// import { usePlayer } from "../context/PlayerContext.jsx";

// // Components
// import Navbar from "./Navbar.jsx";
// import Sidebar from "./Sidebar.jsx";
// import Player from "./Player.jsx";
// import CreatePlaylistModal from "./CreatePlaylistModal.jsx";
// // MobileSidebar can be added later
// // import MobileSidebar from "./MobileSidebar.jsx";

// export default function AppLayout() {
//   const { currentSong, playNext, playPrev } = usePlayer();

//   return (
//     // This is the main shell for the logged-in app
//     <div className="h-screen w-full flex flex-col bg-background text-white overflow-hidden">
//       <Navbar />

//       <div className="flex-1 flex overflow-hidden">
//         {/* The permanent sidebar */}
//         <Sidebar />

//         {/* The scrollable main content area */}
//         <main className="flex-1 overflow-y-auto">
//           {/* Child routes (Dashboard, Library, etc.) render here */}
//           <Outlet />
//         </main>
//       </div>

//       {/* The persistent player bar */}
//       {currentSong && (
//         <Player
//           songToPlay={currentSong}
//           onPlayNext={playNext}
//           onPlayPrev={playPrev}
//         />
//       )}
      
//       {/* Modals float above everything */}
//       <CreatePlaylistModal />
//       <MobileSidebar />
//     </div>
//   );
// }