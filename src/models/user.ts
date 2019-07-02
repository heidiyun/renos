import { FirestoreDocumentData } from '@/vue-common';

export default class User extends FirestoreDocumentData {
  public name: string = '';
  public email: string = '';
  public photoURL: string = '';
  public uid: string = '';
}
