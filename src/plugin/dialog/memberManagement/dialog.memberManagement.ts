import { Vue, Component } from 'vue-property-decorator';
import { UserType } from '@/models/project';
import Collections from '@/models/collections';
import User from '@/models/user';
import _ from 'lodash';
import Notification, { NotificationType } from '@/models/notification';

@Component({})
export default class DialogMemberManagement extends Vue {
  private on: boolean = false;
  private userTypes = [UserType.SUPERVISOR, UserType.EDITOR, UserType.VIEWER];
  private defaultValue = UserType.SUPERVISOR;
  private emailInputValue: string = '';
  private inviteMessage: string = '';
  private users: string[] = [];
  private currentUserId: string = '';
  private currentProjectId: string = '';
  private invalidEmail: boolean = false;
  // private rules = [value => this.emails.includes(value) || ''];

  public open(currentUserId: string, currentProjectId: string) {
    this.on = true;
    this.currentUserId = currentUserId;
    this.currentProjectId = currentProjectId;
  }

  public off() {
    this.on = false;
  }

  private async checkValidEmail() {}

  private async sendInvitation() {
    const user = await Collections.users
      .createQuery('email', '==', this.emailInputValue)
      .exec(User);
    this.invalidEmail = _.isEmpty(user);
    if (this.invalidEmail) {
      return;
    }

    const noti = await Collections.notifications.create(Notification);

    noti.data.activistUid = this.currentUserId;
    noti.data.recipientUid = [user[0].data.uid];
    noti.data.pid = this.currentProjectId;
    noti.data.projectRole = this.defaultValue;
    noti.data.invitationMessage = this.inviteMessage;
    noti.data.date = new Date().toUTCString();
    noti.data.type = NotificationType.INVITATION;
    noti.data.check = false;
    await noti.saveSync();

    this.off();
  }

  public async mounted() {}
}
