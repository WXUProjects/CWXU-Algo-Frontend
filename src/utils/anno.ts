import type { Anno } from "./type";

// 模拟获取数据
const getAnnos = (): Anno[] => {
    return [
        {
            id: 1,
            content: '项目处于开发阶段中，可能存在各种bug，如果您遇到问题，欢迎提交issue',
            type: 'info',
            isclosed: false
        }
    ]
}

export default class AnnoStore {
    static getStorageAnnos(): Anno[] {
        return JSON.parse(localStorage.getItem('annos') || '[]')
    }

    static addStorageAnno(anno: Anno): void {
        const annos = this.getStorageAnnos();
        annos.push(anno);
        localStorage.setItem('annos', JSON.stringify(annos))
    }

    static setStorageAnnos(annos: Anno[]): void {
        localStorage.setItem('annos', JSON.stringify(annos))
    }

    static syncAnnos(): void {
        const annos = this.getStorageAnnos();
        const newAnnos = getAnnos();
        // 比较newAnnos和annos，如果newAnnos有新的公告，则添加到annos中
        newAnnos.forEach(newAnno => {
            if(!annos.find(anno => anno.id === newAnno.id) || newAnno.isclosed){
                annos.push(newAnno);
            };
        })
        this.setStorageAnnos(annos);
    }

    static closeAnno(id: number): void {
        const annos = this.getStorageAnnos();
        const newAnnos = annos.map(anno => {
            if(anno.id === id){
                anno.isclosed = true;
            }
            return anno;
        })
        this.setStorageAnnos(newAnnos);
    }
}