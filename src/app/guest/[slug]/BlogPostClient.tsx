'use client'

import React from 'react'
import { motion, useInView} from 'framer-motion'
import Image from "next/image"
import { Download} from "lucide-react"
import html2canvas from "html2canvas";
import { useEffect, useMemo, useRef, useState } from 'react'
import ContactForm from '@/components/contactForm'
import FallingHearts from '@/components/FallingHearts';
import axios from 'axios'






interface BlogPost {
  id: string;
  guestName: string;
  guestTable: string;

}


interface BlogPostClientProps {
  post: BlogPost;
  getTemplate01: string;
  getTemplate02: string;
  getTemplate03: string;
  getTemplate04: string;
  getQrCode: string;

}

const API_URL = 'http://localhost:3001';

const BlogPostClient = ({ post, getTemplate01, getTemplate02, getTemplate03, getTemplate04, getQrCode }: BlogPostClientProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const refGoldenBook = useRef(null);
  const isInViewGoldenBook = useInView(ref, { once: true, margin: "-100px" });

  const [guestFromApi, setGuestFromApi] = useState<BlogPost | null>(null);

  // 1) Priorité: JSON Server (db.json)  2) Fallback: props (data statiques)
  useEffect(() => {
    let cancelled = false;

    async function loadGuest() {
      try {
        const res = await axios.get<BlogPost>(`${API_URL}/guests/${post.id}`);
        if (!cancelled) setGuestFromApi(res.data);
      } catch {
        if (!cancelled) setGuestFromApi(null);
      }
    }

    loadGuest();

    return () => {
      cancelled = true;
    };
  }, [post.id]);

  const resolvedPost = useMemo(() => guestFromApi ?? post, [guestFromApi, post]);


  const handleDownloadPng = async () => {
    const section = document.querySelector('section:nth-child(3)');
    if (section) {
      // Masquer le bouton avant capture
      const btn = section.querySelector('button');
      let oldDisplay = '';
      if (btn) {
        oldDisplay = btn.style.display;
        btn.style.display = 'none';
      }
      // Utiliser html2canvas
      const canvas = await html2canvas(section as HTMLElement, {useCORS: true, backgroundColor: null});
      const link = document.createElement('a');
      link.download = `invitation-${resolvedPost.guestName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      // Réafficher le bouton
      if (btn) btn.style.display = oldDisplay;
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] flex flex-col md:items-center">
      <FallingHearts />
      
      <motion.section 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                                type: "spring",
                                stiffness: 960,
                                damping: 80,
                                duration: 1, 
                                ease: [0, 0.71, 0.2, 1.01],
                                delay: 0.5
                            }}
      className="bg-no-repeat overflow-hidden items-center h-[926px] md:w-[428px]    "
      style={{ backgroundImage: `url(${getTemplate01})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
    </motion.section>

    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="bg-no-repeat overflow-hidden  h-[926px] md:w-[428px] px-8 "
      style={{ backgroundImage: `url(${getTemplate02})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div ref={ref} className=' text-[#fff] text-center flex flex-col justify-center items-center  pt-16'>
        <motion.h2 
                                  initial={{ x: 100, opacity: 0 }}
                                  animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
        className='text-2xl text-[#e0aa3e] mb-10'>
            {resolvedPost.guestName}
        </motion.h2>

        <div className='flex flex-col justify-center items-center text-[16px]'>
          <motion.p 
                                            initial={{ x: -100, opacity: 0 }}
                                            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                                            transition={{ duration: 1, ease: "easeOut" }}
          className='mb-7'>
            C&apos;est avec beaucoup d&apos;émotions que <i>Marc</i> et <i>Grâce</i> vous convient à la soirée dansante de leur mariage religieux.
          </motion.p>

          <motion.p 
                                            initial={{ x: 100, opacity: 0 }}
                                  animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
          className='mb-7'>
            Le samedi 27 Juin 2026 à 18h30. 
          </motion.p>


          <div className='flex flex-col justify-center items-center'>
            <motion.p 
                                                        initial={{ x: -100, opacity: 0 }}
                                                        animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                                                        transition={{ duration: 2, ease: "easeOut" }}
            className='mb-2'>
              L&apos;événement aura lieu à l&apos;Espace vert du chapiteau <i>Dachrisa</i>.
            </motion.p>

            <motion.p 
                                                        initial={{ x: 100, opacity: 0 }}
                                                        animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                                        transition={{ duration: 2.5, ease: "easeOut" }}
            className='mb-7'>
              Sise avenue 3 vallées N°03, Q/ Joli Parc, C/ Ngaliema
            </motion.p>
          </div>

          <motion.p 
                                                                  initial={{ x: -100, opacity: 0 }}
                                                                  animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                                                                  transition={{ duration: 3, ease: "easeOut" }}
          className='mb-2'>
            Référence:
          </motion.p>

          <motion.p 
                                                                  initial={{ x: 100, opacity: 0 }}
                                                                  animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                                                  transition={{ duration: 3.5, ease: "easeOut" }}
          className='mb-7'>
           Derrière Station Macampagne
          </motion.p>

          <motion.p 
                                                                  initial={{ x: -100, opacity: 0 }}
                                                                  animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                                                                  transition={{ duration: 3, ease: "easeOut" }}
          className='mb-2'>
            Contacts:
          </motion.p>

          <motion.p 
                                                                  initial={{ x: 100, opacity: 0 }}
                                                                  animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                                                  transition={{ duration: 3.5, ease: "easeOut" }}
          className='mb-7'>
           +243 817243840 / +243 859 198 156
          </motion.p>



          <motion.p 
                                                                            initial={{ x: 100, opacity: 0 }}
                                                                            animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                                                            transition={{ duration: 4.5, ease: "easeOut" }}
          className='mb-10 md:mb-7'>
            Table : {resolvedPost.guestTable}
          </motion.p>

          <motion.p 
                                                                            initial={{ x: -100, opacity: 0 }}
                                                                            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                                                                            transition={{ duration: 4, ease: "easeOut" }}
          className='mb-7 text-[#e0aa3e]'>
            Scannez ou Cliquez sur le QR Code pour la localisation
          </motion.p>

        </div>

        <motion.div 
                                                                                              initial={{ y: 100, opacity: 0 }}
                                                                                              animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                                                                                              transition={{ duration: 5, ease: "easeOut" }}
        className='flex flex-col gap-2 items-center'>
          <a
            href="https://maps.app.goo.gl/FBpbZAbdaJNSAzDc6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={getQrCode || '/placeholder.svg?height=767&width=748'}
              alt="Location Hall place"
              loading='lazy'
              width={50}
              height={50}
              className="object-cover transition-transform duration-600 hover:scale-110 mb-[100px]"
              style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto', objectFit: 'cover', borderRadius: '2px' }}
            />
          </a>

          <button 
            onClick={handleDownloadPng}
            className="hover:bg-[#c49344] bg-gradient-to-r from-[#c49344] to-[#e9bf6a] focus:from-pink-500 focus:to-yellow-500 active:border-[#3B4E6A] active:border-2 px-8 py-2 rounded-lg font-normal text-white cursor-pointer flex items-center gap-2"
          >
            <span className='text-xs'>TÉLÉCHARGER ICI</span>
            <Download className="w-5 h-5 animate-bounce" />
          </button>
        </motion.div>



      </div>
    </motion.section>

    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className=" bg-no-repeat overflow-hidden h-[926px] md:w-[428px]"
      style={{ backgroundImage: `url(${getTemplate03})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div ref={refGoldenBook} className=' text-dark text-center flex flex-col justify-center pt-16'>

      <motion.h2 
                                  initial={{ x: 100, opacity: 0 }}
                                  animate={isInViewGoldenBook ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                  transition={{ duration: 5, ease: "easeOut" }}
        className='text-2xl text-[#e0aa3e] mb-17'>
            Livre d&apos;or
        </motion.h2>

        <div className='flex flex-col gap-5 '>
          <ContactForm/>

          <div className='text-[#fff]'>
            <p className='py-  px-8  text-[10px]'>
                Powered By Jethro Code/Polytech Services
            </p>
            <p className='py-  px-8  text-[10px]'>
              +243 827 964 420
            </p>
          </div>

        </div>

        
        {/* <p className='py-  px-8  text-[14px]'>
        Aujourd&apos;hui, nous unissons nos cœurs pour la vie, et c&apos;est avec émotion que vous assistez à la naissance d&apos;un nouveau chapitre plein d&apos;amour, de complicité et de promesses.
        </p> */}
      </div>
    </motion.section>

    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 5.5 }}
      className=" bg-no-repeat overflow-hidden h-[926px] md:w-[428px]"
      style={{ backgroundImage: `url(${getTemplate04})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >

<motion.p 
                                                                            initial={{ x: -100, opacity: 0 }}
                                                                            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                                                                            transition={{ duration: 8, ease: "easeOut" }}
          className='mb-2 text-[#fff] text-center pt-20'>
            Thème :
          </motion.p>

      <motion.h2 
                                  initial={{ x: 100, opacity: 0 }}
                                  animate={isInViewGoldenBook ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                                  transition={{ duration: 9, ease: "easeOut" }}
        className='text-2xl text-[#e0aa3e] text-center '>
            Élégance Royale
        </motion.h2>

    </motion.section>

    </main>
  )
}

export default BlogPostClient 