import { Vue, Component } from 'vue-property-decorator';
import Collections from '@/models/collections';
import Project from '@/models/project';
import {
  Auth,
  FirestoreDocument,
  FirestoreDocumentData,
  Storage
} from '@/vue-common';
import _ from 'lodash';


@Component({})
export default class ProjectPage extends Vue {
  public $refs!: {
    searchInput: HTMLInputElement;
  };
  public projectSelected: boolean = false;
  private projectList: Array<FirestoreDocument<Project>> = [];
  private pinnedProjectList: Array<FirestoreDocument<Project>> = [];
  private showMenu = false;
  private selected: string = '';
  private moreMenuClicked = false;
  private filterSelected = 'all';
  private searchInputModel = '';
  private inputModel = '';
  private showAll = false;
  private clicked = false;

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

  private setInputModel = _.debounce(input => {
    this.setSearchModel(input);
  }, 500);

  private get pinContainerHeight() {
    if (this.currentPinnedProjectList.length === 0) {
      return '0px';
    }

    if (!this.showAll) {
      return '295px';
    }
    const std = document.getElementById('pin-project-layout');
    const card = document.getElementsByClassName('project-card-container');

    if (card.length === 0) {
      return '295px';
    }
    const cardHeight = card[0].clientHeight;
    const cardWidth = card[0].clientWidth;

    const cellCount = Math.floor(std!.clientWidth / card[0].clientWidth);
    const rowCount =
      Math.floor((this.currentPinnedProjectList.length - 1) / cellCount) + 1;
    const openHeight = rowCount * (card[0].clientHeight + 16);

    if (rowCount <= 1) {
      return '295px';
    }

    return openHeight + 'px';
  }

  get currentUICategoriesNames() {
    const names: string[] = [];
    this.ui.categories.forEach(item => {
      names.push(item.name);
    });

    return names;
  }

  private showProgressbar() {
    this.$progress.show();
  }

  private clickToolbar() {
    this.clicked ? (this.clicked = false) : (this.clicked = true);
  }

  private showMoreMenu(id: string) {
    this.moreMenuClicked
      ? (this.moreMenuClicked = false)
      : (this.moreMenuClicked = true);
  }

  get currentPinnedProjectList() {
    return _(this.$store.getters.projectList as Array<
      FirestoreDocument<Project>
    >)
      .filter(project => project.data.pins[this.$store.getters.user.id])
      .sortBy(project => project.data.name)
      .value();
  }

  get currentProjectList() {
    // const list = _(this.projectList).map(p => {
    //   return { item: p, selected: false };
    // });

    // this.ui.categories.forEach(p => {
    //   if (p.name === this.filterSelected) {
    //     if (p.name !== 'all') {
    //       this.projectList = this.$store.getters.categoryGroups[p.dataKey];
    //     }
    //   }
    // });

    // projectList = _.filter(this.projectList, project => {
    //   return project.data.name.indexOf(this.searchInputModel) !== -1;
    // });

    // projectList = _.sortBy(this.projectList, project => {
    //   return project.data.name;
    // });

    // return projectList;

    // TODO Review

    const projectList: Array<FirestoreDocument<Project>> = this.$store.getters
      .projectList;
    return _(projectList)
      .filter(project => {
        if (this.filterSelected === 'all') {
          return true;
        }
        return (
          project.data.users[this.$store.getters.user.id] ===
          this.filterSelected
        );
      })
      .filter(
        project => project.data.name.indexOf(this.searchInputModel) !== -1
      )
      .sortBy(project => project.data.name)
      .value();
  }

  private setSearchModel(input) {
    this.searchInputModel = input;
  }

  private onSearch(e) {
    this.setInputModel(this.inputModel);
  }

  private goToProject() {
    this.$router.push(`/projects/${this.$store.getters.currentProject.id}`);
  }

  private mounted() {
    this.$dialogPreview.off();

    // console.log('param', this.$route.params);
    // console.log('query', this.$route.query);
    // Auth.addChangeListener('project', (u) => {
    //   Collections.projects
    //     .createQuery('pin', '==', true)
    //     // @ts-ignore
    //     .query(`users.${u.uid}`, '>', '')
    //     .onChange(Project, (project, state) => {
    //       if (state === 'added') {
    //         this.pinnedProjectList.push(project);
    //       } else if (state === 'removed') {
    //         const index = this.pinnedProjectList.findIndex(p => {
    //           return p.id === project.id;
    //         });
    //         this.pinnedProjectList.splice(index, 1);
    //       } else if (state === 'modified') {
    //         const index = this.pinnedProjectList.findIndex(p => {
    //           return p.id === project.id;
    //         });
    //         this.pinnedProjectList.splice(index, 1, project);
    //       }
    //     });
    // }
    // );
  }
}
