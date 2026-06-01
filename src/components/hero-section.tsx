'use client'

import Link from "next/link"
import data from "@/data/data.json"
import { motion } from 'framer-motion'
import FallingHearts from '@/components/FallingHearts';


export default function  HeroSection() {

  const getCover = data.home?.[0]?.heroSection?.[0]?.cover;

  return (
    <div>
      <FallingHearts />

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="bg-no-repeat overflow-hidden items-center h-[926px] md:w-[428px] "
        style={{ backgroundImage: `url(${getCover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >

        <div className="flex justify-center mt-150">
        <Link
          href="/guest"
          className=" border border-[#c49344] hover:bg-[#f5e6c9] px-6 py-2 rounded-lg font-normal text-white cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span className='text-xs text-[#c49344]'>Voir à la liste des invités</span>
        </Link>
      </div>
      </motion.section>

    </div>
  )
}

