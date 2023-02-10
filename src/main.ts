import './style.scss'
import { shell} from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { register, isRegistered } from "@tauri-apps/api/globalShortcut";
// import { BaseDirectory } from "@tauri-apps/api/fs";

const _ = document.querySelector.bind(document);
// const __ = document.querySelectorAll.bind(document);

_('#pageMain')!.addEventListener('click', async evt => {
    const li = evt.target as HTMLElement;
    const filePath = li.dataset['filePath'];
    // const dirPath = `C:\\Users\\nazhorn\\Desktop\\App's Shortcuts`;
    if (filePath)  {
        // const fp = `C:\\Users\\nazhorn\\Desktop\\App's Shortcuts\\${filePath}.lnk`;

        // console.log(await fs.exists(`App's Shortcuts\\${filePath}.lnk`, { dir: BaseDirectory.Desktop }))
        // if (!await fs.exists(fp))  {
        //     console.log(fp);
        //     return;
        // }

        await shell.open(`C:\\Users\\nazhorn\\Desktop\\App's Shortcuts\\${filePath}.lnk`);
        await appWindow.minimize();
    }
});

// Window Control
_('#pageHeader')!.addEventListener('click', async evt => {
    const ele = evt.target as HTMLElement;
    if (ele.tagName !== 'BUTTON') return;

    const cmd = ele.dataset['cmd'];
    switch (cmd) {
        case 'minimize':
            await appWindow.minimize();
            break;
        case 'close':
            await appWindow.close();
            break;
        default:
            console.log(`-- Invalid command passed ["${cmd}"]`);
    }
});

// window.kbdCheck = async (comb: string) => {
//     const chk = await isRegistered(comb);
//     console.log(`${comb} : ${chk}`);
// }

window.addEventListener('load', async _ => {
    const hotkey = 'Alt+Super+Enter';
    const isHotkeyRegistered = await isRegistered(hotkey);

    if (!isHotkeyRegistered) {
        await register(hotkey, async () => {
            await appWindow.unminimize();
            await appWindow.setFocus();
        });
    }
});

document.addEventListener('keydown', async evt => {
    if (evt.key === 'Escape')
        await appWindow.minimize();
});

// document.addEventListener('visibilitychange' , _ => console.log(document.visibilityState));

window.addEventListener('blur', async _ => {
    console.log(Date.now() + ' : blur')
    // if ((await appWindow.outerPosition()).x > 0)
    //     await appWindow.minimize();
});
