<script lang="ts">
    import { t, type Language } from "$lib/i18n";
    import { openUrl } from "@tauri-apps/plugin-opener";

    interface Props {
        lang: Language;
        show: boolean;
        onClose: () => void;
    }

    let { lang, show, onClose }: Props = $props();

    const VERSION = "0.1.0";
    const GITHUB_URL = "https://github.com/sho11decade/WinTaskLite";

    const openGitHubLink = (event: MouseEvent) => {
        event.preventDefault();
        void openUrl(GITHUB_URL);
    };
</script>

{#if show}
    <div class="modal-overlay" onclick={onClose} role="presentation">
        <!-- svelte-ignore a11y_interactive_supports_focus -->
        <div
            class="modal-content"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="about-title"
        >
            <div class="modal-header">
                <h2 id="about-title">{t(lang, "about.title")}</h2>
                <button
                    class="close-btn"
                    onclick={onClose}
                    aria-label={t(lang, "about.close")}>✕</button
                >
            </div>

            <div class="modal-body">
                <div class="about-content">
                    <div class="logo">
                        <div class="logo-icon">TL</div>
                        <h3>TaskLite</h3>
                    </div>

                    <div class="version-info">
                        <strong>{t(lang, "about.version")}:</strong>
                        {VERSION}
                    </div>

                    <p class="description">
                        {t(lang, "about.description")}
                    </p>

                    <p class="features">
                        {t(lang, "about.features")}
                    </p>

                    <div class="links">
                        <a
                            href={GITHUB_URL}
                            onclick={openGitHubLink}
                            class="github-link"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path
                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                                />
                            </svg>
                            {t(lang, "about.github")}
                        </a>
                    </div>

                    <div class="license">
                        {t(lang, "about.license")}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-primary" onclick={onClose}>
                    {t(lang, "about.close")}
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
        max-width: 500px;
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
        padding: 32px 24px;
    }

    .about-content {
        text-align: center;
    }

    .logo {
        margin-bottom: 24px;
    }

    .logo-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 16px;
        background: linear-gradient(135deg, #bd93f9, #ff79c6);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        color: #282a36;
        box-shadow: 0 4px 16px rgba(189, 147, 249, 0.4);
    }

    .logo h3 {
        margin: 0;
        color: #f8f8f2;
        font-size: 1.8rem;
        font-weight: 700;
    }

    .version-info {
        margin-bottom: 20px;
        padding: 8px 16px;
        background: #44475a;
        border-radius: 4px;
        display: inline-block;
        color: #f8f8f2;
    }

    .version-info strong {
        color: #8be9fd;
    }

    .description {
        color: #f8f8f2;
        font-size: 1.1rem;
        margin: 16px 0;
        line-height: 1.6;
    }

    .features {
        color: #6272a4;
        font-size: 0.9rem;
        margin: 16px 0;
        line-height: 1.6;
    }

    .links {
        margin: 24px 0;
    }

    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: #44475a;
        color: #f8f8f2;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.2s;
        font-weight: 500;
    }

    .github-link:hover {
        background: #6272a4;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(98, 114, 164, 0.3);
    }

    .github-link svg {
        flex-shrink: 0;
    }

    .license {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #44475a;
        color: #6272a4;
        font-size: 0.9rem;
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
