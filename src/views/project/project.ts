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
  private pinnedProjectList: Array<FirestoreDocument<project>> = [];
  private showMenu = false;
  public projectSelected: boolean = false;
  private selected: string = '';
  private moreMenuClicked = false;
  private filterSelected = '전체';
  private searchInputModel = '';
  private inputModel = '';
  private showAll = false;

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

  private get pinContainerHeight() {
    if (this.pinnedProjectList.length === 0) return;

    const std = document.getElementById('pin-project-layout');
    const card = document.getElementsByClassName('project-card-container');
    if (card.length === 0) return;

    const cellCount = Math.floor(std!.clientWidth / card[0].clientWidth);
    const rowCount = Math.floor((card.length - 1) / cellCount) + 1;
    const openHeight = rowCount * (card[0].clientHeight + 48);

    if (rowCount <= 1) return '345px';

    if (this.showAll) {
      return openHeight + 'px';
    } else {
      return '345px';
      // std!.style.whiteSpace = 'nowrap';
      // std!.style.overflow = 'hidden';
    }
  }

  get currentUICategoriesNames() {
    const names: Array<string> = [];
    this.ui.categories.forEach(item => {
      names.push(item.name);
    });

    return names;
  }

  private showProgressbar() {
    this.$progress.show();
  }

  private clicked = false;

  private clickToolbar() {
    this.clicked ? (this.clicked = false) : (this.clicked = true);
  }

  private showMoreMenu(id: string) {
    this.moreMenuClicked
      ? (this.moreMenuClicked = false)
      : (this.moreMenuClicked = true);
    console.log(this.moreMenuClicked);
  }

  get currentPinnedProjectList() {
    this.pinnedProjectList = _.sortBy(this.pinnedProjectList, project => {
      return project.data.name;
    });
    return this.pinnedProjectList;
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

    this.projectList = _.sortBy(this.projectList, project => {
      return project.data.name;
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

  private goToProject() {
    console.log('go-project');
    this.$router.push(`/myprojects/${this.$store.getters.currentProject.id}`);
  }

  private mounted() {
    // console.log('param', this.$route.params);
    // console.log('query', this.$route.query);

    Collections.projects
      //@ts-ignore
      .createQuery('pin', '==', true)
      .onChange(project, (project, state) => {
        if (state === 'added') {
          this.pinnedProjectList.push(project);
        } else if (state === 'removed') {
          const index = this.pinnedProjectList.findIndex(p => {
            return p.id === project.id;
          });
          this.pinnedProjectList.splice(index, 1);
        } else if (state === 'modified') {
          const index = this.pinnedProjectList.findIndex(p => {
            return p.id === project.id;
          });
          this.pinnedProjectList.splice(index, 1, project);
        }
      });
  }
}
