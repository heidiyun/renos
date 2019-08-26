import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import Comment from '@/models/comment';
import Collections from '@/models/collections';
import User from '@/models/user';
import moment from 'moment';
import util from '@/util';
import ActivityType from '@/models/ActivityType';

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

    if (this.commentType === 'project-comment-tab') {
      util.saveActivity(
        ActivityType.MODIFYCOMMENT,
        this.$store.getters.user.id,
        this.$store.getters.currentProject.id,
        null,
        this.comment.id,
        null,
        null
      );
    }
    util.saveActivity(
      ActivityType.MODIFYCOMMENT,
      this.$store.getters.user.id,
      this.$store.getters.currentProject.id,
      this.comment.data.fid,
      this.comment.id,
      null,
      null
    );
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
