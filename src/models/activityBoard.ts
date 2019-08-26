import { FirestoreDocumentData } from '@/vue-common';

import ActivityType from './ActivityType';
import { UserType } from './project';

export default class ActivityBoard extends FirestoreDocumentData {
  public date: string = '';
  public activeUserName: string = '';
  public activeUserPhotoURL: string = '';
  public targetPid: string = '';
  public fileName: string = '';
  public fileType: string = '';
  public fileURL: string = '';
  public inviteeUserName: string = '';
  public inviteeRole: UserType|undefined;
  public inviteeUserPhotoURL: string = '';
  public comment: string = '';
  public type: ActivityType | undefined = undefined;
}
