import React, { useState, useEffect } from 'react';
import { Plus, Search, Github, Coins } from 'lucide-react';
import { Coin } from './types';
import { getStoredCoins, saveCoin, deleteCoin } from './services/storageService';
import CoinCard from './components/CoinCard';
import AddCoinModal from './components/AddCoinModal';
import CoinDetailModal from './components/CoinDetailModal';
import EmptyState from './components/EmptyState';

// Helper to generate UUIDs
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const App: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCoins(getStoredCoins());
  }, []);

  const handleSaveCoin = (newCoinData: Omit<Coin, 'id' | 'dateAdded'>) => {
    const newCoin: Coin = {
      ...newCoinData,
      id: uuidv4(),
      dateAdded: Date.now(),
    };
    saveCoin(newCoin);
    setCoins(getStoredCoins()); // Refresh list
  };

  const handleDeleteCoin = (id: string) => {
    deleteCoin(id);
    setCoins(getStoredCoins());
    if (selectedCoin?.id === id) {
      setSelectedCoin(null);
    }
  };

  const filteredCoins = coins.filter(coin => 
    coin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.year.includes(searchTerm)
  );

  const totalValue = coins.length; // Placeholder for stats

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-yellow-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Coins className="text-slate-900" size={20} />
             </div>
             <div>
                <h1 className="text-2xl font-serif font-bold tracking-tight text-white leading-none">
                  Numisma<span className="text-yellow-500">.</span>AI
                </h1>
                <p className="text-xs text-slate-400 tracking-wider uppercase">Digital Collection</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsAddModalOpen(true)}
               className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-yellow-500 border border-slate-700 hover:border-yellow-500/50 px-4 py-2 rounded-lg transition-all font-medium text-sm"
             >
                <Plus size={18} /> Add Coin
             </button>
             <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github size={20} />
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Stats Bar */}
        {coins.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, country, or year..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-slate-200 placeholder-slate-500 transition-all"
                />
            </div>
            <div className="text-slate-400 text-sm font-medium">
               <span className="text-white font-bold">{totalValue}</span> Specimens Collected
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {coins.length === 0 ? (
          <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
        ) : (
          <>
             {filteredCoins.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <p>No coins found matching "{searchTerm}"</p>
                </div>
             )}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                {filteredCoins.map(coin => (
                  <CoinCard 
                    key={coin.id} 
                    coin={coin} 
                    onDelete={handleDeleteCoin} 
                    onClick={setSelectedCoin}
                  />
                ))}
             </div>
          </>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-slate-900 shadow-xl shadow-yellow-900/50 z-40"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      <AddCoinModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveCoin} 
      />
      
      <CoinDetailModal 
        coin={selectedCoin} 
        onClose={() => setSelectedCoin(null)} 
      />

    </div>
  );
};

export default App;
