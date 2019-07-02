import { FirestoreDocumentData } from '@/vue-common';

export default class projectFile extends FirestoreDocumentData {
    public pid : string =""
    public uid : string=""
    public fileType: string=""
    public uploadDate: string=""
    public fileURL : string ="" 
    public tag: Array<String>[] = [];

}