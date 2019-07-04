import { Vue, Component } from 'vue-property-decorator';
import Collections from '@/models/collections';
import project from '@/models/project';
import { Auth, FirestoreDocument, FirestoreDocumentData } from '@/vue-common';
import _ from 'lodash';
import User from '@/models/user';
import router from '@/router';

@Component({})
export default class Project extends Vue {
  private dialog = false;
  private projectTitle: string = '';
  private projectList: Array<FirestoreDocument<project>> = [];
  private projects: Array<FirestoreDocument<project>> = [];
  private showMenu = false;
  public projectSelected: boolean = false;
  private ui = {
    categories: [
      {
        name: 'supervisor',
        active: false,
        dataKey: 'supervisor'
      },
      {
        name: 'editor',
        active: false,
        dataKey: 'editor'
      },
      {
        name: 'viewer',
        active: false,
        dataKey: 'viewer'
      }
    ]
  };

  private categoryGroups: {
    [key: string]: Array<FirestoreDocument<project>>;
  } = {
    supervisor: [],
    editor: [],
    viewer: []
  };

  get currentProjectList() {
    this.projectList = this.projects;
    this.ui.categories.forEach(p => {
      if (p.active) {
        this.projectList = this.categoryGroups[p.dataKey];
      }
    });

    // const list = _(this.projectList).map(p => {
    //   return { item: p, selected: false };
    // });

    return this.projectList;
  }

  private createProject() {
    if (this.projectTitle.length === 0) return;

    const pj = Collections.projects.create(project);
    pj.data.name = this.projectTitle;
    pj.data.users = {
      [`${this.$store.getters.user.id}`]: 'supervisor'
    };

    pj.saveSync();
    this.dialog = false;
    this.projectTitle = '';
  }
  private goToProject(pid: string) {
    this.$router.push(`/myprojects/${pid}`);
  }

  private mounted() {
    console.log('param', this.$route.params);
    console.log('query', this.$route.query);
    Auth.addChangeListener(
      'project',
      async u => {
        if (u === null) {
          this.$router.push('login');
          return;
        }

        this.projects = await Collections.projects
          //@ts-ignore
          .createQuery(`users.${u.uid}`, '>', '')
          .exec(project);

        this.projectList = this.projects;

        this.categoryGroups = _.groupBy(
          this.projectList,
          p => p.data.users[u.uid]
        );

        // Collections.projects.clearOnChange();

        // Collections.projects.onChange(Project, (project, state) => {
        //   if (state === 'added') {
        //     console.log('added');
        //     this.projectList.push(project);
        //   }
        // });
      },
      true
    );
  }
}
