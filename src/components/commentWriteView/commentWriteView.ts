import { Vue, Component, Prop } from 'vue-property-decorator';
import util from '@/util';
import Collections from '@/models/collections';
import Comment from '@/models/comment';
import ActivityType from '@/models/ActivityType';
import { FirestoreDocument } from '@/vue-common';
import { NotificationType } from '@/models/notification';

@Component({})
export default class CommentWriteView extends Vue {
  @Prop()
  private commentType!: string;

  private ui = {
    inputValue: ''
  };

  private cleanInputValue() {
    this.ui.inputValue = '';
  }

  private async saveComment(comment, uid, pid, content, isProject, fid?) {
    comment.data.uid = uid;
    comment.data.pid = pid;
    comment.data.content = content;
    comment.data.uploadDate = new Date().toUTCString();
    comment.data.fid = fid;
    comment.data.isProject = isProject;
    await comment.saveSync();
  }

  private async registerComment() {
    const comment = await Collections.comments.create(Comment);

    const uid = this.$store.getters.user.id;
    const fid = this.$store.getters.selectedFile.id;
    const pid = this.$store.getters.currentProject.id;

    if (this.commentType === 'file-comment-tab') {
      this.saveComment(comment, uid, pid, this.ui.inputValue, false, fid);

      util.saveNotification(
        NotificationType.COMMENT_FILE,
        uid,
        pid,
        fid,
        comment
      );
      util.saveActivity(
        ActivityType.WRITECOMMENT,
        uid,
        pid,
        fid,
        comment.id,
        null,
        null
      );
    } else if (this.commentType === 'project-comment-tab') {
      this.saveComment(comment, uid, pid, this.ui.inputValue, true, null);

      util.saveNotification(
        NotificationType.COMMENT_PROJECT,
        uid,
        pid,
        null,
        comment
      );
      util.saveActivity(
        ActivityType.WRITECOMMENT,
        uid,
        pid,
        null,
        comment.id,
        null,
        null
      );
    }

    this.cleanInputValue();
  }
}
