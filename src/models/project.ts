import { FirestoreDocumentData } from '@/vue-common';
import { Tags } from './projectFile';

export const enum UserType {
  SUPERVISOR = 'supervisor',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export default class Project extends FirestoreDocumentData {
  public name: string = '';
  public imageURL: string = '';
  // TODO Role 에 대한 타입 설정
  public users: { [key: string]: UserType } = {};
  public pins: { [key: string]: boolean } = {};
  // DisplayWat 에 대한 타입 설정
  public displayWay: string = 'card';
  public tags: Tags = {
    design: {
      name: 'design',
      selected: false,
      count: 0
    }
  };
}
