const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'config');
const destDir = path.join(__dirname, 'build', 'config');

const copyFolderSync = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    fs.readdirSync(src).forEach((item) => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
};

copyFolderSync(srcDir, destDir);
