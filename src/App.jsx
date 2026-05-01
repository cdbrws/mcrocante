import { useState, useEffect } from 'react';
import { getCrocanteDelDia, getFeaturedEmprendedores } from './engine/aiaEngine';
import { trackVisit } from './utils/adminStats';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import GuardadosScreen from './components/GuardadosScreen';
import EmpreendedoresScreen from './components/EmpreendedoresScreen';
import AdminScreen from './components/AdminScreen';
import BottomNav from './components/BottomNav';

const HOME_PROMPTS = {
  sinmango: "No tengo un mango, busco planes gratis",
  comer: "Quiero comer algo rico",
  chicos: "Busco planes para hacer con los pibes",
  eventos: "Quiero salir, que hay hoy?",
  emprendimientos: "Quiero ver emprendimientos locales",
  cerca: "Quiero opciones cerca mio",
  pareja: "Busco un plan para ir en pareja",
  noche: "Que hay para hacer de noche?",
  aire: "Quiero algo en aire libre",
  lluvia: "Esta lloviendo, que puedo hacer?",
  fiaca: "Alta fiaca de moverme, que hago?",
  musica: "Recomendame musica para escuchar",
  peli: "Recomendame una peli para ver"
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatKey, setChatKey] = useState(0);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mcrocante_saved') || '[]'); } catch { return []; }
  });
  const [crocante, setCrocante] = useState(null);
  const [emprendedores, setEmprendedores] = useState([]);

  useEffect(() => {
    trackVisit();
    setCrocante(getCrocanteDelDia());
    setEmprendedores(getFeaturedEmprendedores());
  }, []);

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('mcrocante_saved', JSON.stringify(next));
      return next;
    });
  };

  const goChat = (category) => {
    setChatMessages([]);
    setScreen('chat');
    // new chat key to reinitialize prompts
    setChatKey(k => k + 1);
    if (category === 'start') {
      // Start with blank chat
      setChatMessages([]);
      return;
    }
    if (category === 'ideas') {
      const userMsg = 'Quiero ideas';
      setChatMessages([{ role: 'user', text: userMsg }]);
      return;
    }
    if (category === 'emprendimientos') {
      setScreen('explorar');
      return;
    }
    const userMsg = HOME_PROMPTS[category] || HOME_PROMPTS.cerca;
    setChatMessages([{ role: 'user', text: userMsg }]);
  };

  const goHome = () => {
    setScreen('home');
    setChatMessages([]);
  };

  const openNewChat = () => {
    setChatMessages([]);
    setScreen('chat');
  };

  const goEmprendedores = () => setScreen('explorar');

  const addChatMessage = (msg) => {
    setChatMessages(prev => [...prev, msg]);
  };

  return (
    <div className="min-h-[100dvh] bg-crema flex flex-col">
      <div className="flex-1 pb-[72px]">
        {screen === 'home' && (
          <HomeScreen onCategory={goChat} crocante={crocante} emprendedores={emprendedores} onEmprendedores={goEmprendedores} />
        )}
        {screen === 'chat' && (
          <ChatScreen messages={chatMessages} onAddMessage={addChatMessage} savedIds={savedIds} onToggleSave={toggleSave} onBack={goHome} chatKey={chatKey} />
        )}
        {screen === 'explorar' && <EmpreendedoresScreen />}
        {screen === 'guardados' && <GuardadosScreen savedIds={savedIds} onToggleSave={toggleSave} />}
        {screen === 'admin' && <AdminScreen />}
      </div>
      <BottomNav active={screen} onNavigate={(id) => {
        if (id === 'chat') openNewChat();
        else setScreen(id);
      }} />
    </div>
  );
}
