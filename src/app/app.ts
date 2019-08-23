import 'babel-polyfill';

import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage, Firebase } from '@/vue-common';
import User from '@/models/user';
import Collections from '@/models/collections';
import ProjectCard from '@/components/projectCard';
import ProgressBar from '@/components/progress';
import ProgressMini from '@/components/progress-mini';
import Project, { UserType } from '@/models/project';
import Spinner from '@/vue-common/plugins/spinner';
import Progress from '@/plugin/progress';
import _ from 'lodash';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import Opener from '@/components/opener';
import ProfileCard from '@/components/profileCard';
import DialogSimple from '@/plugin/dialog';
import ProjectFile from '@/models/projectFile';
import FileCard from '@/components/fileCard';
import CommentView from '@/components/commentView';
import FirestoreCollectionQuery from '@/vue-common/firebase/firestore/collectionQuery';
import FileTable from '@/components/fileTable';
import ActivityCard from '@/components/activityCard';
import Util from '@/util';
import Comment from '@/models/comment';
import NotificationView from '@/components/notificationView';
import Notification from '@/models/notification';

Vue.use(Antd);
Vue.use(Spinner);
Vue.use(Progress);
Vue.use(DialogSimple);
Vue.component('profile-card', ProfileCard);
Vue.component('opener', Opener);
Vue.component('project-card', ProjectCard);
Vue.component('progress-bar', ProgressBar);
Vue.component('progress-mini', ProgressMini);
Vue.component('file-card', FileCard);
Vue.component('comment-view', CommentView);
Vue.component('file-table', FileTable);
Vue.component('activity-card', ActivityCard);
Vue.component('notification-view', NotificationView);

declare module 'vue/types/vue' {
  interface Vue {
    $app: App;
  }
}

@Component({})
export default class App extends Vue {
  public $refs!: {
    profileOpener: Opener;
    notiOpener: Opener;
  };
  public util = Util;
  private profileButtonClicked = false;
  private projects: Array<FirestoreDocument<Project>> = [];
  private projectList: Array<FirestoreDocument<Project>> = [];
  private snackbarText = '';
  private snackbar = false;
  private result: Array<FirestoreDocument<User>> = [];
  private rootSubmenuKeys = ['sub1', 'sub2'];
  private openKeys: string[] = ['sub1'];
  private categoryGroups: {
    [key: string]: Array<FirestoreDocument<Project>>;
  } = {
    supervisor: [],
    editor: [],
    viewer: []
  };
  private showNotifications: boolean = false;
  private input;
  private comments: Array<FirestoreDocument<Comment>> = [];

  private onHandleChange(e) {
    this.$router.push(`/projects/${e}`);
  }
  public notifications: Array<FirestoreDocument<Notification>> = [];

  get currentProject() {
    if (this.$store.getters.currentProject === undefined) {
      return '';
    }
    return this.$store.getters.currentProject.data.name;
  }

  private onOpenChange(openKeys) {
    const latestOpenKey = openKeys.find(
      key => this.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.openKeys = openKeys;
    } else {
      this.openKeys = latestOpenKey ? [latestOpenKey] : [];
    }
  }

  private uploadFile() {
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'file');
    this.input.setAttribute('accept', '*/*');
    this.input.setAttribute('multiple', '');
    this.input.style.display = 'none';

    this.input.addEventListener('change', e => {
      this.util.saveFile(
        e,
        this.$store.getters.currentProject.id,
        this.$store.getters.user.id
      );
    });
    this.input.click();
    document.body.appendChild(this.input);
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
  private clickMenuItem(menu: string, uid?: string) {
    if (menu === 'user') {
      if (uid === undefined) {
        return;
      }
      this.$store.commit('setSelectedMenu', uid);
    } else {
      this.$store.commit('setSelectedMenu', menu);
    }
  }

  private async createProject() {
    let projectTitle = '';
    try {
      projectTitle = await this.$dialogInput.open(
        '프로젝트 생성',
        '',
        '취소',
        '프로젝트 생성'
      );
    } catch (e) {
      return;
    }
    const project = Collections.projects.create(Project);
    project.data.name = projectTitle;
    project.data.users = {
      [`${this.$store.getters.user.id}`]: UserType.SUPERVISOR
    };
    const storage = new Storage(
      `defaults/${Math.floor(Math.random() * 20) + 1}.jpg`
    );
    project.data.imageURL = await storage.getDownloadURL();

    // project.data.tags.push({ name: 'design', color: '#D81B60' });
    // project.data.tags.push({ name: 'code', color: '#8E24AA' });
    // project.data.tags.push({ name: 'flow-chart', color: '#E53935' });

    project.saveSync();
  }

  get currentProjectList() {
    return _.map(this.projectList, project => {
      return project.data.name;
    });
  }

  get showSelect() {
    if (this.$route.name === 'login') {
      return false;
    } else if (this.$route.name === 'projects') {
      return false;
    } else {
      return true;
    }
  }
  private created() {
    Vue.prototype.$app = this;
  }

  private async mounted() {
    this.$store.commit('setSelectedMenu', 'all');

    // User Data Set
    Auth.addChangeBeforeListener('login', async u => {
      if (u !== null) {
        const exist = await Collections.users.exist(u.uid);
        if (exist) {
          const user = await Collections.users.load(User, u.uid);
          this.$store.commit('setUser', user);
        } else {
          const user = Collections.users.create(User, u.uid);
          user.data.name = u.displayName ? u.displayName : '';
          user.data.email = u.email ? u.email : '';
          user.data.photoURL = u.photoURL ? u.photoURL : '';
          user.data.uid = u.uid ? u.uid : '';
          user.saveSync();
          this.$store.commit('setUser', user);
        }
      } else {
        this.$store.commit('setUser', undefined);
      }
    });

    // this.$store.commit('setSelectedFileType', 'all');

    Auth.addChangeListener(
      'project',
      async u => {
        if (u === null) {
          this.$router.push('/');
          return;
        }

        // Project Data Set
        Collections.projects
          // @ts-ignore
          .createQuery(`users.${u.uid}`, '>', '')
          .onChange(Project, (project, state) => {
            if (state === 'added') {
              this.projectList.push(project);
            } else if (state === 'removed') {
              const index = this.projectList.findIndex(p => {
                this.snackbar = true;
                this.snackbarText = '프로젝트가 삭제되었습니다.';
                return p.id === project.id;
              });
              this.projectList.splice(index, 1);
            } else if (state === 'modified') {
              const index = this.projectList.findIndex(p => {
                return p.id === project.id;
              });
              this.projectList.splice(index, 1, project);
              this.snackbar = true;
              this.snackbarText = '변경사항이 적용되었습니다.';
              this.$progress.off();
            }
            this.categoryGroups = _.groupBy(
              this.projectList,
              p => p.data.users[u.uid]
            );
            this.projects = this.projectList;
            this.$store.commit('setProjectList', this.projectList);
            this.$store.commit('setCategoryGroups', this.categoryGroups);
          });

        Collections.notifications
          // @ts-ignore
          .createQuery('recipientUid', 'array-contains', u.uid)
          .query('check', '==', false)
          .onChange(Notification, (noti, state) => {
            if (state === 'added') {
              this.notifications.push(noti);
            } else if (state === 'removed') {
              const index = this.notifications.findIndex(n => {
                return n.id === noti.id;
              });
              this.notifications.splice(index, 1);
            }
          });
      },
      true
    );
  }
}
