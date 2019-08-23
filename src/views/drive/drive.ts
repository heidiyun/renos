import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage, Log } from '@/vue-common';
import Collections from '@/models/collections';
import Project from '@/models/project';
import User from '@/models/user';
import ProjectFile from '@/models/projectFile';
import _ from 'lodash';
import Comment from '@/models/comment';
import ActivityBoard from '@/models/activityBoard';

@Component({})
export default class Drive extends Vue {
  private members: Array<FirestoreDocument<User>> = [];
  private role: string = '';
  private project: FirestoreDocument<Project> = Collections.projects.create(
    Project
  );
  private fileList: Array<FirestoreDocument<ProjectFile>> = [];
  private showComment: boolean = false;
  private commentTabKey: string = 'file-comment-tab';
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
    if (this.project.data.tags[tag] !== undefined) {
      delete this.project.data.tags[tag];
      this.project.saveSync();
    }
  }

  private get currentTag() {
    // this.project.data.tags.forEach(t => {
    //   let hasTag = false;
    //   if (t.name === 'design' || t.name === 'flow-chart' || t.name === 'code') {
    //     hasTag = true;
    //   }
    //   this.fileList.forEach(f => {
    //     f.data.tags.forEach(tag => {
    //       if (tag.name === t.name) {
    //         hasTag = true;
    //       }
    //     });
    //   });

    //   if (!hasTag) {
    //     const index = this.project.data.tags.findIndex(tag => {
    //       return t.name === tag.name;
    //     });
    //     this.project.data.tags.splice(index, 1);
    //     this.project.save();
    //   }
    // });

    return this.project.data.tags;
  }

  private changeAlignmentOrder() {
    if (this.alignmentKeys.order === 'asc') {
      this.alignmentKeys.order = 'dsc';
    } else {
      this.alignmentKeys.order = 'asc';
    }
  }
  // TODO
  get latestAccessdFileList() {
    const list = _(this.fileList)
      .sortBy(f => {
        return f.data[this.alignmentKey];
      })
      .filter(f => {
        const fileTags = _.map(f.data.tags, 'name');
        if (!this.selectedTags.every(tag => fileTags.includes(tag))) {
          return false;
        }

        if (this.$store.getters.selectedMenu === 'all') {
          return true;
        }

        switch (this.$store.getters.selectedMenu) {
          case 'image':
          case 'video':
          case 'file':
            return this.$store.getters.selectedMenu === f.data.kind;
          case 'material':
            return f.data.isMaterialDocument === true;
          case 'bookmark':
            return f.data.pins[this.$store.getters.user.id];
          default:
            return this.$store.getters.selectedMenu === f.data.uid;
        }
      })
      .value();

    if (this.alignmentKeys.order === 'dsc') {
      list.reverse();
    }

    return list;

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
    this.commentTabKey;
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
