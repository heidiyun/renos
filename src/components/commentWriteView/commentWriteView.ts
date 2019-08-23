import { Vue, Component, Prop } from 'vue-property-decorator';
import util from '@/util';
import Collections from '@/models/collections';
import Comment from '@/models/comment';
import { database } from 'firebase';

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

  private async saveComment() {
    const comment = await Collections.comments.create(Comment);

    if (this.commentType === 'file-comment-tab') {
      comment.data.fid = this.$store.getters.selectedFile.id;
      comment.data.isProject = false;
    } else if (this.commentType === 'project-comment-tab') {
      comment.data.isProject = true;
    }

    comment.data.uid = this.$store.getters.user.id;
    comment.data.pid = this.$store.getters.currentProject.id;
    comment.data.content = this.ui.inputValue;
    comment.data.uploadDate = new Date().toUTCString();
    await comment.saveSync();

    this.cleanInputValue();
  }

  private mounted() {}
}
