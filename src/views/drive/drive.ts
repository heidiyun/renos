import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage, Log } from '@/vue-common';
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
  private mainTag: string = '';
  private selectedTags: string[] = [];
  private input;
  private isDragging = false;

  // private tags = [
  //   {
  //     name: 'design',
  //     color: '#dddfff'
  //   },
  //   {
  //     name: 'code',
  //     color: '#cccccc'
  //   },
  //   {
  //     name: 'flow-chart',
  //     color: '#999999'
  //   }
  // ];

  private get currentIsDragging() {
    console.log(this.isDragging); 
    return this.isDragging;
  }

  private addTag(name: string, color: string) {
    this.project.data.tags.push({ name, color });
    this.project.saveSync();
  }

  private get currentTag() {
    return this.project.data.tags;
  }

  get latestAccessdFileList() {
    const list = _(this.fileList)
      .sortBy(f => {
        return f.data.name;
      })
      .filter(f => {
        if (this.$store.getters.selectedFileType === 'all') {
          return true;
        }
        return this.$store.getters.selectedFileType === f.data.kind;
      })
      .filter(f => {
        console.log(this.$store.getters.selectedUser);
        if (this.$store.getters.selectedUser === undefined) return true;
        return this.$store.getters.selectedUser.id === f.data.uid;
      })
      .value();

    if (this.selectedTags.length <= 0) {
      return list;
    }
    const result: Array<FirestoreDocument<ProjectFile>> = [];

    list.forEach(f => {
      const ret2 = _.map(f.data.tags, 'name');

      if (this.selectedTags.every(r => ret2.includes(r))) {
        result.push(f);
      }
    });

    return result;
  }

  private async onChange(e) {
    this.$progress.show();
    const file = e.target.files[0];
    const projectFile = Collections.files.create(ProjectFile);

    const storage = new Storage(`/files/${projectFile.id}`);
    await storage.upload(file);
    const url = await storage.getDownloadURL();

    projectFile.data.name = file.name;
    projectFile.data.pid = this.$store.getters.currentProject.id;
    projectFile.data.uid = this.$store.getters.user.id;
    projectFile.data.uploadDate = new Date().toUTCString();
    projectFile.data.fileType = file.type;
    projectFile.data.fileURL = url;

    await projectFile.saveSync();
    this.$progress.off();
    document.body.removeChild(this.input);

    // document.body.removeChild(input);
  }

  private onHandleSelectedTagChanged(e) {
    this.selectedTags = e;
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
