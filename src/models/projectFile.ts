import { FirestoreDocumentData } from '@/vue-common';

export interface TagValue {
  name: string;
  selected: boolean;
  count: number;
}

export interface Tags {
  [key: string]: TagValue;
}

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
  public tags: Tags = {};
  public fileSize: number = 0;
  public shareDate: string = '';
}
