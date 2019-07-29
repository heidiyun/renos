import { FirestoreDocumentData } from '@/vue-common';

export default class ProjectFile extends FirestoreDocumentData {
  public name: string = '';
  public pid: string = '';
  public uid: string = '';
  public fileType: string = '';
  public uploadDate: string = '';
  public fileURL: string = '';
  public accessDate: string = '';
  public kind: string = '';
  public isMaterialDocument: boolean = false;
  public ownerMaterialDocument: string = '';
  public pins: { [key: string]: boolean } = {};
  public tags: [
    {
      name: string;
      color: string;
      selected: boolean;
    }
  ] = [{ name: '', color: '', selected: false }];
}
