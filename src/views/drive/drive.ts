import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage, Log } from '@/vue-common';
import Collections from '@/models/collections';
import Project from '@/models/project';
import User from '@/models/user';
import ProjectFile from '@/models/projectFile';
import _ from 'lodash';
import Comment from '@/models/comment';
import ActivityBoard from '@/models/activityBoard';
import ActivityType from '@/models/ActivityType';

@Component({})
export default class Drive extends Vue {
  private members: Array<FirestoreDocument<User>> = [];
  private role: string = '';
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  private fileList: Array<FirestoreDocument<ProjectFile>> = [];
  private showComment: boolean = false;
  private keyNum: number = 2;
  private commentList: Array<FirestoreDocument<Comment>> = [];
  private selectedTags: string[] = [];
  private isDragging = false;
  private alignmentKey = 'name';
  private activities: Array<FirestoreDocument<ActivityBoard>> = [];
  private alignmentKeys = {
    name: ['이름', '업로드 시간'],
    order: 'asc'
  };

  private get currentIsDragging() {
    return this.isDragging;
  }

  private changeFileDisplayWay() {
    this.project.data.displayWay =
      this.project.data.displayWay === 'card' ? 'table' : 'card';
    this.project.save();
  }

  private removeTag(tag) {
    const index = this.project.data.tags.findIndex(t => {
      return t.name === tag.name;
    });
    this.project.data.tags.splice(index, 1);
    this.project.saveSync();
  }

  private addTag(name: string, color: string) {
    this.project.data.tags.push({ name, color });
    this.project.saveSync();
  }

  private get currentTag() {
    this.project.data.tags.forEach(t => {
      let hasTag = false;
      if (t.name === 'design' || t.name === 'flow-chart' || t.name === 'code') {
        hasTag = true;
      }
      this.fileList.forEach(f => {
        f.data.tags.forEach(tag => {
          if (tag.name === t.name) {
            hasTag = true;
          }
        });
      });

      if (!hasTag) {
        const index = this.project.data.tags.findIndex(tag => {
          return t.name === tag.name;
        });
        this.project.data.tags.splice(index, 1);
        this.project.save();
      }
    });

    return this.project.data.tags;
  }

  private changeAlignmentOrder() {
    if (this.alignmentKeys.order === 'asc') {
      this.alignmentKeys.order = 'dsc';
    } else {
      this.alignmentKeys.order = 'asc';
    }
  }

  get latestAccessdFileList() {
    const list = _(this.fileList)
      .sortBy(f => {
        return f.data[this.alignmentKey];
      })
      .filter(f => {
        if (this.$store.getters.selectedFileType === 'all') {
          return true;
        }
        return this.$store.getters.selectedFileType === f.data.kind;
      })
      .filter(f => {
        if (this.$store.getters.selectedUser === undefined) return true;
        return this.$store.getters.selectedUser.id === f.data.uid;
      })
      .filter(f => {
        if (this.$store.getters.selectedMenu === undefined) {
          return true;
        }
        if (this.$store.getters.selectedMenu === 'material') {
          return f.data.isMaterialDocument === true;
        } else if (this.$store.getters.selectedMenu === 'bookmark') {
          return f.data.pins[this.$store.getters.user.id];
        }
        return true;
      })
      .value();

    if (this.alignmentKeys.order === 'dsc') {
      list.reverse();
    }

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
    this.isDragging = false;
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
    projectFile.data.fileSize = this.getReadableFileSizeString(file.size);
    await projectFile.saveSync();

    const activities = Collections.activityBoards.create(ActivityBoard);

    activities.data.activeUid = this.$store.getters.user.id;
    activities.data.date = new Date().toUTCString();
    activities.data.targetPid = this.project.id;
    activities.data.targetFid = projectFile.id;
    activities.data.type = ActivityType.UPLOAD;
    await activities.saveSync();

    this.$progress.off();
  }

  private getReadableFileSizeString(fileSizeInBytes) {
    let i = 0;
    const byteUnits = [
      '바이트',
      'KB',
      ' MB',
      ' GB',
      ' TB',
      'PB',
      'EB',
      'ZB',
      'YB'
    ];
    if (fileSizeInBytes <= 1024) {
    } else {
      do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
      } while (fileSizeInBytes > 1024);
    }

    return Math.max(fileSizeInBytes, 0).toFixed(0) + byteUnits[i];
  }

  private get currentProjectMembers() {
    if (this.$store.getters.projectMembers !== undefined) {
      return this.$store.getters.projectMembers;
    }
  }

  private get currentRoleOfUser() {
    if (this.$store.getters.currentProject === undefined) {
      return false;
    }

    if (
      this.$store.getters.currentProject.data.users[
        this.$store.getters.user.id
      ] === 'viewer'
    ) {
      return false;
    } else {
      return true;
    }
  }

  private onHandleSelectedTagChanged(e) {
    this.selectedTags = e;
  }

  get currentActivities() {
    return _.sortBy(this.activities, a => {
      return a.data.date;
    }).reverse();
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
      if (key === this.$store.getters.user.id) {
        this.role = this.project.data.users[key];
      }

      users.push(await Collections.users.load(User, key));
    }
    this.members = users;
    this.$store.commit('setProjectMembers', this.members);

    Collections.activityBoards
      .createQuery('targetPid', '==', this.project.id)
      .onChange(ActivityBoard, (activity, state) => {
        if (state === 'added') {
          this.activities.push(activity);
          console.log('added');
        }
      });

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
