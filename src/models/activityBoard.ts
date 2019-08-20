import { FirestoreDocument, FirestoreDocumentData } from '@/vue-common';
import User from './user';
import Collections from './collections';
import Project from './project';
import ProjectFile from './projectFile';
import ActivityType from './ActivityType';

export default class ActivityBoard extends FirestoreDocumentData {
  public date: string = '';
  public activeUid: string = '';
  public targetPid: string = '';
  public targetFid: string = '';
  public inviteeUid: string = '';
  public comment: string = '';
  public type: ActivityType | undefined = undefined;
}
