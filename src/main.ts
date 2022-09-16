import './style.scss'
import { shell } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { register, isRegistered } from "@tauri-apps/api/globalShortcut";

const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll.bind(document);

$('#pageMain')!.addEventListener('click', async evt => {
    const li = evt.target as HTMLElement;
    const filePath = li.dataset['filePath'];
    if (filePath) {
        shell.open(filePath);
        appWindow.minimize();
    }
});

// Window Control
$('#pageHeader')!.addEventListener('click', async evt => {
    const ele = evt.target as HTMLElement;
    if (ele.tagName !== 'BUTTON') return;

    const cmd = ele.dataset['cmd'];
    switch (cmd) {
        case 'minimize':
            appWindow.minimize();
            break;
        case 'close':
            appWindow.close();
            break;
        default:
            console.log(`-- Invalid command passed ["${cmd}"]`);
    }
});

window.addEventListener('load', async _ => {
    const hotkey = 'Alt+Super+Enter';
    const isHotkeyRegistered = await isRegistered(hotkey);

    if (!isHotkeyRegistered) {
        await register(hotkey, async () => {
            appWindow.unminimize();
            appWindow.setFocus();
        });
    }
});

document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape')
        appWindow.minimize();
});

window.addEventListener('blur', _ => {
    appWindow.minimize();
});


