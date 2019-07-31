import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import Comment from '@/models/comment';
import Collections from '@/models/collections';
import User from '@/models/user';
import moment from 'moment';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';

@Component({})
export default class CommentView extends Vue {
  @Prop()
  public comment!: FirestoreDocument<Comment>;
  @Prop()
  public isInput!: boolean;
  @Prop()
  public keyNum!: number;
  @Prop()
  public role!: string;
  private commentModel: string = '';
  private photoUrl: string = '';
  private userName: string | null = null;
  private date: string = '';
  private isEdited: boolean = false;
  private enableDelete = false;
  private enableModify = false;

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
    console.log('dlkfsjlfjk');
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

    const activities = Collections.activityBoards.create(ActivityBoard);

    if (this.keyNum === 1) {
      comments.data.pid = this.$store.getters.currentProject.id;
      comments.data.isProject = true;
      activities.data.type = ActivityType.WRITECOMMENT;
    } else if (this.keyNum === 2) {
      comments.data.fid = this.$store.getters.selectedFile.id;
      comments.data.pid = this.$store.getters.currentProject.id;

      activities.data.targetFid = this.$store.getters.selectedFile.id;
      activities.data.type = ActivityType.WRITECOMMENT;
    }
    comments.data.uid = this.$store.getters.user.id;
    comments.data.uploadDate = new Date().toUTCString();
    comments.saveSync();
    this.commentModel = '';

    activities.data.activeUid = this.$store.getters.user.id;
    activities.data.date = new Date().toUTCString();
    activities.data.targetPid = this.$store.getters.currentProject.id;
    activities.data.comment = comments.data.content;

    await activities.saveSync();
  }

  private async mounted() {
    const user = await Collections.users.load(User, this.comment.data.uid);
    this.photoUrl = user.data.photoURL;
    this.userName = user.data.name;
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
