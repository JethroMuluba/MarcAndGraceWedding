'use client'

import React from 'react'
import data from '@/data/data.json'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react';
import FallingHearts from '@/components/FallingHearts';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

interface Guest {
  id: string;
  guestName: string;
  guestTable: string;
  hasArrived?: boolean;
}

interface ModalPosition {
  top: number;
  left: number;
}





const Guest = () => {
  const [search, setSearch] = useState('');
  const [guests, setGuests] = useState<Guest[]>(data.guests || []);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({ guestName: '', guestTable: '' });
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [addForm, setAddForm] = useState({ guestName: '', guestTable: '' });
  const [addModalPosition, setAddModalPosition] = useState<ModalPosition | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const getCover = data.home?.[0]?.heroSection?.[0]?.cover || "/placeholder.svg";
  const getModalBackground = data.home?.[0]?.heroSection?.[0]?.cover1 || "/placeholder.svg";

  // Charger les invités depuis JSON Server
  useEffect(() => {
    fetchGuests();
  }, []);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${API_URL}/guests`);
      setGuests(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des invités:', error);
      // Fallback sur les données locales si le serveur n'est pas disponible
      setGuests(data.guests || []);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet invité ?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/guests/${id}`);
      setGuests(guests.filter(guest => guest.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'invité');
    }
  };

  const handleEdit = (guest: Guest, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const sectionRect = sectionRef.current?.getBoundingClientRect();
    
    if (sectionRect) {
      // Sur mobile, utiliser une position centrée fixe
      if (isMobile) {
        // Position centrée dans la section
        setModalPosition({ top: sectionRect.height / 2, left: sectionRect.width / 2 });
      } else {
        // Sur desktop, centrer horizontalement au milieu de la page et verticalement avec le bouton
        const top = rect.top - sectionRect.top + (rect.height / 2);
        const left = sectionRect.width / 2;
        setModalPosition({ top, left });
      }
      
      setEditingGuest(guest);
      setEditForm({ guestName: guest.guestName, guestTable: guest.guestTable });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingGuest) return;
    try {
      await axios.put(`${API_URL}/guests/${editingGuest.id}`, {
        ...editingGuest,
        guestName: editForm.guestName,
        guestTable: editForm.guestTable
      });
      setGuests(guests.map(guest => 
        guest.id === editingGuest.id 
          ? { ...guest, guestName: editForm.guestName, guestTable: editForm.guestTable }
          : guest
      ));
      setEditingGuest(null);
      setEditForm({ guestName: '', guestTable: '' });
      setModalPosition(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de l\'invité');
    }
  };

  const handleToggleArrived = async (id: string, hasArrived: boolean) => {
    setGuests(prev =>
      prev.map(g => (g.id === id ? { ...g, hasArrived } : g))
    );

    try {
      await axios.patch(`${API_URL}/guests/${id}`, { hasArrived });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      // rollback si l'API échoue
      setGuests(prev =>
        prev.map(g => (g.id === id ? { ...g, hasArrived: !hasArrived } : g))
      );
      alert('Erreur lors de la mise à jour de la présence');
    }
  };

  const handleAddGuest = async () => {
    if (!addForm.guestName.trim() || !addForm.guestTable.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    try {
      // Générer un nouvel ID basé sur le dernier ID
      const lastId = guests.length > 0 ? parseInt(guests[guests.length - 1].id) : -1;
      const newId = (lastId + 1).toString();
      
      const newGuest = {
        id: newId,
        guestName: addForm.guestName,
        guestTable: addForm.guestTable,
        hasArrived: false
      };
      
      await axios.post(`${API_URL}/guests`, newGuest);
      setGuests([...guests, newGuest]);
      setIsAddingGuest(false);
      setAddForm({ guestName: '', guestTable: '' });
      setAddModalPosition(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de l\'invité');
    }
  };

  // Filtrage dynamique par nom d'invité
  const filteredGuests = guests.filter(guest =>
    guest.guestName.toLowerCase().includes(search.toLowerCase()) || 
    guest.guestTable.toLowerCase().includes(search.toLowerCase()) || 
    guest.id.toLowerCase().includes(search.toLowerCase())  
  );

  return (
    <main className="min-h-screen bg-[#f8f8f8] flex flex-col md:items-center">
      <FallingHearts />


<motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="bg-no-repeat overflow-hidden items-center h-[926px] md:w-[428px] "
      style={{ backgroundImage: `url(${getCover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
    </motion.section>
      {/* Liste des invités */}
      <div ref={sectionRef} className="relative w-full max-w-2xl mx-auto mt-8">
        <section className={`w-full p-4 bg-[#dbdbdb] rounded-2xl shadow-lg border-light-quaternary backdrop-blur-md transition-all duration-300 ${editingGuest || isAddingGuest ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-made-infinity font-bold text-[#000] tracking-wide text-center sm:text-left">Liste des invités</h2>
              <button
                ref={addButtonRef}
                onClick={(e) => {
                  const button = e.currentTarget;
                  const rect = button.getBoundingClientRect();
                  const sectionRect = sectionRef.current?.getBoundingClientRect();
                  
                  if (sectionRect) {
                    const top = rect.top - sectionRect.top + rect.height + 10;
                    const left = rect.left - sectionRect.left + (rect.width / 2);
                    setAddModalPosition({ top, left });
                  }
                  setIsAddingGuest(true);
                }}
                className="inline-flex items-center justify-center p-2 rounded-lg cursor-pointer bg-green-500 text-white shadow hover:bg-green-600 transition-colors duration-200"
                title="Ajouter un invité"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Rechercher un invité..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-quaternary bg-[#f8f8f8] text-[#000] placeholder:text-light-quaternary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-quaternary opacity-20 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-base text-left font-poppins">
              <thead>
                <tr className="bg-secondary/90 text-[#000]">
                  <th className="px-3 py-2 rounded-tl-2xl">ID</th>
                  <th className="px-3 py-2">Nom de l&apos;invité </th>
                  <th className="px-3 py-2 rounded-tr-2xl">Table</th>
                  <th className="px-3 py-2">Invitation</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, idx) => (
                  <tr key={guest.id} className={
                    ` transition-colors text-dark text-[14px] duration-200 ${idx % 2 === 0 ? 'bg-light-secondary/60' : 'bg-white/40'} hover:bg-secondary/30 hover:text-[#b1704e]`
                  }>
                    <td className="px-3 py-2 font-semibold">{guest.id}</td>
                    <td className="px-3 py-2">{guest.guestName}</td>
                    <td className="px-3 py-2  text-primary">{guest.guestTable}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/guest/${guest.id}`}
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-primary text-dark shadow hover:bg-secondary hover:text-[#b1704e] transition-colors duration-200"
                          title="Voir invitation"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={(e) => handleEdit(guest, e)}
                          className="inline-flex items-center justify-center p-2 rounded-lg cursor-pointer bg-blue-500 text-white shadow hover:bg-blue-600 transition-colors duration-200"
                          title="Éditer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg cursor-pointer bg-red-500 text-white shadow hover:bg-red-600 transition-colors duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <label className="inline-flex items-center gap-2 pl-2 select-none" title="Marquer l'invité comme venu">
                          <input
                            type="checkbox"
                            checked={!!guest.hasArrived}
                            onChange={(e) => handleToggleArrived(guest.id, e.target.checked)}
                            className="h-4 w-4 accent-green-600 cursor-pointer"
                            aria-label={`Marquer ${guest.guestName} comme venu`}
                          />
                          <span className="text-xs text-[#000]">Venu</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal d'édition */}
        {editingGuest && modalPosition && (
          <>
            {/* Overlay pour fermer en cliquant en dehors */}
            <div 
              className={isMobile ? 'fixed inset-0 z-40' : 'absolute inset-0 z-40'}
              style={isMobile ? {
                backgroundImage: `url(${getModalBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              } : {}}
              onClick={() => {
                setEditingGuest(null);
                setEditForm({ guestName: '', guestTable: '' });
                setModalPosition(null);
              }}
            >
              {isMobile && (
                <div className="absolute inset-0bg-opacity-40 backdrop-blur-sm" />
              )}
            </div>
            <div 
              className={isMobile ? 'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none' : 'absolute z-50'}
              style={isMobile ? {} : {
                top: `${modalPosition.top}px`,
                left: `${modalPosition.left}px`,
                transform: 'translateX(-50%) translateY(-50%)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-2xl shadow-2xl pointer-events-auto ${isMobile ? 'w-full max-w-sm p-4' : 'w-80 p-6'}`}
              >
                <h3 className={`font-bold mb-3 text-[#000] ${isMobile ? 'text-lg' : 'text-2xl'}`}>Éditer l&apos;invité</h3>
                <div className={`space-y-3 ${isMobile ? '' : 'space-y-4'}`}>
                  <div>
                    <label className={`block font-medium text-[#000] mb-1.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      Nom de l&apos;invité
                    </label>
                    <input
                      type="text"
                      value={editForm.guestName}
                      onChange={(e) => setEditForm({ ...editForm, guestName: e.target.value })}
                      className={`w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-[#000] ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium text-[#000] mb-1.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      Table
                    </label>
                    <input
                      type="text"
                      value={editForm.guestTable}
                      onChange={(e) => setEditForm({ ...editForm, guestTable: e.target.value })}
                      className={`w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-[#000] ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                    />
                  </div>
                </div>
                <div className={`flex gap-2 mt-4 ${isMobile ? '' : 'gap-3 mt-6'}`}>
                  <button
                    onClick={handleSaveEdit}
                    className={`flex-1 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition-colors duration-200 ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setEditingGuest(null);
                      setEditForm({ guestName: '', guestTable: '' });
                      setModalPosition(null);
                    }}
                    className={`flex-1 rounded-lg bg-gray-300 text-[#000] hover:bg-gray-400 transition-colors duration-200 ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Modal d'ajout */}
        {isAddingGuest && addModalPosition && (
          <>
            {/* Overlay pour fermer en cliquant en dehors */}
            <div 
              className={isMobile ? 'fixed inset-0 z-40' : 'absolute inset-0 z-40'}
              style={isMobile ? {
                backgroundImage: `url(${getModalBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              } : {}}
              onClick={() => {
                setIsAddingGuest(false);
                setAddForm({ guestName: '', guestTable: '' });
                setAddModalPosition(null);
              }}
            >
              {isMobile && (
                <div className="absolute inset-0bg-opacity-40 backdrop-blur-sm" />
              )}
            </div>
            <div 
              className={isMobile ? 'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none' : 'absolute z-50'}
              style={isMobile ? {} : {
                top: `${addModalPosition.top}px`,
                left: `${addModalPosition.left}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-2xl shadow-2xl pointer-events-auto ${isMobile ? 'w-full max-w-sm p-4' : 'w-80 p-6'}`}
              >
                <h3 className={`font-bold mb-3 text-[#000] ${isMobile ? 'text-lg' : 'text-2xl'}`}>Ajouter un invité</h3>
                <div className={`space-y-3 ${isMobile ? '' : 'space-y-4'}`}>
                  <div>
                    <label className={`block font-medium text-[#000] mb-1.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      Nom de l&apos;invité
                    </label>
                    <input
                      type="text"
                      value={addForm.guestName}
                      onChange={(e) => setAddForm({ ...addForm, guestName: e.target.value })}
                      placeholder="Entrez le nom de l'invité"
                      className={`w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-[#000] ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                    />
                  </div>
                  <div>
                    <label className={`block font-medium text-[#000] mb-1.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      Table
                    </label>
                    <input
                      type="text"
                      value={addForm.guestTable}
                      onChange={(e) => setAddForm({ ...addForm, guestTable: e.target.value })}
                      placeholder="Entrez le nom de la table"
                      className={`w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-[#000] ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                    />
                  </div>
                </div>
                <div className={`flex gap-2 mt-4 ${isMobile ? '' : 'gap-3 mt-6'}`}>
                  <button
                    onClick={handleAddGuest}
                    className={`flex-1 rounded-lg bg-green-500 text-white shadow cursor-pointer hover:bg-green-600 transition-colors duration-200 ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'}`}
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingGuest(false);
                      setAddForm({ guestName: '', guestTable: '' });
                      setAddModalPosition(null);
                    }}
                    className={`flex-1 rounded-lg bg-gray-300 text-[#000] hover:bg-gray-400 transition-colors duration-200 ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 cursor-pointer text-base'}`}
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Guest