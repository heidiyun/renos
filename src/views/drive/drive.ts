import { Vue, Component } from 'vue-property-decorator';
import Collections from '@/models/collections';
import Project from '@/models/project';
import { Auth, FirestoreDocument, FirestoreDocumentData } from '@/vue-common';
import _ from 'lodash';
import User from '@/models/user';

@Component({})
export default class Drive extends Vue {
  private dialog = false;
  private projectTitle: string = '';
  private projectList: Array<FirestoreDocument<Project>> = [];
  private imageList = [
    'https://png.pngtree.com/thumb_back/fw800/back_pic/02/66/81/39578b81744df9f.jpg',
    'http://cfile225.uf.daum.net/image/2572C63851AE0A84105A82',
    'http://cfile222.uf.daum.net/image/2668933953157BC9169043',
    'https://t1.daumcdn.net/cfile/tistory/25257E4753D84EE013'
  ];
  private mainImage = this.imageList[
    Math.floor(Math.random() * this.imageList.length)
  ];

  private category: {
    name: string;
    active: boolean;
    list: Array<FirestoreDocument<Project>>;
  }[] = [
    {
      name: '관리자로 있는 프로젝트',
      active: false,
      list: []
    },
    {
      name: '편집자로 있는 프로젝트',
      active: false,
      list: []
    },
    {
      name: '관찰자로 있는 프로젝트',
      active: false,
      list: []
    }
  ];

  get currentProjectList() {
    this.category.forEach(p => {
      if (p.active) this.projectList = p.list;
    });
    return this.projectList;
  }

  private createProject() {
    if (this.projectTitle.length === 0) return;

    const project = Collections.projects.create(Project);
    project.data.name = this.projectTitle;
    `${this.$store.getters.user.id}`;
    project.data.users = {
      [`${this.$store.getters.user.id}`]: 'supervisor'
    };
    project.data.imageURL = this.mainImage;

    project.saveSync();
    this.dialog = false;
    this.projectTitle = '';
  }

  private mounted() {
    console.log(this.mainImage);
    Auth.addChangeListener(
      'drive',
      async u => {
        if (u === null) this.$router.push('login');

        const projects = await Collections.projects.get(Project);
        const users = await Collections.users.get(User);

        projects.forEach(p => {
          const uid = p.data.users[`${this.$store.getters.user.id}`];
          if (uid) {
            this.projectList.push(p);
          }

          if (uid === 'supervisor') {
            this.category[0].list.push(p);
          } else if (uid === 'editor') {
            this.category[1].list.push(p);
          } else {
            this.category[2].list.push(p);
          }
        });

        Collections.projects.clearOnChange();

        //   Collections.projects.onChange(Project, (project, state) => {
        //     if (state === 'added') {
        //       console.log('added');
        //       this.projectList.push(project);
        //     }
        //   });
      },
      true
    );
  }
}
