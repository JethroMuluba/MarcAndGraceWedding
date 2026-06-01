import React from 'react'
import data from '@/data/data.json';
import BlogPostClient from './BlogPostClient';  

const API_URL = 'http://localhost:3001';

const blogPosts = data.guests || []


interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const resolvedParams = await params;  
  
  // 1) Essayer d'abord JSON Server (db.json)
  let postFromApi: { id: string; guestName: string; guestTable: string } | null = null;
  try {
    const res = await fetch(`${API_URL}/guests/${resolvedParams.slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      postFromApi = await res.json();
    }
  } catch {
    postFromApi = null;
  }

  // 2) Fallback sur les données statiques
  const staticPost = blogPosts.find((p) => p.id === resolvedParams.slug);
  const defaultPost = { id: '0', guestName: 'Invité', guestTable: 'Table' };
  const post = postFromApi || staticPost || (blogPosts.length > 0 ? blogPosts[0] : defaultPost);
  const getTemplate01 = data.home?.[0]?.heroSection?.[0]?.cover || "/placeholder.svg";
  const getTemplate02 = data.home?.[0]?.heroSection?.[0]?.cover1 || "/placeholder.svg";
  const getTemplate03 = data.home?.[0]?.heroSection?.[0]?.cover2 || "/placeholder.svg";
  const getTemplate04 = data.home?.[0]?.heroSection?.[0]?.cover3 || "/placeholder.svg";
  const getQrCode = data.home?.[0]?.heroSection?.[0]?.qrCode || "/placeholder.svg";




  return <BlogPostClient 
    post={post} 
    getTemplate01={getTemplate01}
    getTemplate02={getTemplate02}
    getTemplate03={getTemplate03}
    getTemplate04={getTemplate04}
    getQrCode={getQrCode}


  />
}

export default BlogPostPage

export async function generateStaticParams() {
  const guests = data.guests || []
  return guests.map((post) => ({
    slug: post.id
  }))
}