<script lang="ts">
  import { t, type Language } from '$lib/i18n';
  
  interface Props {
    lang: Language;
    show: boolean;
    onClose: () => void;
  }
  
  let { lang, show, onClose }: Props = $props();
</script>

{#if show}
  <div class="modal-overlay" onclick={onClose} role="presentation">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="help-title">
      <div class="modal-header">
        <h2 id="help-title">{t(lang, 'help.title')}</h2>
        <button class="close-btn" onclick={onClose} aria-label={t(lang, 'help.close')}>✕</button>
      </div>
      
      <div class="modal-body">
        <!-- Keyboard Shortcuts -->
        <section class="help-section">
          <h3>{t(lang, 'help.shortcuts.title')}</h3>
          <div class="shortcuts-grid">
            <div class="shortcut-item">
              <kbd>F1</kbd>
              <span>{t(lang, 'help.shortcuts.f1')}</span>
            </div>
            <div class="shortcut-item">
              <kbd>F2</kbd>
              <span>{t(lang, 'help.shortcuts.f2')}</span>
            </div>
            <div class="shortcut-item">
              <kbd>F3</kbd>
              <span>{t(lang, 'help.shortcuts.f3')}</span>
            </div>
            <div class="shortcut-item">
              <kbd>F4</kbd>
              <span>{t(lang, 'help.shortcuts.f4')}</span>
            </div>
            <div class="shortcut-item">
              <kbd>F5</kbd>
              <span>{t(lang, 'help.shortcuts.f5')}</span>
            </div>
            <div class="shortcut-item">
              <kbd>F10</kbd>
              <span>{t(lang, 'help.shortcuts.f10')}</span>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="help-section">
          <h3>{t(lang, 'help.features.title')}</h3>
          <ul class="feature-list">
            <li>{t(lang, 'help.features.processes')}</li>
            <li>{t(lang, 'help.features.resources')}</li>
            <li>{t(lang, 'help.features.charts')}</li>
            <li>{t(lang, 'help.features.config')}</li>
          </ul>
        </section>

        <!-- Tips -->
        <section class="help-section">
          <h3>{t(lang, 'help.tips.title')}</h3>
          <ul class="tips-list">
            <li>💡 {t(lang, 'help.tips.tip1')}</li>
            <li>💡 {t(lang, 'help.tips.tip2')}</li>
            <li>💡 {t(lang, 'help.tips.tip3')}</li>
            <li>💡 {t(lang, 'help.tips.tip4')}</li>
          </ul>
        </section>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" onclick={onClose}>
          {t(lang, 'help.close')}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: #282a36;
    border: 2px solid #6272a4;
    border-radius: 8px;
    width: 90%;
    max-width: 700px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #44475a;
  }

  .modal-header h2 {
    margin: 0;
    color: #bd93f9;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: #f8f8f2;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #ff5555;
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .help-section {
    margin-bottom: 32px;
  }

  .help-section:last-child {
    margin-bottom: 0;
  }

  .help-section h3 {
    color: #50fa7b;
    margin: 0 0 16px 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .shortcuts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
  }

  .shortcut-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: #44475a;
    border-radius: 4px;
  }

  kbd {
    background: #6272a4;
    color: #f8f8f2;
    padding: 4px 12px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    font-weight: 600;
    min-width: 45px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .shortcut-item span {
    color: #f8f8f2;
    flex: 1;
  }

  .feature-list,
  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-list li,
  .tips-list li {
    padding: 10px 12px;
    margin-bottom: 8px;
    background: #44475a;
    border-radius: 4px;
    color: #f8f8f2;
    line-height: 1.6;
  }

  .tips-list li {
    background: #44475a;
    border-left: 3px solid #ffb86c;
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #44475a;
    display: flex;
    justify-content: flex-end;
  }

  .btn-primary {
    background: #bd93f9;
    color: #282a36;
    border: none;
    padding: 10px 24px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background: #d4bbff;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(189, 147, 249, 0.3);
  }

  .btn-primary:active {
    transform: translateY(0);
  }
</style>
