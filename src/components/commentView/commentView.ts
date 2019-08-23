import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import Comment from '@/models/comment';
import Collections from '@/models/collections';
import User from '@/models/user';
import moment from 'moment';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';
import util from '@/util';
import Notification, { NotificationType } from '@/models/notification';
import Project from '@/models/project';

@Component({})
export default class CommentView extends Vue {
  @Prop()
  public comment!: FirestoreDocument<Comment>;

  @Prop()
  public commentType!: string;
  @Prop()
  public role!: string;
  private commentModel: string = '';
  private photoUrl: string = '';
  private userName: string | null = null;
  private date: string = '';
  private isEdited: boolean = false;
  private enableDelete = false;
  private enableModify = false;
  private recipientUids: string[] = [];

  private onDelete() {
    if (this.comment.data.uid === this.$store.getters.user.id) {
      this.comment.delete();
    }
  }

  private showEditInput() {
    this.isEdited = true;
    this.commentModel = this.comment.data.content;
  }

  private onCancel() {
    if (this.isEdited) {
      this.isEdited = false;
      return;
    }
    this.commentModel = '';
  }

  private onEdit() {
    this.comment.update({
      content: this.commentModel
    });
    this.commentModel = '';
    this.isEdited = false;
  }

  private async registerComment() {
    if (this.isEdited) {
      this.onEdit();
      return;
    }
    const comments = Collections.comments.create(Comment);
    comments.data.content = this.commentModel;

    const notification = Collections.notifications.create(Notification);

    const uid = this.$store.getters.user.id;
    const fid = this.$store.getters.selectedFile.id;
    const pid = this.$store.getters.currentProject.id;

    if (this.commentType === 'project-comment-tab') {
      comments.data.pid = this.$store.getters.currentProject.id;
      comments.data.isProject = true;

      util.saveActivity(ActivityType.WRITECOMMENT, uid, pid, null, comments.id);

      notification.data.type = NotificationType.COMMENT_PROJECT;
    } else if (this.commentType === 'file-comment-tab') {
      comments.data.fid = this.$store.getters.selectedFile.id;
      comments.data.pid = this.$store.getters.currentProject.id;
      util.saveActivity(ActivityType.WRITECOMMENT, uid, pid, fid, comments.id);

      notification.data.type = NotificationType.COMMENT_FILE;
      notification.data.fid = fid;
    }
    comments.data.uid = this.$store.getters.user.id;
    comments.data.uploadDate = new Date().toUTCString();
    comments.saveSync();

    const project = await Collections.projects.load(
      Project,
      this.$store.getters.currentProject.id
    );

    this.recipientUids = Object.keys(project.data.users).filter(key => {
      return this.$store.getters.user.id !== key;
    });

    notification.data.activistUid = uid;
    notification.data.commentId = comments.id;
    notification.data.pid = pid;
    notification.data.recipientUid = this.recipientUids;
    notification.data.check = false;
    notification.save();

    this.commentModel = '';
  }

  private async mounted() {
    const user = await Collections.users.load(User, this.comment.data.uid);

    this.photoUrl = user.data.photoURL;
    this.userName = user.data.name;

    if (this.comment === null) {
      return;
    }

    this.date = moment(this.comment.data.uploadDate).format(
      'YY년MM월DD일 HH:mm'
    );
    if (
      this.comment.data.uid === this.$store.getters.user.id ||
      this.role === 'supervisor'
    ) {
      this.enableDelete = true;
    }
    if (this.comment.data.uid === this.$store.getters.user.id) {
      this.enableModify = true;
    }
  }
}
