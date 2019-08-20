import { FirestoreDocumentData } from '@/vue-common';



export default class Project extends FirestoreDocumentData {
  public name: string = '';
  public imageURL: string = '';
  // TODO Role 에 대한 타입 설정
  public users: { [key: string]: string } = {};
  public pins: { [key: string]: boolean } = {};
  // DisplayWat 에 대한 타입 설정
  public displayWay: string = 'card';
  public tags: Array<{
    name: string;
    color: string;
  }> = [
      { name: 'design', color: '#D81B60' },
      { name: 'design', color: '#D81B60' },
      { name: 'design', color: '#D81B60' }
    ];
}
