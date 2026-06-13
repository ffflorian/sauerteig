import {createPortal} from 'react-dom';

interface InstallPromptProps {
  onClose: () => void;
}

const AddToHomeIcon = () => (
  <svg
    className="install-prompt-share-icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const ShareIcon = () => (
  <svg
    className="install-prompt-share-icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3v12" />
    <path d="m8 7 4-4 4 4" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </svg>
);

export const InstallPrompt = ({onClose}: InstallPromptProps) => {
  return createPortal(
    <div className="install-prompt-overlay" onClick={onClose}>
      <div
        className="install-prompt"
        role="dialog"
        aria-modal="true"
        aria-label="App installieren"
        onClick={event => event.stopPropagation()}
      >
        <img className="install-prompt-icon" src="img/sauerteig_128.png" alt="" />
        <h2 className="install-prompt-title">Benachrichtigungen aktivieren</h2>
        <p className="install-prompt-text">
          Dein Timer läuft jetzt in der App. Damit du auch benachrichtigt wirst, wenn er abläuft, füge Sauerteig zu
          deinem Home-Bildschirm hinzu.
        </p>
        <ol className="install-prompt-steps">
          <li>
            Tippe unten auf <ShareIcon /> <strong>Teilen</strong>.
          </li>
          <li>
            Wähle <AddToHomeIcon /> <strong>Zum Home-Bildschirm</strong>.
          </li>
          <li>Öffne Sauerteig künftig über das neue Symbol.</li>
        </ol>
        <button className="install-prompt-close" onClick={onClose}>
          Verstanden
        </button>
      </div>
    </div>,
    document.body
  );
};
