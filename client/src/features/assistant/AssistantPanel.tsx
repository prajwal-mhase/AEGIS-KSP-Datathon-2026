import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Send, Download } from 'lucide-react';
import type { ChatResponse } from '@aegis/shared';
import { sendChat } from '../dashboard/useDashboardData';

const prompts = [
  'Show cybercrime trends in Bengaluru Urban',
  'Which districts are current hotspots?',
  'Break down incidents by category',
];

export const AssistantPanel = () => {
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string; response?: ChatResponse }>>([]);
  const mutation = useMutation({
    mutationFn: (text: string) => sendChat(text, 'en', conversationId),
    onSuccess: (response, text) => {
      setConversationId(response.conversationId);
      setHistory((current) => [...current, { role: 'user', content: text }, { role: 'assistant', content: response.answer, response }]);
      setMessage('');
    },
  });

  const exportConversation = () => {
    const body = history.map((item) => `${item.role.toUpperCase()}: ${item.content}`).join('\n\n');
    const blob = new Blob([body], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `aegis-conversation-${new Date().toISOString().slice(0, 10)}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full min-h-[620px] flex-col border border-line bg-white dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-white/10">
        <div>
          <h2 className="text-sm font-semibold">Conversational intelligence</h2>
          <p className="text-xs text-steel dark:text-slate-400">Answers are backed by SQL evidence and citations.</p>
        </div>
        <button className="focus-ring p-2 hover:bg-field dark:hover:bg-white/5" onClick={exportConversation} aria-label="Export conversation">
          <Download size={16} />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {history.length === 0 && (
          <div className="space-y-2">
            {prompts.map((prompt) => (
              <button key={prompt} className="focus-ring block w-full border border-line px-3 py-2 text-left text-sm hover:bg-field dark:border-white/10 dark:hover:bg-white/5" onClick={() => mutation.mutate(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}
        {history.map((item, index) => (
          <div key={`${item.role}-${index}`} className={item.role === 'user' ? 'ml-8 bg-ink p-3 text-sm text-white' : 'mr-8 border border-line p-3 text-sm dark:border-white/10'}>
            <ReactMarkdown>{item.content}</ReactMarkdown>
            {item.response && (
              <div className="mt-3 border-t border-line pt-3 text-xs text-steel dark:border-white/10 dark:text-slate-400">
                <div>Confidence {(item.response.confidence * 100).toFixed(0)}%</div>
                {item.response.sql && <code className="mt-2 block overflow-auto bg-field p-2 dark:bg-black/30">{item.response.sql}</code>}
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.response.citations.map((citation) => (
                    <span key={`${citation.label}-${citation.reference}`} className="border border-line px-2 py-1 dark:border-white/10">
                      {citation.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {mutation.isPending && <div className="mr-8 border border-line p-3 text-sm text-steel">Analyzing verified records...</div>}
      </div>
      <form
        className="flex gap-2 border-t border-line p-3 dark:border-white/10"
        onSubmit={(event) => {
          event.preventDefault();
          if (message.trim()) mutation.mutate(message.trim());
        }}
      >
        <input className="focus-ring min-w-0 flex-1 border border-line px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about FIRs, districts, trends..." />
        <button className="focus-ring bg-ink px-3 text-white" aria-label="Send message">
          <Send size={17} />
        </button>
      </form>
    </div>
  );
};
