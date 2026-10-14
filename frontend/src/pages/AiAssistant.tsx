import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { aiClinicalService } from '../services/apiService.ts';
import type { AiChatMessage, Patient } from '../types/index.ts';

const createOutgoingMessage = (query: string): AiChatMessage => ({
  id: `user-${Date.now()}`,
  sender: 'user',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  text: query,
});

export const AiAssistant = () => {
  const { patients, addToast } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-1');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: 'Just now',
      category: 'general',
      text: "Hello, Dr. Sarah Mitchell. I am your MediFlow Clinical Decision Support Copilot. I can assist with SOAP note generation, drug interaction screening, pediatric dosage calculations, and differential diagnosis triage. Select a patient above to provide real-time EMR context, or try one of the quick clinical prompts below.",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePatient: Patient | undefined = patients.find(
    (p) => p.id === selectedPatientId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMessage = createOutgoingMessage(query);

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await aiClinicalService.consult(query, activePatient);
      setMessages((prev) => [...prev, response]);
    } catch {
      addToast('AI Consultation Failed', 'Could not reach clinical inference engine.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Copied to Clipboard', 'Clinical text copied successfully.', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const quickPrompts = [
    {
      label: '📝 Generate SOAP Encounter Note',
      prompt: activePatient
        ? `Generate a formal SOAP clinical progress note for patient ${activePatient.firstName} ${activePatient.lastName} (${activePatient.mrn}) with current vitals.`
        : 'Generate a comprehensive SOAP clinical encounter note for an adult patient presenting with exertional chest discomfort.',
    },
    {
      label: '⚠️ Check Drug Interaction (Metoprolol + Aspirin)',
      prompt: 'Check clinical pharmacokinetics and drug-to-drug interactions between Metoprolol Succinate, Aspirin 81mg, and Atorvastatin.',
    },
    {
      label: '🚨 Acute Stroke / Triage Stratification',
      prompt: 'Perform emergency triage risk stratification and immediate diagnostic order protocol for acute ischemic stroke alert.',
    },
    {
      label: '👶 Pediatric Amoxicillin Dosing',
      prompt: 'Calculate weight-based pediatric oral suspension dosage for Amoxicillin/Clavulanate for acute otitis media (25kg child).',
    },
  ];

  return (
    <div className="page-ai-assistant">
      {/* Header Banner */}
      <div className="ai-header-card">
        <div className="ai-header-left">
          <div className="ai-avatar-icon">
            <Sparkles size={24} className="sparkle-active" />
          </div>
          <div>
            <div className="ai-header-title-row">
              <h2>MediFlow Clinical Copilot</h2>
              <span className="ai-model-tag">v3.8 Clinical Decision Support</span>
              <span className="hipaa-badge">
                <ShieldCheck size={13} />
                <span>HIPAA Safeguarded</span>
              </span>
            </div>
            <p className="ai-header-sub">
              Evidence-based diagnostic decision support, clinical note drafting, and pharmacovigilance
            </p>
          </div>
        </div>

        <div className="ai-header-right">
          {/* Patient Context Linker */}
          <div className="patient-context-picker">
            <label>
              <User size={13} />
              <span>EMR Context:</span>
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="context-select"
            >
              <option value="">-- No Specific Patient Context --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.mrn}) • {p.department}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={() =>
              setMessages([
                {
                  id: 'reset',
                  sender: 'assistant',
                  timestamp: 'Just now',
                  text: 'Conversation reset. How can I assist your clinical workflow today?',
                },
              ])
            }
            title="Clear Chat History"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Active Patient Vitals Context Bar */}
      {activePatient && (
        <div className="patient-context-banner">
          <div className="context-banner-info">
            <strong>Active Patient:</strong> {activePatient.firstName} {activePatient.lastName} (
            {activePatient.mrn}) • {activePatient.age} yrs • {activePatient.gender} •{' '}
            <span className="context-vitals">
              BP: {activePatient.vitals.bloodPressure} | HR: {activePatient.vitals.heartRate} bpm | SpO2: {activePatient.vitals.oxygenSaturation}%
            </span>
          </div>
          {activePatient.allergies.length > 0 && (
            <div className="context-banner-allergies">
              <AlertTriangle size={13} />
              <span>Allergies: {activePatient.allergies.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Prompt Pills Bar */}
      <div className="quick-prompts-bar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            className="quick-prompt-chip"
            onClick={() => handleSendMessage(qp.prompt)}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="ai-chat-viewport">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
            <div className="chat-avatar">
              {msg.sender === 'assistant' ? (
                <Sparkles size={16} className="text-primary" />
              ) : (
                <User size={16} />
              )}
            </div>

            <div className="chat-bubble">
              <div className="chat-meta">
                <span className="chat-sender-name">
                  {msg.sender === 'assistant' ? 'MediFlow Clinical AI' : 'Dr. Sarah Mitchell'}
                </span>
                <span className="chat-timestamp">{msg.timestamp}</span>
              </div>

              <div className="chat-text-content">{msg.text}</div>

              {/* Structured Clinical Output */}
              {msg.structuredData && (
                <div className="structured-clinical-box">
                  {msg.structuredData.title && (
                    <div className="structured-title">
                      <FileText size={16} />
                      <strong>{msg.structuredData.title}</strong>
                    </div>
                  )}

                  {msg.structuredData.sections && (
                    <div className="structured-sections-list">
                      {msg.structuredData.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="structured-section">
                          <span className="section-label">{sec.label}</span>
                          <p>{sec.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.structuredData.warnings && msg.structuredData.warnings.length > 0 && (
                    <div className="structured-warnings-box">
                      <div className="warnings-header">
                        <AlertTriangle size={14} />
                        <span>Clinical Precautions & Black-Box Alerts:</span>
                      </div>
                      <ul>
                        {msg.structuredData.warnings.map((w, wIdx) => (
                          <li key={wIdx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.structuredData.recommendations &&
                    msg.structuredData.recommendations.length > 0 && (
                      <div className="structured-recs-box">
                        <div className="recs-header">
                          <Activity size={14} />
                          <span>Recommended Action Steps:</span>
                        </div>
                        <ul>
                          {msg.structuredData.recommendations.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {/* Message Actions */}
              {msg.sender === 'assistant' && (
                <div className="chat-actions-strip">
                  <button
                    type="button"
                    className="chat-action-btn"
                    onClick={() => handleCopy(msg.id, msg.text)}
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check size={13} className="text-success" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Clinical Output</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="chat-action-btn"
                    onClick={() => addToast('Added to Drafts', 'Inserted into patient SOAP draft.', 'success')}
                  >
                    <FileText size={13} />
                    <span>Insert to EMR</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message-row assistant">
            <div className="chat-avatar">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div className="chat-bubble">
              <div className="typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="typing-label">Analyzing clinical guidelines & records...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="ai-input-wrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="ai-input-form"
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Type a clinical query: e.g. 'Draft SOAP note for pneumonia', 'Check interactions for Warfarin', 'Pediatric dose for Augmentin'..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary ai-send-btn"
            disabled={!inputPrompt.trim() || isLoading}
            aria-label="Send clinical query"
          >
            <Send size={16} />
            <span>Consult</span>
          </button>
        </form>

        <div className="ai-disclaimer-note">
          <ShieldCheck size={13} />
          <span>
            MediFlow AI is an FDA Class II / HIPAA-conscious Clinical Decision Support tool. Verify all drug regimens and recommendations with standard medical protocol before patient administration.
          </span>
        </div>
      </div>
    </div>
  );
};
