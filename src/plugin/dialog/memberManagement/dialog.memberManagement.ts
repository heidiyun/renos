import { Vue, Component } from 'vue-property-decorator';
import { UserType } from '@/models/project';
import Collections from '@/models/collections';
import User from '@/models/user';
import _ from 'lodash';
import Notification, { NotificationType } from '@/models/notification';
import util from '@/util';

@Component({})
export default class DialogMemberManagement extends Vue {
  private on: boolean = false;
  private userTypes = [UserType.SUPERVISOR, UserType.EDITOR, UserType.VIEWER];
  private defaultValue = UserType.SUPERVISOR;
  private emailInputValue: string = '';
  private inviteMessage: string = '';
  private errorMessage = '없는 사용자 이메일 입니다.';
  private users: string[] = [];
  private currentUserId: string = '';
  private currentProjectId: string = '';
  private invalidEmail: boolean = false;

  public open(currentUserId: string, currentProjectId: string) {
    this.on = true;
    this.currentUserId = currentUserId;
    this.currentProjectId = currentProjectId;
  }

  public off() {
    this.on = false;
  }

  private async sendInvitation() {
    const users = await Collections.users
      .createQuery('email', '==', this.emailInputValue)
      .exec(User);

    const user = await Collections.users.load(User, this.currentUserId);
    if (this.emailInputValue === user.data.email) {
      this.errorMessage = '본인은 추가할 수 없습니다.';
      this.invalidEmail = true;
    }

    this.invalidEmail = _.isEmpty(users);

    if (this.invalidEmail) {
      return;
    }

    const noti = await Collections.notifications.create(Notification);

    noti.data.activeUid = this.currentUserId;
    noti.data.recipientUid = [users[0].data.uid];
    noti.data.pid = this.currentProjectId;
    noti.data.projectRole = this.defaultValue;
    noti.data.invitationMessage = this.inviteMessage;
    noti.data.date = new Date().toUTCString();
    noti.data.type = NotificationType.INVITATION;
    noti.data.check = false;
    await noti.saveSync();

    this.off();
  }
}
