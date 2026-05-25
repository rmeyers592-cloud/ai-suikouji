import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { VoiceRecord, AppSettings, ActionCard, CardStatus } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { MOCK_RECORDS } from '../data/mockData';

interface AppState {
  records: VoiceRecord[];
  settings: AppSettings;
  isProcessing: boolean;
  currentTranscript: string | null;
  currentCards: ActionCard[] | null;
  selectedRecordId: string | null;
}

type AppAction =
  | { type: 'ADD_RECORD'; payload: VoiceRecord }
  | { type: 'UPDATE_CARD_STATUS'; payload: { recordId: string; cardId: string; status: CardStatus } }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_TRANSCRIPT'; payload: string | null }
  | { type: 'SET_CURRENT_CARDS'; payload: ActionCard[] | null }
  | { type: 'SELECT_RECORD'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'DISMISS_CARD'; payload: { recordId: string; cardId: string } }
  | { type: 'ANSWER_FOLLOWUP'; payload: { recordId: string; cardId: string; answer: string } };

const STORAGE_KEY = 'ai-voice-notes';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        records: parsed.records ?? MOCK_RECORDS,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        isProcessing: false,
        currentTranscript: null,
        currentCards: null,
        selectedRecordId: null,
      };
    }
  } catch {
    // ignore
  }
  return {
    records: MOCK_RECORDS,
    settings: DEFAULT_SETTINGS,
    isProcessing: false,
    currentTranscript: null,
    currentCards: null,
    selectedRecordId: null,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_RECORD':
      return { ...state, records: [action.payload, ...state.records] };

    case 'UPDATE_CARD_STATUS': {
      const { recordId, cardId, status } = action.payload;
      return {
        ...state,
        records: state.records.map((r) =>
          r.id === recordId
            ? { ...r, cards: r.cards.map((c) => (c.id === cardId ? { ...c, status } : c)) }
            : r
        ),
      };
    }

    case 'DISMISS_CARD': {
      const { recordId, cardId } = action.payload;
      return {
        ...state,
        records: state.records.map((r) =>
          r.id === recordId
            ? { ...r, cards: r.cards.map((c) => (c.id === cardId ? { ...c, status: 'dismissed' as const } : c)) }
            : r
        ),
      };
    }

    case 'ANSWER_FOLLOWUP': {
      const { recordId, cardId } = action.payload;
      return {
        ...state,
        records: state.records.map((r) =>
          r.id === recordId
            ? {
                ...r,
                cards: r.cards.map((c) =>
                  c.id === cardId
                    ? { ...c, needsFollowUp: false, followUpQuestion: undefined, status: 'confirmed' as const }
                    : c
                ),
              }
            : r
        ),
      };
    }

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };

    case 'SET_TRANSCRIPT':
      return { ...state, currentTranscript: action.payload };

    case 'SET_CURRENT_CARDS':
      return { ...state, currentCards: action.payload };

    case 'SELECT_RECORD':
      return { ...state, selectedRecordId: action.payload };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  // Persist records and settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ records: state.records, settings: state.settings })
    );
  }, [state.records, state.settings]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
