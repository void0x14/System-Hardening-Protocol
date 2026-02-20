import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    const trModule = await import('./src/js/locales/tr.js');
    const tr = trModule.default;

    function findPath(obj, currentPath = '') {
        let result = {};
        for (let key in obj) {
            let newPath = currentPath ? `${currentPath}.${key}` : key;
            if (typeof obj[key] === 'string') {
                result[obj[key]] = newPath;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(result, findPath(obj[key], newPath));
            }
        }
        return result;
    }

    const map = findPath(tr);
    console.log('--- MAP ---');
    console.log('bardak:', map['bardak']);
    console.log('GÖREV:', map['GÖREV']);
    console.log('Mevcut Şifre:', map['Mevcut Şifre']);
    console.log('Toplam: {val} ton:', map['Toplam: {val} ton']);
    console.log('TAMAMLANDI:', map['TAMAMLANDI']);
    console.log('Süre:', map['Süre']);
    console.log('Aktivite:', map['Aktivite']);
    console.log('Görev:', map['Görev']);
}

run().catch(console.error);
