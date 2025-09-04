import React, { useState, useCallback } from 'react';
import { GeneratedPost } from './types';
import { generateInstagramPost } from './services/geminiService';
import { InputField } from './components/InputField';
import { TextAreaField } from './components/TextAreaField';
import { Button } from './components/Button';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [businessType, setBusinessType] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPart, setCopiedPart] = useState<'title' | 'description' | null>(null);

  const handleGeneratePost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType || !postSummary) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const post = await generateInstagramPost(businessType, postSummary);
      setGeneratedPost(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  }, [businessType, postSummary]);

  const handleCopy = (part: 'title' | 'description') => {
    if (!generatedPost) return;
    const textToCopy = part === 'title' ? generatedPost.title : generatedPost.description;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedPart(part);
      setTimeout(() => setCopiedPart(null), 2000);
    });
  };

  const handleDownload = () => {
    if (!generatedPost) return;
    const link = document.createElement('a');
    link.href = generatedPost.imageUrl;
    const fileName = generatedPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'generated-image';
    link.download = `${fileName}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFormIncomplete = !businessType || !postSummary;
  
  const InitialStateDisplay = () => (
    <div className="text-center p-8 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-700 h-full flex flex-col justify-center items-center">
      <Icon name="image" className="mx-auto h-16 w-16 text-slate-600" />
      <h3 className="mt-4 text-lg font-medium text-slate-200">Seu post aparecerá aqui</h3>
      <p className="mt-1 text-sm text-slate-400">Preencha os detalhes ao lado para começar.</p>
    </div>
  );

  return (
    <div className="min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">
                Gerador de Post IA para <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Instagram</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                Crie posts incríveis para o seu negócio em segundos. Basta descrever sua ideia e deixar a IA fazer o resto.
            </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-xl shadow-2xl">
            <form onSubmit={handleGeneratePost} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">1. Detalhes do Post</h2>
                <p className="text-sm text-slate-400 mt-1">Forneça o contexto para a IA gerar seu conteúdo.</p>
              </div>

              <InputField
                id="businessType"
                label="Tipo de Negócio"
                iconName="business"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="Ex: Cafeteria, Loja de roupas, etc."
                required
              />
              
              <TextAreaField
                id="postSummary"
                label="Resumo do Post"
                iconName="summary"
                value={postSummary}
                onChange={(e) => setPostSummary(e.target.value)}
                placeholder="Ex: Lançamento do nosso novo café gelado de caramelo."
                required
              />
              
              <div className="pt-2">
                <Button isLoading={isLoading} disabled={isFormIncomplete}>
                  Gerar Post
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex flex-col justify-center">
            {error && (
              <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-lg" role="alert">
                <p className="font-bold">Erro na Geração</p>
                <p>{error}</p>
              </div>
            )}
            
            {!isLoading && !generatedPost && !error && <InitialStateDisplay />}
            
            {isLoading && (
              <div className="text-center p-8 bg-slate-900/30 rounded-lg h-full flex flex-col justify-center items-center">
                <div role="status" className="flex flex-col items-center justify-center">
                    <svg aria-hidden="true" className="w-12 h-12 mb-4 text-slate-700 animate-spin fill-cyan-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                    <p className="text-cyan-400 font-semibold mt-2">Criando a imagem e o texto...</p>
                    <p className="text-slate-400 text-sm">Isso pode levar alguns segundos.</p>
                </div>
              </div>
            )}
            
            {generatedPost && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative group overflow-hidden rounded-xl border border-slate-800">
                  <img className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-105" src={generatedPost.imageUrl} alt="Generated for post" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <button onClick={handleDownload} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm text-slate-100 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-black/70">
                        <Icon name="download" className="h-5 w-5" />
                        Baixar Imagem
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-100">Título Sugerido</h3>
                    <button onClick={() => handleCopy('title')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-900/50 rounded-full hover:bg-cyan-800/60 transition-colors">
                      <Icon name="copy" className="h-4 w-4" />
                      {copiedPart === 'title' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <p className="mt-2 text-slate-300">{generatedPost.title}</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-100">Descrição Sugerida</h3>
                    <button onClick={() => handleCopy('description')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-900/50 rounded-full hover:bg-cyan-800/60 transition-colors">
                      <Icon name="copy" className="h-4 w-4" />
                      {copiedPart === 'description' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <p className="mt-2 text-slate-300 whitespace-pre-wrap">{generatedPost.description}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;