import { Vue, Component } from 'vue-property-decorator';
import Collections from '@/models/collections';
import project from '@/models/project';
import {
  Auth,
  FirestoreDocument,
  FirestoreDocumentData,
  Storage
} from '@/vue-common';
import _ from 'lodash';

@Component({})
export default class Project extends Vue {
  private projectList: Array<FirestoreDocument<project>> = [];
  private showMenu = false;
  public projectSelected: boolean = false;
  private selected: string = '';
  private moreMenuClicked = false;
  private filterSelected = '전체';
  private searchInputModel = '';
  private inputModel = '';

  private ui = {
    categories: [
      {
        name: 'all',
        active: false,
        dataKey: 'all'
      },
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

  get currentUICategoriesNames() {
    const names: Array<string> = [];
    this.ui.categories.forEach(item => {
      names.push(item.name);
    });

    return names;
  }

  private changeSelection(e) {
    alert(e);
  }

  private showProgressbar() {
    this.$progress.show();
  }

  private onClicked = _.debounce(() => {
    console.warn('WT');
  }, 500);

  private clickToolbar() {
    console.log('click111');
    this.onClicked();
  }

  private showMoreMenu(id: string) {
    this.moreMenuClicked
      ? (this.moreMenuClicked = false)
      : (this.moreMenuClicked = true);
    console.log(this.moreMenuClicked);
  }

  get currentProjectList() {
    // const list = _(this.projectList).map(p => {
    //   return { item: p, selected: false };
    // });
    this.projectList = this.$store.getters.projectList;

    this.ui.categories.forEach(p => {
      if (p.name === this.filterSelected) {
        if (p.name !== 'all') {
          this.projectList = this.$store.getters.categoryGroups[p.dataKey];
        }
      }
    });
    this.$progress.off();

    this.projectList = _.filter(this.projectList, project => {
      return project.data.name.indexOf(this.searchInputModel) !== -1;
    });

    return this.projectList;
  }

  private setSearchModel(input) {
    this.searchInputModel = input;
  }
  private setInputModel = _.debounce(input => {
    this.setSearchModel(input);
  }, 500);

  private onSearch(e) {
    this.setInputModel(this.inputModel);
  }

  private goToProject(pid: string) {
    this.$router.push(`/myprojects/${pid}`);
  }

  private mounted() {
    console.log(this.projectList);
    // console.log('param', this.$route.params);
    // console.log('query', this.$route.query);
    // Auth.addChangeListener(
    //   'project',
    //   async u => {
    //     if (u === null) {
    //       this.$router.push('/');
    //       return;
    //     }
    //     // this.projects = await Collections.projects
    //     //   //@ts-ignore
    //     //   .createQuery(`users.${u.uid}`, '>', '')
    //     //   .exec(project);
    //     // this.projectList = this.projects;
    //     Collections.projects.clearOnChange();
    //     Collections.projects
    //       //@ts-ignore
    //       .createQuery(`users.${u.uid}`, '>', '')
    //       .onChange(project, (project, state) => {
    //         if (state === 'added') {
    //           this.projectList.push(project);
    //         } else if (state === 'removed') {
    //           const index = this.projectList.findIndex(p => {
    //             return p.id === project.id;
    //           });
    //           this.projectList.splice(index, 1);
    //           this.snackbar = true;
    //           this.snackbarText = '프로젝트가 삭제되었습니다.';
    //         } else if (state === 'modified') {
    //           const index = this.projectList.findIndex(p => {
    //             return p.id === project.id;
    //           });
    //           this.projectList.splice(index, 1, project);
    //           this.snackbar = true;
    //           this.$progress.off();
    //         }
    //         this.categoryGroups = _.groupBy(
    //           this.projectList,
    //           p => p.data.users[u.uid]
    //         );
    //       });
    //   },
    //   true
    // );
  }
}
