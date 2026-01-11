import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div className="relative h-screen w-full bg-[#030712] flex flex-col items-center justify-center overflow-hidden font-sans">

      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 backdrop-blur-md bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl text-center max-w-lg mx-4"
      >

        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-8xl mb-6 inline-block"
        >
          👨‍🚀
        </motion.div>

        <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-lg">
          404
        </h1>

        <h2 className="text-3xl font-bold text-white mt-4">
          Galti se Mistake Ho Gayi!
        </h2>
        
        <p className="text-gray-400 mt-4 leading-relaxed">
          Aap shayad internet ke uss hisse mein aa gaye hain jahan humne abhi tak rasta nahi banaya. 
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>navigate("/")}
            className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full transition-all"
          >
            Home Page
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            onClick={() => navigate(-1)}
            className="px-8 py-3 border border-white/20 text-white font-medium rounded-full transition-all"
          >
            Peeche Jao
          </motion.button>
        </div>
      </motion.div>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
    </div>
  );
};

export default NotFound;