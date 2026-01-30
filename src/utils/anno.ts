import type { Anno } from "./type";

export default class AnnoStore {
    static getStorageAnnos(): Anno[] {
        return JSON.parse(localStorage.getItem('annos') || '[]')
    }

    static addStorageAnno(anno: Anno): void {
        const annos = this.getStorageAnnos();
        annos.push(anno);
        localStorage.setItem('annos', JSON.stringify(annos))
    }

    static syncAnnos(): void {
        const annos = this.getStorageAnnos();
        annos.forEach(anno => {
            if (!anno.isclosed) {
                this.addStorageAnno(anno);
            }
        })
    }
}