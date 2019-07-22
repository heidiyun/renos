import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage } from '@/vue-common';
import Collections from '@/models/collections';
import Project from '@/models/project';
import User from '@/models/user';
import ProjectFile from '@/models/projectFile';
import _ from 'lodash';
import Comment from '@/models/comment';

@Component({})
export default class Drive extends Vue {
  private members: Array<FirestoreDocument<User>> = [];
  private isOwner: boolean = false;
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  private fileList: Array<FirestoreDocument<ProjectFile>> = [];
  private showComment: boolean = false;
  private keyNum: number = 2;
  private commentList: Array<FirestoreDocument<Comment>> = [];

  get latestAccessFileList() {
    return _(this.fileList)
      .sortBy(f => {
        return f.data.name;
      })
      .filter(f => {
        if (this.$store.getters.selectedFileType === 'all') {
          return true;
        }
        return this.$store.getters.selectedFileType === f.data.kind;
      })
      .value();
  }

  get currentProjectCommentList() {
    return _.filter(this.commentList, comment => {
      return comment.data.isProject === true;
    });
  }

  get currentCommentList() {
    if (!this.showComment) {
      return;
    }
    this.keyNum;
    const list = _(this.commentList).filter(comment => {
      return comment.data.fid === this.$store.getters.selectedFile.id;
    });

    return list;
  }

  @Watch('$route', { deep: true })
  private onChangeRoute() {
    this.initailize();
  }

  private openComment() {
    this.showComment = true;
  }

  private async initailize() {
    const pid = this.$route.params.projectName;
    this.project = await Collections.projects.load(Project, pid);

    this.$store.commit('setCurrentProject', this.project);

    const keys = Object.keys(this.project.data.users);
    const users: Array<FirestoreDocument<User>> = [];

    for (const key of keys) {
      if (this.project.data.users[key] === 'supervisor') {
        if (key === this.$store.getters.user.id) {
          this.isOwner = true;
        }
      }
      users.push(await Collections.users.load(User, key));
    }
    this.members = users;

    this.fileList = [];

    Collections.files
      .createQuery('pid', '==', this.project.id)
      .onChange(ProjectFile, (file, state) => {
        if (state === 'added') {
          this.fileList.push(file);
        } else if (state === 'removed') {
          const index = _.findIndex(this.fileList, f => f.id === file.id);
          this.fileList.splice(index, 1);
        } else if (state === 'modified') {
          const index = _.findIndex(this.fileList, f => f.id === file.id);
          this.fileList.splice(index, 1, file);
        }
      });

    Collections.comments
      .createQuery('pid', '==', this.project.id)
      .onChange(Comment, (comment, state) => {
        if (state === 'added') {
          this.commentList.push(comment);
        } else if (state === 'removed') {
          const index = this.commentList.findIndex(c => {
            return c.id === comment.id;
          });

          this.commentList.splice(index, 1);
          this.commentList.splice(index, 1);
        } else if (state === 'modified') {
          const index = this.commentList.findIndex(c => {
            return c.id === comment.id;
          });
          this.commentList.splice(index, 1, comment);
        }
      });
  }

  private async mounted() {
    Auth.addChangeListener('driveAuth', async () => {
      this.initailize();
    });
  }
}
