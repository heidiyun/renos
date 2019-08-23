import { FirestoreDocumentData } from '@/vue-common';
import { UserType } from './project';

export enum NotificationType {
  INVITATION = '초대알림',
  COMMENT_FILE = '파일댓글알림',
  COMMENT_PROJECT = '프로젝트댓글알림',
  SHARE = '공유알림'
}

export default class Notification extends FirestoreDocumentData {
  public activistUid: string = '';
  public recipientUid: string[] = [];
  public pid: string = '';
  public fid: string = '';
  public commentId: string = '';
  public invitationMessage: string = '';
  public date: string = '';
  public projectRole: UserType | undefined;
  public type: NotificationType | undefined;
  public check: boolean = false;
}
