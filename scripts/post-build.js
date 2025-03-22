const fs = require('fs-extra');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'out');

async function moveFiles() {
    try {
        // 将 en 目录下的所有文件移动到根目录
        await fs.copy(path.join(OUT_DIR, 'en'), OUT_DIR);
        // 删除原来的 en 目录
        await fs.remove(path.join(OUT_DIR, 'en'));
        // 将 en.html 重命名为 index.html
        const enHtmlPath = path.join(OUT_DIR, 'en.html');
        const indexHtmlPath = path.join(OUT_DIR, 'index.html');
        if (await fs.pathExists(enHtmlPath)) {
            await fs.rename(enHtmlPath, indexHtmlPath);
        }
        // 在out目录下生成.ok文件，用于标识成功便于 python 脚本判断是否成功
        const okFilePath = path.join(OUT_DIR, '.ok');
        await fs.writeFile(okFilePath, '');
        console.log('Successfully moved files from en directory to root');
    } catch (error) {
        console.error('Error moving files:', error);
        process.exit(1);
    }
}

moveFiles();