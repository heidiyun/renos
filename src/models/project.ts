import { FirestoreDocumentData } from '@/vue-common';

export default class Project extends FirestoreDocumentData {
  public name: string = '';
  public imageURL: string = '';
  public users: { [key: string]: string } = {};
  public pins: { [key: string]: boolean } = {};
  public tags: [
    {
      name: string;
      color: string;
    }
  ] = [{ name: '', color: '' }];
}
