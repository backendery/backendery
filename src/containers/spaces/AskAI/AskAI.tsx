import './AskAI.scss';

import { type FC, useEffect, useRef, useState } from 'react';

const MAX_USER_PROMPT_LENGTH = 96;

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

const AskAI: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((msg) => [...msg, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: userMessage.content }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const { answer } = await response.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer || 'No answer :/',
      };

      setMessages((msg) => [...msg, aiMessage]);
    } catch (err) {
      setMessages((msg) => [
        ...msg,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Error :/\nPlease try again later',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai">
      {/* <div className="ask-ai__messages">
        {messages.length === 0 && (
          <div className="ask-ai__message ask-ai__message--assistant">
            Ask anything about our studio.
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`ask-ai__message ask-ai__message--${m.role}`}
          >
            {m.userPrompt}
          </div>
        ))}

        {loading && (
          <div className="ask-ai__message ask-ai__message--assistant">
            Thinking…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
*/}
      <form className="ask-ai__form" onSubmit={submit}>
        <input
          className="ask-ai__input"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_USER_PROMPT_LENGTH))}
          placeholder="Ask a question…"
          disabled={loading}
          maxLength={MAX_USER_PROMPT_LENGTH}
        />
        <button
          className="ask-ai__button"
          type="submit"
          disabled={loading || !input.trim() || input.length > MAX_USER_PROMPT_LENGTH}
        >
          Send
        </button>
      </form>
      <div className="ask-ai__counter">
        {input.length}/{MAX_USER_PROMPT_LENGTH}
      </div>

    </div>
  );
};

export default AskAI;
