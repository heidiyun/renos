import { FirestoreDocumentData } from '@/vue-common';

export default class Memeber extends FirestoreDocumentData{
  public uid: string = '';
  public pid: string = '';
  public right: string = 'viewer';
}
