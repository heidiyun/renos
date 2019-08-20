import { FirestoreDocumentData } from '@/vue-common';
import { Tags } from './projectFile';



export default class Project extends FirestoreDocumentData {
  public name: string = '';
  public imageURL: string = '';
  // TODO Role 에 대한 타입 설정
  public users: { [key: string]: string } = {};
  public pins: { [key: string]: boolean } = {};
  // DisplayWat 에 대한 타입 설정
  public displayWay: string = 'card';
  public tags: Tags = {
    design: {
      name: 'design',
      selected: false,
      count: 0,
    }
  };
}
