import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import Comment from '@/models/comment';
import Collections from '@/models/collections';
import Notification, { NotificationType } from '@/models/notification';
import User from '@/models/user';
import Project, { UserType } from '@/models/project';
import ProjectFile from '@/models/projectFile';

@Component({})
export default class NotificationView extends Vue {
  @Prop()
  public noti!: FirestoreDocument<Notification>;
  private activistUser: FirestoreDocument<User> = Collections.users.create(
    User
  );
  private notiMessage: string = '';
  private type: NotificationType | undefined = undefined;

  private async checkNotification() {
    this.noti.data.check = true;
    await this.noti.saveSync();
  }

  private async acceptInvitation() {
    const project = await Collections.projects.load(
      Project,
      this.noti.data.pid
    );
    if (this.noti.data.projectRole !== undefined) {
    }

    if (this.noti.data.projectRole !== undefined) {
      project.data.users[
        `${this.$store.getters.user.id}`
      ] = this.noti.data.projectRole;
    }
    await project.saveSync();

    this.checkNotification();
  }

  private created() {
    this.type = this.noti.data.type;
  }

  private async mounted() {
    const project = await Collections.projects.load(
      Project,
      this.noti.data.pid
    );

    this.activistUser = await Collections.users.load(
      User,
      this.noti.data.activistUid
    );

    let file;
    if (this.noti.data.fid !== '') {
      file = await Collections.files.load(ProjectFile, this.noti.data.fid);
    }

    switch (this.type) {
      case NotificationType.INVITATION:
        this.notiMessage = `${this.activistUser.data.name}이(가) ${
          project.data.name
        }에 초대했습니다.`;
        break;
      case NotificationType.COMMENT_PROJECT:
        this.notiMessage = `${this.activistUser.data.name}이(가) ${
          project.data.name
        }에 댓글을 작성했습니다.`;
        break;
      case NotificationType.COMMENT_FILE:
        this.notiMessage = `${this.activistUser.data.name}이(가) ${
          project.data.name
        }의 ${file.data.name}에 댓글을 작성했습니다.`;
        break;
      case NotificationType.SHARE:
        this.notiMessage = `${this.activistUser.data.name}이(가) ${
          project.data.name
        }의 ${file.data.name}을 공유했습니다.`;
        break;
    }
  }
}
