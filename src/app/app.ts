import 'babel-polyfill';

import { Vue, Component } from 'vue-property-decorator';
import { Auth, FirestoreDocument, Storage } from '@/vue-common';
import User from '@/models/user';
import Collections from '@/models/collections';
import ProjectCard from '@/components/projectCard';
import ProgressBar from '@/components/progress';
import ProgressMini from '@/components/progress-mini';
import project from '@/models/project';
import Spinner from '@/vue-common/plugins/spinner';
import Progress from '@/plugin/progress';
import _ from 'lodash';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import Opener from '@/components/opener';
import ProfileCard from '@/components/profileCard';

Vue.use(Antd);
Vue.use(Spinner);
Vue.use(Progress);
Vue.component('profile-card', ProfileCard);
Vue.component('opener', Opener);
Vue.component('project-card', ProjectCard);
Vue.component('progress-bar', ProgressBar);
Vue.component('progress-mini', ProgressMini);

@Component({})
export default class App extends Vue {
  $refs!: {
    opener: Opener;
  };
  private profileButtonClicked = false;
  private projects: Array<FirestoreDocument<project>> = [];
  private projectList: Array<FirestoreDocument<project>> = [];
  private projectTitle: string = '';
  private dialog = false;
  private snackbarText = '';
  private snackbar = false;

  private categoryGroups: {
    [key: string]: Array<FirestoreDocument<project>>;
  } = {
    supervisor: [],
    editor: [],
    viewer: []
  };

  private onHandleChange(e) {
    this.$router.push(`/myprojects/${e}`);
  }

  get currentProject() {
    this.$route.params;
    if (this.$store.getters.currentProject === undefined) return '';
    return this.$store.getters.currentProject.data.name;
  }

  private async createProject() {
    if (this.projectTitle.length === 0) return;

    const pj = Collections.projects.create(project);
    pj.data.name = this.projectTitle;
    pj.data.users = {
      [`${this.$store.getters.user.id}`]: 'supervisor'
    };
    const storage = new Storage(
      `defaults/${Math.floor(Math.random() * 20) + 1}.jpg`
    );
    pj.data.imageURL = await storage.getDownloadURL();

    pj.saveSync();
    this.dialog = false;
    this.projectTitle = '';
  }
  private goToProject(pid: string) {
    this.$router.push(`/myprojects/${pid}`);
  }

  get currentProjectList() {
    return _.map(this.projectList, project => {
      return project.data.name;
    });
  }

  private mounted() {
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
        // this.$router.push('/myprojects');
      } else {
        this.$store.commit('setUser', undefined);
      }
    });

    Auth.addChangeListener(
      'project',
      async u => {
        if (u === null) {
          this.$router.push('/');
          return;
        }

        // this.projects = await Collections.projects
        //   //@ts-ignore
        //   .createQuery(`users.${u.uid}`, '>', '')
        //   .exec(project);

        // this.projectList = this.projects;

        Collections.projects
          //@ts-ignore
          .createQuery(`users.${u.uid}`, '>', '')
          .onChange(project, (project, state) => {
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
            }
            this.categoryGroups = _.groupBy(
              this.projectList,
              p => p.data.users[u.uid]
            );
            this.projects = this.projectList;
            this.$store.commit('setProjectList', this.projectList);
            this.$store.commit('setCategoryGroups', this.categoryGroups);
          });
      },
      true
    );
  }
}
